namespace Business.Models.Presenters
{
    public record HostConnectState : GameStatePresenter
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public PlayerStatePresenter[] Players { get; init; } = [];
    }
}