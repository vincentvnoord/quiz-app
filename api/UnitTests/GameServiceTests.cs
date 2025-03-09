using Business.GameService;
using Business.Models;

namespace UnitTests
{
    public class GameServiceTests
    {

        private Quiz _quiz;

        [SetUp]
        public void SetUp()
        {
            _quiz = new Quiz
            {
                Title = "Test Quiz",
                Questions = [
                    new Question(1, "Test Question 1"),
                ]
            };
        }
        
        [Test]
        public void NewGame_CreatesUniqueCodes()
        {

            HashSet<string> gameIds = [];
            var gameService = new GameService();
            int numberOfGames = 100000;

            for (int i = 0; i < numberOfGames; i++)
            {
                string gameId = gameService.CreateGame(_quiz);
                Assert.Multiple(() =>
                {
                    Assert.That(gameId, Has.Length.EqualTo(6), $"Game code length is not 6: {gameId}");
                    Assert.That(gameIds, Does.Not.Contain(gameId), $"Duplicate code found: {gameId}");
                });
            }
        }

        [Test]
        public void CloseGame_RemovesGameFromActiveGames()
        {
            var gameService = new GameService();
            string gameId = gameService.CreateGame(_quiz);

            Assert.That(gameService.ActiveGames, Contains.Key(gameId));

            gameService.CloseGame(gameId);

            Assert.That(gameService.ActiveGames, Does.Not.ContainKey(gameId));
        }
    }
}