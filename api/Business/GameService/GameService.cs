using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.Models;

namespace Business.GameService
{
    public class GameService
    {
        private readonly ConcurrentDictionary<string, Game> ActiveGames = [];

        // Saves the game code to the user id of host: <hostId, gameId>
        private readonly ConcurrentDictionary<string, string> GameHosts = [];

        public Game? GetGame(string gameId)
        {
            if (ActiveGames.TryGetValue(gameId, out Game? value))
            {
                return value;
            }

            return null;
        }

        public bool IsHost(string gameId, string? hostId, [NotNullWhen(true)] out Game? game)
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
        public PlayerConnectionValidation ValidatePlayerConnection(string gameId, string playerId)
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

        public Game? GetGameByPlayerId(string playerId)
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

        public Game CreateGame(Quiz quiz, string hostId)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, hostId, quiz);

            ActiveGames[gameId] = game;
            GameHosts[hostId] = gameId;

            return game;
        }

        public void CloseGame(string gameId, string hostId)
        {
            ActiveGames.TryRemove(gameId, out _);
            GameHosts.TryRemove(hostId, out _);
        }

        public void CloseGame(Game game)
        {
            ActiveGames.TryRemove(game.Id, out _);
            GameHosts.TryRemove(game.HostId, out _);
        }

        public string? GetGameIdByHostId(string hostId)
        {
            GameHosts.TryGetValue(hostId, out string? gameId);
            return gameId;
        }

        private string GenerateGameId()
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