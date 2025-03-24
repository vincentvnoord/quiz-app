
using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.GameSessions;
using Business.Models;

namespace Business.GameSessions
{
    public class GameSessionManager
    {
        private static readonly ConcurrentDictionary<string, GameSession> ActiveGames = [];

        // Saves the game code to the user id of host: <hostId, gameId>
        private static readonly ConcurrentDictionary<string, string> GameHosts = [];

        private readonly IConnectionManager _connectionManager;
        private readonly IGameMessenger _gameMessenger;

        public GameSessionManager(IGameMessenger gameMessenger, IConnectionManager connectionManager)
        {
            _gameMessenger = gameMessenger;
            _connectionManager = connectionManager;
        }

        public static GameSession? GetGameSessionByPlayerId(string playerId)
        {
            foreach (GameSession session in ActiveGames.Values)
            {
                if (session.Game.TryGetPlayer(playerId, out _))
                {
                    return session;
                }
            }

            return null;
        }

        public static GameSession? GetGameSession(string gameId)
        {
            if (ActiveGames.TryGetValue(gameId, out GameSession? value))
            {
                return value;
            }

            return null;
        }

        public GameSession CreateGameSession(Quiz quiz, string hostId)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, hostId, quiz, 5);
            GameSession session = new(game, _gameMessenger, _connectionManager);

            ActiveGames[gameId] = session;
            GameHosts[hostId] = gameId;

            return session;
        }

        public async Task CloseGame(string gameCode, string userId)
        {
            if (IsHost(gameCode, userId, out GameSession? session))
            {
                ActiveGames.TryRemove(gameCode, out _);
                GameHosts.TryRemove(userId, out _);
                await _gameMessenger.GameClosed(gameCode);

                foreach (Player player in session.Game.Players)
                {
                    await _connectionManager.Disconnect(player.Id, gameCode);
                }
            }
        }

        /// <summary>
        /// Validate if game exists and player is registered
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="playerId"></param>
        /// <returns>Validation object which has the validation status. When succesful, also returns the player and the game object</returns>
        public static PlayerConnectionValidation ValidatePlayerConnection(string gameId, string playerId)
        {
            GameSession? session = GetGameSession(gameId);
            if (session == null)
            {
                return PlayerConnectionValidation.GameNotFound();
            }

            if (!session.Game.TryGetPlayer(playerId, out Player? player))
            {
                return PlayerConnectionValidation.NonRegisteredPlayer();
            }

            return PlayerConnectionValidation.Success(player, session);
        }

        public static bool IsHost(string gameId, string? hostId, [NotNullWhen(true)] out GameSession? game)
        {
            game = null;
            if (hostId == null)
                return false;

            GameSession? session = GetGameSession(gameId);
            if (session == null)
                return false;

            if (session.Game.HostId != hostId)
                return false;

            game = session;
            return true;
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