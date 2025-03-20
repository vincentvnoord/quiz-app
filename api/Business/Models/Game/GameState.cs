
namespace Business.Models.Game
{
    public enum GameStateType
    {
        Lobby,
        Starting,
        Question,
        RevealAnswer,
        Results
    }

    public class GameState
    {
        public GameStateType State { get; private set; } = GameStateType.Lobby;

        public override string ToString()
        {
            if (State == GameStateType.RevealAnswer)
            {
                return "reveal-answer";
            }

            return State.ToString().ToLower();
        }

        public void SetState(GameStateType state)
        {
            State = state;
        }
    }
}