using Business.GameSessions;

namespace Api.Models.DTOs.GameState
{
    public record PlayerGameStateDto : GameStateDto
    {
        public PlayerDto Player { get; init; }
        public int Score { get; init; } = 0;

        public PlayerGameStateDto(GameSession session, Player player) : base(session)
        {
            Game game = session.Game;
            Player = new PlayerDto(player);
            if (CurrentQuestion != null)
            {
                CurrentQuestion.HasAnswered = player.HasAnsweredQuestion(game.CurrentQuestionIndex);
            }

            if (CorrectAnswer != null)
            {
                var result = player.GetAnswerResult(game.CurrentQuestionIndex, CorrectAnswer.Index);
                CorrectAnswer.SetPlayerAnswerResult(result);
            }
        }
    }
}