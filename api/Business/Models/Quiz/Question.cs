namespace Business.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Answer[] Answers { get; set; }
        public int TimeToAnswer { get; set; } = 3;

        public Question(int id, string text, Answer[] answers)
        {
            Id = id;
            Text = text;
            Answers = answers;
        }

        public int CorrectAnswer()
        {
            for (int i = 0; i < Answers.Length; i++)
            {
                if (Answers[i].IsCorrect)
                {
                    return i;
                }
            }
            return -1;
        }
    }
}