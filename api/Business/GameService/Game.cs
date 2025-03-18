using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using System.Linq.Expressions;
using Business.Models;

namespace Business.GameService
{
    public enum GameState
    {
        Lobby,
        InProgress,
        Finished,
    }

    public class Game
    {
        public GameState State { get; private set; } = GameState.Lobby;
        public const int MAX_PLAYERS = 50;
        public string Id { get; private set; }
        public Quiz Quiz { get; private set; }
        public string? HostConnectionId { get; set; }
        public string HostId { get; private set; }

        public ConcurrentBag<Player> Players { get; private set; } = [];

        public Game(string id, string hostId, Quiz quiz)
        {
            Id = id;
            HostId = hostId;
            Quiz = quiz;
        }

        public bool TryAddPlayer(Player player)
        {
            if (Players.Count >= MAX_PLAYERS || State != GameState.Lobby)
            {
                return false;
            }

            Players.Add(player);
            return true;
        }

        // Not efficient at large player scales, but good if kept small
        public void RemovePlayer(string playerId)
        {
            Player? player = Players.FirstOrDefault(p => p.Id == playerId);
            if (player != null)
            {
                Players = [.. Players.Where(p => p.Id != playerId)];
            }
        }

        public bool TryGetPlayer(string playerId, [NotNullWhen(true)] out Player? player)
        {
            player = Players.FirstOrDefault(p => p.Id == playerId);
            return player != null;
        }
    }
}