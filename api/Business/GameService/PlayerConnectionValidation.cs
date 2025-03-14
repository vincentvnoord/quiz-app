using System.Diagnostics.Contracts;

namespace Business.GameService
{
    public enum PlayerConnectionValidationResult
    {
        Success,
        GameNotFound,
        NonRegisteredPlayer,
    }

    public class PlayerConnectionValidation
    {
        public PlayerConnectionValidationResult Status { get; }
        public Player? Player { get; }
        public Game? Game { get; }

        public PlayerConnectionValidation(PlayerConnectionValidationResult status, Player? player = null, Game? game = null)
        {
            Status = status;
            Player = player;
            Game = game;
        }

        public static PlayerConnectionValidation Success(Player player, Game game)
        {
            return new PlayerConnectionValidation(PlayerConnectionValidationResult.Success, player, game);
        }

        public static PlayerConnectionValidation GameNotFound() => new(PlayerConnectionValidationResult.GameNotFound);
        public static PlayerConnectionValidation NonRegisteredPlayer() => new(PlayerConnectionValidationResult.NonRegisteredPlayer);
    }
}