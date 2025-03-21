using System.Diagnostics.Contracts;
using Business.Models;

namespace Api.Models.DTOs
{
    public record QuestionStateDto
    {
        public int Index { get; private set; }
        public string Text { get; private set; } = default!;
        public string[] Answers { get; private set; } = [];
        public double TimeToAnswer { get; set; }

        public QuestionStateDto(Question question, int questionIndex)
        {
            Index = questionIndex;
            Text = question.Text;
            Answers = [.. question.Answers.Select(a => a.Text)];
            TimeToAnswer = question.TimeToAnswer * 1000;
        }
    }
}