using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.GameSessions;
using Microsoft.AspNetCore.SignalR;

namespace Api.GameHubManagement
{
    public class ConnectionManager : IConnectionManager
    {
        // A dictionary to reference the connection id with the player id: <playerId, connectionId>
        private static readonly ConcurrentDictionary<string, string> _playerToConnection = [];

        // A dictionary to reference the player id with the connection id: <connectionId, playerId>
        private static readonly ConcurrentDictionary<string, string> _connectionToPlayer = [];

        private readonly IHubContext<GameHub> _hubContext;

        public ConnectionManager(IHubContext<GameHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void Connect(string userId, string gameCode, string connectionId)
        {
            // Add the connection to the group
            _hubContext.Groups.AddToGroupAsync(connectionId, gameCode);

            // Add the connection to the player
            AddOrUpdatePlayerConnection(userId, connectionId);
        }

        public async Task Disconnect(string userId, string gameCode)
        {
            // Remove the connection from the player
            if (TryRemovePlayer(userId, out var connectionId))
            {
                await _hubContext.Groups.RemoveFromGroupAsync(connectionId, gameCode);
            }
        }

        /// <summary>
        /// Add a player connection coupled to the player id
        /// </summary>
        /// <param name="playerId"></param>
        /// <param name="connectionId"></param>
        /// <returns>Current connection id of player</returns>
        public string AddOrUpdatePlayerConnection(string playerId, string connectionId)
        {
            _playerToConnection.AddOrUpdate(playerId, connectionId, (key, oldValue) => connectionId);
            _connectionToPlayer.AddOrUpdate(connectionId, playerId, (key, oldValue) => playerId);
            return connectionId;
        }

        /// <summary>
        /// Remove a player connection by connection id
        /// </summary>
        /// <param name="connectionId"></param>
        /// <returns></returns>
        public bool TryRemoveConnection(string connectionId)
        {
            if (_connectionToPlayer.TryRemove(connectionId, out var playerId))
            {
                _playerToConnection.TryRemove(playerId, out _);
                return true;
            }

            return false;
        }

        public static bool TryRemovePlayer(string playerId, [NotNullWhen(true)] out string? connectionId)
        {
            if (_playerToConnection.TryRemove(playerId, out string? id))
            {
                connectionId = id;
                _connectionToPlayer.TryRemove(id, out _);
                return true;
            }

            connectionId = null;
            return false;
        }

        /// <summary>
        /// Get the player id of a connection id
        /// </summary>
        /// <param name="connectionId"></param>
        /// <returns>Null if player is not connected</returns>
        public string? GetPlayerId(string connectionId)
        {
            _connectionToPlayer.TryGetValue(connectionId, out var playerId);
            return playerId;
        }

        /// <summary>
        /// Get the connection id of a player their id
        /// </summary>
        /// <param name="playerId"></param>
        /// <returns></returns>
        public string? GetConnectionId(string playerId)
        {
            _playerToConnection.TryGetValue(playerId, out var connectionId);
            return connectionId;
        }

        public bool IsPlayerConnected(string playerId)
        {
            return _playerToConnection.ContainsKey(playerId);
        }

        public Player[] getConnectedPlayers(Game game)
        {
            return [.. game.Players.Where(p => IsPlayerConnected(p.Id))];
        }

    }
}