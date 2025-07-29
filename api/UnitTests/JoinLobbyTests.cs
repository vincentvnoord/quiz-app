
using System.ComponentModel.DataAnnotations;
using Api.Controllers;
using Api.Models;
using Business.GameSessions;
using Business.QuizService;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace UnitTests
{
    public class JoinLobbyTests
    {
        private GameSessionManager _sessionManager;
        private GameController _controller;

        [SetUp]
        public void Setup()
        {
            _sessionManager = new GameSessionManager(new Mock<IGameMessenger>().Object, new Mock<IConnectionManager>().Object);
            QuizService quizService = new QuizService(new Mock<IQuizRepository>().Object, new Mock<IQuizGenerator>().Object);
            _controller = new GameController(_sessionManager, quizService);
        }

        [Test]
        public void Join_InvalidModel_ReturnsBadRequest()
        {
            _controller.ModelState.AddModelError("Code", "Required");
            var result = _controller.Join(new JoinGameRequest()
            {
                Code = "",
                PlayerName = "PlayerName"
            });

            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }

        // ST-2.1 
        [TestCase("PlayerName", false)]
        [TestCase("ThisisanamethatstoolongThisisanamethatstoolongThisisanamethatstoolongThisisanamethatstoolongThisisanamethatstoolongThisisanamethatstoolong", true)]
        public void PlayerNameTooLong_ShouldReturnBadRequest(string playerName, bool isBadRequest)
        {
            JoinGameRequest request = new()
            {
                Code = "123456",
                PlayerName = playerName,
            };

            // Simulate the controllers validation happening in ASP.NET
            var context = new ValidationContext(request, null, null);
            var results = new List<ValidationResult>();
            var isValid = Validator.TryValidateObject(request, context, results, true);

            if (!isValid)
            {
                foreach (var validationResult in results)
                {
                    if (validationResult.ErrorMessage == null)
                        continue;

                    _controller.ModelState.AddModelError(validationResult.MemberNames.First(), validationResult.ErrorMessage);
                }
            }
            IActionResult result = _controller.Join(request);

            Assert.That(result is BadRequestObjectResult, Is.EqualTo(isBadRequest));
        }

        // ST-2.2
        [Test]
        public void InvalidModelBinding_ShouldReturnBadRequest()
        {
            // Simulating what happens when an invalid request (an int instead of a string) is received
            _controller.ModelState.AddModelError("Code", "The value '1234' is not valid for Code.");

            IActionResult result = _controller.Join(new JoinGameRequest()
            {
                Code = "123456",
                PlayerName = "PlayerName"
            });

            Assert.That(result is BadRequestObjectResult);
        }

        // ST-2.3
        [TestCase("<script>alert('XSS')</script>", "&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;")]
        [TestCase("<b>Bold Text</b>", "&lt;b&gt;Bold Text&lt;/b&gt;")]
        public void Join_ShouldEncodePlayerName_WhenUnsafeCharactersPassed(string inputName, string expectedEncodedName)
        {
            GameSession session = _sessionManager.CreateGameSession(new Business.Models.Quiz(), "hostId");
            var request = new JoinGameRequest
            {
                Code = session.Game.Id,
                PlayerName = inputName
            };

            IActionResult result = _controller.Join(request);

            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);

            var response = okResult.Value as JoinGameResponse;
            Assert.That(response, Is.Not.Null);

            Assert.That(response.PlayerName, Is.EqualTo(expectedEncodedName));
        }
    }
}
