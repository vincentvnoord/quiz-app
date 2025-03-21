using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.Models;

namespace Business.GameService
{
    public class GameService
    {
        public const int START_TIMER = 5;

        private static readonly ConcurrentDictionary<string, Game> ActiveGames = [];

        // Saves the game code to the user id of host: <hostId, gameId>
        private static readonly ConcurrentDictionary<string, string> GameHosts = [];

        private readonly IConnectionManager _connectionManager;
        private readonly IGameMessenger _gameMessenger;

        public GameService(IConnectionManager connectionManager, IGameMessenger gameMessenger)
        {
            _connectionManager = connectionManager;
            _gameMessenger = gameMessenger;
        }

        public async Task AssignHost(string gameCode, string hostId)
        {
            Game? game = GetGame(gameCode);

            if (game != null)
            {
                await _gameMessenger.HostConnected(hostId, game);
            }
            else
            {
                await _gameMessenger.GameNotFound(hostId);
            }
        }

        public async Task OnPlayerConnected(Player player, Game game)
        {
            await _gameMessenger.NotifyPlayerConnected(game, player);
            await _gameMessenger.NotifyHostPlayerConnected(game.HostId, player);
        }

        public async Task StartGame(string gameCode, string userId)
        {
            Game? game = GetGame(gameCode);
            if (game == null)
            {
                await _gameMessenger.GameNotFound(userId);
                return;
            }

            if (game.HostId != userId)
            {
                await _gameMessenger.UnAuthorized(userId);
                return;
            }

            game.StartGame();
            await _gameMessenger.GameStarted(game.Id, (int)game.StartTimer.TotalMilliseconds);

            await Task.Delay((int)game.StartTimer.TotalMilliseconds);
            await ShowQuestion(game);
        }

        public async Task Continue(string gameCode)
        {
            Game? game = GetGame(gameCode);
            if (game?.State.State != GameStateType.RevealAnswer || game == null)
                return;

            if (game.NoMoreQuestions())
            {
                game.State.SetState(GameStateType.Results);
                await _gameMessenger.GameEnd(game.Id);
                return;
            }

            var state = game.Next();
            if (state.State == GameStateType.Results)
            {
                return;
            }

            await ShowQuestion(game);
        }

        private async Task ShowQuestion(Game game)
        {
            Question currentQuestion = game.StartQuestion();
            await _gameMessenger.Question(game.Id, currentQuestion);
            await Task.Delay(currentQuestion.TimeToAnswer * 1000);
            await RevealAnswer(game, currentQuestion);
        }

        private async Task RevealAnswer(Game game, Question question)
        {
            game.RevealAnswer();
            int correctAnswerIndex = question.Answers.Select(a => a.IsCorrect).ToList().IndexOf(true);

            var tasks = game.Players.Select(player =>
                _gameMessenger.RevealAnswer(player.Id, correctAnswerIndex)
            ).ToList();

            tasks.Add(_gameMessenger.RevealAnswer(game.HostId, correctAnswerIndex));

            await Task.WhenAll(tasks);
        }

        public static Game? GetGame(string gameId)
        {
            if (ActiveGames.TryGetValue(gameId, out Game? value))
            {
                return value;
            }

            return null;
        }

        public static bool IsHost(string gameId, string? hostId, [NotNullWhen(true)] out Game? game)
        {
            game = null;
            if (hostId == null)
                return false;

            Game? g = GetGame(gameId);
            if (g == null)
                return false;

            if (g.HostId != hostId)
                return false;

            game = g;
            return true;
        }

        /// <summary>
        /// Validate if game exists and player is registered
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="playerId"></param>
        /// <returns>Validation object which has the validation status. When succesful, also returns the player and the game object</returns>
        public static PlayerConnectionValidation ValidatePlayerConnection(string gameId, string playerId)
        {
            Game? game = GetGame(gameId);
            if (game == null)
            {
                return PlayerConnectionValidation.GameNotFound();
            }

            if (!game.TryGetPlayer(playerId, out Player? player))
            {
                return PlayerConnectionValidation.NonRegisteredPlayer();
            }

            return PlayerConnectionValidation.Success(player, game);
        }

        public static Game? GetGameByPlayerId(string playerId)
        {
            foreach (Game game in ActiveGames.Values)
            {
                if (game.TryGetPlayer(playerId, out _))
                {
                    return game;
                }
            }

            return null;
        }

        public static Game CreateGame(Quiz quiz, string hostId)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, hostId, quiz, START_TIMER);

            ActiveGames[gameId] = game;
            GameHosts[hostId] = gameId;

            return game;
        }

        public async Task CloseGame(string gameCode, string userId)
        {
            if (IsHost(gameCode, userId, out Game? game))
            {
                ActiveGames.TryRemove(gameCode, out _);
                GameHosts.TryRemove(userId, out _);
                await _gameMessenger.GameClosed(gameCode);

                foreach (Player player in game.Players)
                {
                    await _connectionManager.Disconnect(player.Id, gameCode);
                }
            }
        }

        public static string? GetGameIdByHostId(string hostId)
        {
            GameHosts.TryGetValue(hostId, out string? gameId);
            return gameId;
        }

        private static string GenerateGameId()
        {
            Random random = new();
            string gameId;

            do
            {
                gameId = random.Next(100000, 999999).ToString();
            }
            while (ActiveGames.ContainsKey(gameId));

            return gameId;
        }
    }
}