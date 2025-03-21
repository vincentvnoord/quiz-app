
namespace Api.Models.DTOs
{
    public enum PlayerAnswerResultType
    {
        Correct,
        Incorrect,
        NoAnswer
    }

    public class CorrectAnswerDto
    {
        public int Index { get; private set; }
        public string? PlayerAnswerResult { get; private set; }

        public CorrectAnswerDto(int index, PlayerAnswerResultType? playerAnswer = null)
        {
            Index = index;
            PlayerAnswerResult = playerAnswer switch
            {
                PlayerAnswerResultType.Correct => "correct",
                PlayerAnswerResultType.Incorrect => "incorrect",
                PlayerAnswerResultType.NoAnswer => "no-answer",
                _ => null
            };
        }
    }
}