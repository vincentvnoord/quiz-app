
using Business.GameService;
using Microsoft.SqlServer.Server;

namespace Api.Models.DTOs
{
    public class CorrectAnswerDto
    {
        public int Index { get; private set; }
        public string? PlayerAnswerResult { get; private set; }

        public CorrectAnswerDto(int index, PlayerAnswerResultType? playerAnswer = null)
        {
            Index = index;
            PlayerAnswerResult = FormatPlayerAnswerResult(playerAnswer);
        }

        public void SetPlayerAnswerResult(PlayerAnswerResultType? playerAnswer)
        {
            PlayerAnswerResult = FormatPlayerAnswerResult(playerAnswer);
        }

        private static string? FormatPlayerAnswerResult(PlayerAnswerResultType? playerAnswer)
        {
            return playerAnswer switch
            {
                PlayerAnswerResultType.Correct => "correct",
                PlayerAnswerResultType.Incorrect => "incorrect",
                PlayerAnswerResultType.NoAnswer => "no-answer",
                _ => null
            };
        }
    }
}