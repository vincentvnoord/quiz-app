using Business.Models;

namespace Business.GameService
{
    public class GameService
    {
        public readonly Dictionary<string, Game> ActiveGames = [];

        public GameService()
        {

        }

        public Game? GetGame(string gameId)
        {
            if (ActiveGames.TryGetValue(gameId, out Game? value))
            {
                return value;
            }

            return null;
        }

        public string CreateGame(Quiz quiz)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, quiz);

            ActiveGames.Add(gameId, game);

            return gameId;
        }

        public void CloseGame(string gameId)
        {
            ActiveGames.Remove(gameId);
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