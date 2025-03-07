using Business.GameService;
using Microsoft.AspNetCore.SignalR;

namespace Api
{
    public class GameHub : Hub
    {
        private GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public async Task ConnectHost(string gameCode)
        {
            if (GameService.ActiveGames.ContainsKey(gameCode))
            {
                GameService.ActiveGames[gameCode].HostConnectionId = Context.ConnectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Group(gameCode).SendAsync("HostConnected", Context.ConnectionId);
            }
        }

        public async Task JoinGame(string gameCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Group(gameCode).SendAsync("PlayerJoined", Context.ConnectionId);
        }
    }
}