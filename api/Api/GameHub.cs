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
                    Players = game.Players.Select(p => new
                    {
                        Id = p.Id,
                        Name = p.Name
                    })
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
            await Task.Delay(2000);
            Game? game = _gameService.GetGame(gameCode);
            if (game == null)
            {
                await Clients.Client(Context.ConnectionId).SendAsync("GameNotFound");
                Context.Abort();
                return;
            }

            if (game.TryGetPlayer(playerId, out var player))
            {
                _playerConnections[playerId] = Context.ConnectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
                await Clients.Client(Context.ConnectionId).SendAsync("Connected", player.Name);

                var host = game.HostConnectionId;
                if (host != null)
                    await Clients.Client(host).SendAsync("PlayerJoined", new
                    {
                        Id = player.Id,
                        Name = player.Name
                    });
            }
            else
            {
                await Clients.Client(Context.ConnectionId).SendAsync("NonRegisteredPlayer");
                Context.Abort();
                return;
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            var playerId = _playerConnections[connectionId];
            _playerConnections.TryRemove(playerId, out _);

            return base.OnDisconnectedAsync(exception);
        }
    }
}