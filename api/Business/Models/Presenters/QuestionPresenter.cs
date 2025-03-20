using System.Diagnostics.Contracts;

namespace Business.Models.Presenters
{
    public record QuestionPresenter
    {
        public int Index { get; private set; }
        public string Text { get; private set; } = default!;
        public string[] Answers { get; private set; } = [];
        public double TimeToAnswer { get; set; }

        public QuestionPresenter(Question question, int questionIndex)
        {
            Index = questionIndex;
            Text = question.Text;
            Answers = [.. question.Answers.Select(a => a.Text)];
            TimeToAnswer = question.TimeToAnswer * 1000;
        }
    }
}