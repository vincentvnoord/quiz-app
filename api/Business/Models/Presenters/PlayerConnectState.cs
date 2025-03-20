namespace Business.Models.Presenters
{
    public record PlayerConnectState : GameStatePresenter
    {
        public required string PlayerId { get; init; }
        public int Score { get; init; } = 0;
    }
}