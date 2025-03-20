using Business.GameService;

namespace Business.Models.Presenters
{
    public record GameStatePresenter
    {
        public string GameState { get; init; }
        public double Timer { get; set; }

        public QuestionPresenter? CurrentQuestion { get; init; }
        public int? CorrectAnswer { get; init; }

        public GameStatePresenter(Game game)
        {
            GameState = game.State.ToString();

            if (game.State.State == GameStateType.Starting)
            {
                Timer = game.RemainingStartTime();
            }

            if (game.State.State == GameStateType.Question || game.State.State == GameStateType.RevealAnswer)
            {
                int currentQuestionIndex = game.CurrentQuestionIndex;
                CurrentQuestion = new QuestionPresenter(game.GetCurrentQuestion(), currentQuestionIndex);
                if (game.QuestionTimer != null)
                {
                    CurrentQuestion.TimeToAnswer = game.QuestionTimer.RemainingTime();
                }
            }

            if (game.State.State == GameStateType.RevealAnswer)
            {
                CorrectAnswer = game.GetCurrentQuestion().CorrectAnswer();
            }
        }
    }
}