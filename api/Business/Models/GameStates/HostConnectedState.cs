using Business.GameService;

namespace Business.Models.GameStates
{
    public record HostConnectedState
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public Player[] Players { get; init; } = [];
    }
}