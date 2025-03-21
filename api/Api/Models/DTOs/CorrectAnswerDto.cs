
namespace Api.Models.DTOs
{
    public enum PlayerAnswerResult
    {
        Correct,
        Incorrect,
        NoAnswer
    }

    public class CorrectAnswerDto
    {
        public int Index { get; private set; }
        public string? playerAnswerResult { get; private set; }

        public CorrectAnswerDto(int index, PlayerAnswerResult? playerAnswer = null)
        {
            Index = index;
            playerAnswerResult = playerAnswer switch
            {
                PlayerAnswerResult.Correct => "correct",
                PlayerAnswerResult.Incorrect => "incorrect",
                PlayerAnswerResult.NoAnswer => "no-answer",
                _ => null
            };
        }
    }
}