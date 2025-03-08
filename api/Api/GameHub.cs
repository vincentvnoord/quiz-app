using Business.GameService;
using Microsoft.AspNetCore.SignalR;

namespace Api
{
    public class GameHub(GameService gameService) : Hub
    {
        private readonly GameService _gameService = gameService;

        public async Task ConnectHost(string gameCode)
        {
            var connectionId = Context.ConnectionId;
            Game? game = _gameService.GetGame(gameCode);

            if (game != null)
            {
                game.HostConnectionId = connectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Client(connectionId).SendAsync("HostConnected", new
                {
                    Title = game.Quiz.Title,
                    QuestionCount = game.Quiz.Questions.Length
                });
            }
            else
            {
                await Clients.Client(connectionId).SendAsync("GameNotFound");
                Context.Abort();
            }
        }

        public async Task JoinGame(string gameCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Group(gameCode).SendAsync("PlayerJoined", Context.ConnectionId);
        }
    }
}