using Business.GameService;
using Business.Models;

namespace UnitTests.GameSessionTests
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
                Game game = gameService.CreateGame(_quiz, "host");
                string gameId = game.Id;
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
            Game game = gameService.CreateGame(_quiz, "host");
            string gameId = game.Id;

            Assert.That(gameService.GetGame(gameId), Is.Not.Null);

            gameService.CloseGame(gameId, "host");

            Assert.That(gameService.GetGame(gameId), Is.Null);
        }

        [Test]
        public void ValidatePlayerConnection_Returns_Success_WhenValid()
        {
            var gameService = new GameService();
            Game game = gameService.CreateGame(_quiz, "host");

            Player player = new("player", game.Id);
            game.TryAddPlayer(player);

            var validationResult = gameService.ValidatePlayerConnection(game.Id, player.Id);

            Assert.That(validationResult.Status, Is.EqualTo(PlayerConnectionValidationResult.Success));
        }

        [Test]
        public void ValidatePlayerConnection_Returns_GameNotFound_WhenGameIdNotRegistered()
        {
            var gameService = new GameService();
            string gameId = "nonexistent";
            string playerId = "player";

            PlayerConnectionValidation result = gameService.ValidatePlayerConnection(gameId, playerId);

            Assert.That(result.Status, Is.EqualTo(PlayerConnectionValidationResult.GameNotFound));
        }

        [Test]
        public void ConnectPlayer_Returns_NonRegisteredPlayer_WhenPlayerIsNotRegistered()
        {
            var gameService = new GameService();
            Game game = gameService.CreateGame(_quiz, "host");
            string playerId = "player";

            PlayerConnectionValidation result = gameService.ValidatePlayerConnection(game.Id, playerId);

            Assert.That(result.Status, Is.EqualTo(PlayerConnectionValidationResult.NonRegisteredPlayer));
        }
    }
}