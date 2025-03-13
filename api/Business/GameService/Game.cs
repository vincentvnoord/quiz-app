using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.Models;

namespace Business.GameService
{
    public class Game
    {
        public const int MAX_PLAYERS = 50;
        public string Id { get; private set; }
        public Quiz Quiz { get; private set; }
        public string? HostConnectionId { get; set; }

        public ConcurrentBag<Player> Players { get; private set; } = [];

        public Game(string id, Quiz quiz)
        {
            Id = id;
            Quiz = quiz;
        }

        public void AddPlayer(Player player)
        {
            if (Players.Count >= MAX_PLAYERS)
            {
                throw new Exception("Game is full.");
            }

            Players.Add(player);
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