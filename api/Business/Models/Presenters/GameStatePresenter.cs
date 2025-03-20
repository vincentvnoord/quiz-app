using Business.GameService;

namespace Business.Models.Presenters
{
    public record GameStatePresenter
    {
        public required string GameState { get; init; }
        public int Timer { get; init; }

        public QuestionPresenter? CurrentQuestion { get; init; }
        public int? CorrectAnswer { get; init; }
    }
}