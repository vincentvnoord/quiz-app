using Business.GameService;

namespace Business.Models.Presenters
{
    public record PlayerConnectState : GameStatePresenter
    {
        public string PlayerId { get; init; }
        public int Score { get; init; } = 0;

        public PlayerConnectState(Game game, string playerId) : base(game)
        {
            PlayerId = playerId;
        }
    }
}