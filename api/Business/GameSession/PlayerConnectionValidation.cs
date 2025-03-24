
namespace Business.GameSessions
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
        public GameSession? Session { get; }

        public PlayerConnectionValidation(PlayerConnectionValidationResult status, Player? player = null, GameSession? session = null)
        {
            Status = status;
            Player = player;
            Session = session;
        }

        public static PlayerConnectionValidation Success(Player player, GameSession game)
        {
            return new PlayerConnectionValidation(PlayerConnectionValidationResult.Success, player, game);
        }

        public static PlayerConnectionValidation GameNotFound() => new(PlayerConnectionValidationResult.GameNotFound);
        public static PlayerConnectionValidation NonRegisteredPlayer() => new(PlayerConnectionValidationResult.NonRegisteredPlayer);
    }
}