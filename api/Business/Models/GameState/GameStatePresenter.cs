using Business.GameService;

namespace Business.Models.GameState
{
    public record GameStatePresenter
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public Player[] Players { get; init; } = [];
    }
}