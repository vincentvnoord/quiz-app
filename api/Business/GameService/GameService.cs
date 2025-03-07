using Business.Models;

namespace Business.GameService
{
    public class GameService
    {
        public static readonly Dictionary<string, Game> ActiveGames = [];

        public GameService()
        {

        }

        public string CreateGame(Quiz quiz)
        {
            string gameId = GenerateGameId();
            Game game = new(gameId, quiz);

            ActiveGames.Add(gameId, game);

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