using Business.GameService;
using Business.Models;
using NUnit.Framework;

namespace UnitTests.GameSessionTests
{
    public class GameTests
    {
        private Quiz _quiz;

        [SetUp]
        public void Setup()
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
        public void TryAddPlayer_Returns_False_WhenGameIsFull()
        {
            Game game = GameService.CreateGame(_quiz, "host");

            for (int i = 0; i < Game.MAX_PLAYERS; i++)
            {
                game.TryAddPlayer(new Player($"player{i}", game.Id));
            }

            Assert.That(game.TryAddPlayer(new Player("player", game.Id)), Is.False);
        }

        [Test]
        public void TryAddPlayer_Returns_True_WhenPlayerIsAdded()
        {
            Game game = GameService.CreateGame(_quiz, "host");

            Assert.That(game.TryAddPlayer(new Player("player", game.Id)), Is.True);
        }
    }
}