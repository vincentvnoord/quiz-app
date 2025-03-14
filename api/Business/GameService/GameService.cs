using System.Collections.Concurrent;
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

        public PlayerConnectionResult ConnectPlayer(string gameId, string playerId)
        {
            Game? game = GetGame(gameId);
            if (game == null)
            {
                return PlayerConnectionResult.GameNotFound();
            }

            if (!game.TryGetPlayer(playerId, out Player? player))
            {
                return PlayerConnectionResult.NonRegisteredPlayer();
            }

            return PlayerConnectionResult.Success(player, game);
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

        public string CreateGame(Quiz quiz, string hostId)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, quiz);

            ActiveGames[gameId] = game;
            GameHosts[hostId] = gameId;

            return gameId;
        }

        public void CloseGame(string gameId, string hostId)
        {
            ActiveGames.TryRemove(gameId, out _);
            GameHosts.TryRemove(hostId, out _);
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