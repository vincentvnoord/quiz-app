namespace Business.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }

        public Answer(int id, string text, bool isCorrect)
        {
            Id = id;
            Text = text;
            IsCorrect = isCorrect;
        }
    }
}