using System.Collections.Concurrent;
using Business.GameService;
using Microsoft.AspNetCore.SignalR;

namespace Api
{
    public class GameHub(GameService gameService) : Hub
    {
        private static ConcurrentDictionary<string, string> _playerConnections = [];
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
                    QuestionCount = game.Quiz.Questions.Length,
                    Players = game.Players.Select(p => new { p.Name })
                });
            }
            else
            {
                await Clients.Client(connectionId).SendAsync("GameNotFound");
                Context.Abort();
            }
        }

        public async Task CloseGame(string gameCode)
        {
            // Delay to allow the host to see the game closing
            await Task.Delay(2000);
            _gameService.CloseGame(gameCode);
            await Clients.Group(gameCode).SendAsync("GameClosed");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameCode);
        }

        public async Task ConnectPlayer(string gameCode, string playerId)
        {
            Game? game = _gameService.GetGame(gameCode);
            if (game == null)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("GameNotFound");
                Context.Abort();
                return;
            }

            bool playerExists = _gameService.GetGame(gameCode)?.PlayerExists(playerId) ?? false;
            if (!playerExists)
            {
                Context.Abort();
                return;
            }

            _playerConnections[playerId] = Context.ConnectionId;
            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Group(gameCode).SendAsync("PlayerJoined", Context.ConnectionId);
        }
    }
}