using System.Diagnostics.Contracts;

namespace Business.GameService
{
    public enum PlayerConnectionResultStatus
    {
        Success,
        GameNotFound,
        NonRegisteredPlayer,
    }

    public class PlayerConnectionResult
    {
        public PlayerConnectionResultStatus Status { get; }
        public Player? Player { get; }
        public Game? Game { get; }

        public PlayerConnectionResult(PlayerConnectionResultStatus status, Player? player = null, Game? game = null)
        {
            Status = status;
            Player = player;
            Game = game;
        }

        public static PlayerConnectionResult Success(Player player, Game game)
        {
            return new PlayerConnectionResult(PlayerConnectionResultStatus.Success, player, game);
        }

        public static PlayerConnectionResult GameNotFound() => new(PlayerConnectionResultStatus.GameNotFound);
        public static PlayerConnectionResult NonRegisteredPlayer() => new(PlayerConnectionResultStatus.NonRegisteredPlayer);
    }
}