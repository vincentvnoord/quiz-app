using Business.GameService;
using Business.Models;

namespace Api.Models.DTOs
{
    public record GameStateDto
    {
        public string GameState { get; init; }
        public double Timer { get; set; }

        public QuestionStateDto? CurrentQuestion { get; init; }
        public CorrectAnswerDto? CorrectAnswer { get; init; }

        public GameStateDto(Game game)
        {
            GameState = game.State.ToString();

            if (game.State.State == GameStateType.Starting)
            {
                Timer = game.RemainingStartTime();
            }

            if (game.State.State == GameStateType.Question || game.State.State == GameStateType.RevealAnswer)
            {
                int currentQuestionIndex = game.CurrentQuestionIndex;
                var question = game.GetCurrentQuestion();
                CurrentQuestion = new QuestionStateDto(question, currentQuestionIndex)
                {
                    TimeToAnswer = question.Timer.RemainingTime()
                };
            }

            if (game.State.State == GameStateType.RevealAnswer)
            {
                CorrectAnswer = new CorrectAnswerDto(game.GetCurrentQuestion().CorrectAnswer());
            }
        }
    }
}