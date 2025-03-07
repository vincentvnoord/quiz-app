using Business.Models;

namespace Business.GameService
{
    public class Game
    {
        public string Id { get; private set; }
        public Quiz Quiz { get; private set; }
        public string? HostConnectionId { get; set; }
    
        public Game(string id, Quiz quiz)
        {
            Id = id;
            Quiz = quiz;
        }
    }
}