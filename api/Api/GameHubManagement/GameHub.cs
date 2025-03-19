using System.Security.Claims;
using Business.GameService;
using Business.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class GameHub(GameService gameService, IConnectionManager connectionManager) : Hub
    {
        private readonly IConnectionManager _connectionManager = connectionManager;
        private readonly GameService _gameService = gameService;

        [Authorize]
        public async Task ConnectHost(string gameCode)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            if (userId == null)
            {
                return;
            }

            _connectionManager.Connect(userId, Context.ConnectionId);
            await _gameService.AssignHost(gameCode, userId);
        }

        [Authorize]
        public async Task StartGame(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_gameService.IsHost(gameCode, userId, out Game? game))
            {
                if (game == null)
                {
                    return;
                }

                int delay = 5;
                await Clients.Group(gameCode).SendAsync("GameStarted", delay);
                game.StartGame();
                await Task.Delay(delay * 1000);
                await SendQuestion(game);
            }
        }

        [Authorize]
        public async Task Continue(string gameCode)
        {
            Game? game = _gameService.GetGame(gameCode);
            if (game?.State != GameState.RevealQuestion || game == null)
                return;

            if (game.NoMoreQuestions())
            {
                await Clients.Group(game.Id).SendAsync("GameEnd");
                return;
            }

            game.Next();
            await SendQuestion(game);
        }

        private async Task SendQuestion(Game game)
        {
            Question currentQuestion = game.GetCurrentQuestion();
            await Clients.Group(game.Id).SendAsync("Question", new
            {
                Index = game.CurrentQuestionIndex,
                Text = currentQuestion.Text,
                Answers = currentQuestion.Answers.Select(a => a.Text),
                TimeToAnswer = currentQuestion.TimeToAnswer,
            });

            await RevealAnswer(game, currentQuestion);
        }

        private async Task RevealAnswer(Game game, Question question)
        {
            await Task.Delay(question.TimeToAnswer * 1000);
            int correctAnswerIndex = question.Answers.ToList().FindIndex(a => a.IsCorrect);
            await Clients.Group(game.Id).SendAsync("RevealAnswer", correctAnswerIndex);
            game.RevealAnswer();
        }

        [Authorize]
        public async Task CloseGame(string gameCode)
        {
            string? userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (_gameService.IsHost(gameCode, userId, out Game? game))
            {
                _gameService.CloseGame(game);
                await Clients.Group(gameCode).SendAsync("GameClosed");
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
            }
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            PlayerConnectionValidation result = _gameService.ValidatePlayerConnection(gameCode, playerId);
            if (result.Status == PlayerConnectionValidationResult.GameNotFound)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("GameNotFound");
                Context.Abort();
                return;
            }

            if (result.Status == PlayerConnectionValidationResult.NonRegisteredPlayer)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("NonRegisteredPlayer");
                Context.Abort();
                return;
            }

            Player player = result.Player!;
            Game game = result.Game!;

            string connectionId = _connectionManager.AddOrUpdatePlayerConnection(playerId, Context.ConnectionId);
            await Groups.AddToGroupAsync(connectionId, gameCode);
            await Clients.Client(connectionId).SendAsync("Connected", player.Name);

            var host = game.HostConnectionId;
            if (host != null)
                await Clients.Client(host).SendAsync("PlayerJoined", new
                {
                    Id = player.Id,
                    Name = player.Name,
                });
        }

        public override async Task<Task> OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            string? playerId = _connectionManager.GetPlayerId(connectionId);
            if (playerId != null)
            {
                var game = _gameService.GetGameByPlayerId(playerId);
                if (game != null)
                {
                    await Clients.Client(game.HostConnectionId ?? "").SendAsync("PlayerDisconnected", playerId);
                }
            }

            _connectionManager.TryRemoveConnection(connectionId);

            return base.OnDisconnectedAsync(exception);
        }
    }
}