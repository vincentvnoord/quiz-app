using System.Collections.Concurrent;
using Business.Models;

namespace Business.GameService
{
    public class GameService
    {
        public readonly ConcurrentDictionary<string, Game> ActiveGames = [];

        public Game? GetGame(string gameId)
        {
            if (ActiveGames.TryGetValue(gameId, out Game? value))
            {
                return value;
            }

            return null;
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

        public string CreateGame(Quiz quiz)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, quiz);

            ActiveGames[gameId] = game;

            return gameId;
        }

        public void CloseGame(string gameId)
        {
            ActiveGames.TryRemove(gameId, out _);
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