using Business.GameService;

namespace Api.Models.DTOs
{
    public record PlayerGameStateDto : GameStateDto
    {
        public PlayerDto Player { get; init; }
        public int Score { get; init; } = 0;

        public PlayerGameStateDto(Game game, Player player) : base(game)
        {
            Player = new PlayerDto(player);
        }
    }
}