using Business.GameSessions;
using Business.Models;
using Moq;

namespace UnitTests.GameSessionTests
{
    public class GameSessionManagerTests
    {

        private Quiz _quiz;

        [SetUp]
        public void SetUp()
        {
            _quiz = new Quiz
            {
                Title = "Test Quiz",
                Questions = [
                    new Question(1, "Test Question 1", []),
                ]
            };
        }

        [Test]
        public void NewGame_CreatesUniqueCodes()
        {
            var sessionManager = new GameSessionManager(new Mock<IGameMessenger>().Object, new Mock<IConnectionManager>().Object);
            HashSet<string> gameIds = [];
            int numberOfGames = 100000;

            for (int i = 0; i < numberOfGames; i++)
            {
                GameSession session = sessionManager.CreateGameSession(_quiz, "host");
                string gameId = session.Game.Id;
                Assert.Multiple(() =>
                {
                    Assert.That(gameId, Has.Length.EqualTo(6), $"Game code length is not 6: {gameId}");
                    Assert.That(gameIds, Does.Not.Contain(gameId), $"Duplicate code found: {gameId}");
                });
            }
        }

        [Test]
        public async Task CloseGame_RemovesGameFromActiveGames()
        {
            var sessionManager = new GameSessionManager(new Mock<IGameMessenger>().Object, new Mock<IConnectionManager>().Object);
            GameSession game = sessionManager.CreateGameSession(_quiz, "host");
            string gameId = game.Game.Id;

            Assert.That(GameSessionManager.GetGameSession(gameId), Is.Not.Null);

            await sessionManager.CloseGame(gameId, "host");

            Assert.That(GameSessionManager.GetGameSession(gameId), Is.Null);
        }

        [Test]
        public void ValidatePlayerConnection_Returns_Success_WhenValid()
        {
            var sessionManager = new GameSessionManager(new Mock<IGameMessenger>().Object, new Mock<IConnectionManager>().Object);
            GameSession session = sessionManager.CreateGameSession(_quiz, "host");

            Player player = new("player", session.Game.Id);
            session.Game.TryAddPlayer(player);

            var validationResult = GameSessionManager.ValidatePlayerConnection(session.Game.Id, player.Id);

            Assert.That(validationResult.Status, Is.EqualTo(PlayerConnectionValidationResult.Success));
        }

        [Test]
        public void ValidatePlayerConnection_Returns_GameNotFound_WhenGameIdNotRegistered()
        {
            string gameId = "nonexistent";
            string playerId = "player";

            PlayerConnectionValidation result = GameSessionManager.ValidatePlayerConnection(gameId, playerId);

            Assert.That(result.Status, Is.EqualTo(PlayerConnectionValidationResult.GameNotFound));
        }

        [Test]
        public void ConnectPlayer_Returns_NonRegisteredPlayer_WhenPlayerIsNotRegistered()
        {
            var sessionManager = new GameSessionManager(new Mock<IGameMessenger>().Object, new Mock<IConnectionManager>().Object);
            GameSession session = sessionManager.CreateGameSession(_quiz, "host");
            string playerId = "player";

            PlayerConnectionValidation result = GameSessionManager.ValidatePlayerConnection(session.Game.Id, playerId);

            Assert.That(result.Status, Is.EqualTo(PlayerConnectionValidationResult.NonRegisteredPlayer));
        }
    }
}