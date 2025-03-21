using Business.GameService;

namespace Business.Models.Presenters
{
    public record HostConnectState : GameStatePresenter
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public PlayerStatePresenter[] Players { get; init; } = [];

        public HostConnectState(Game game, PlayerStatePresenter[] players) : base(game)
        {
            Title = game.Quiz.Title;
            QuestionCount = game.Quiz.Questions.Length;
            Players = players;
        }
    }
}