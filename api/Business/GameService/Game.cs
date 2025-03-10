using System.Collections.Concurrent;
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

        public bool PlayerExists(string playerId)
        {
            return Players.Any(p => p.Id == playerId);
        }
    }
}