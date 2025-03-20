using System.Diagnostics.Contracts;

namespace Business.Models.Presenters
{
    public record QuestionPresenter
    {
        public required int Index { get; init; }
        public required string Text { get; init; } = default!;
        public required string[] Answers { get; init; } = [];
        public required int TimeToAnswer { get; init; }
    }
}