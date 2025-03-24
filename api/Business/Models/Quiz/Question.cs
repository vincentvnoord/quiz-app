using Business.GameSessions;

namespace Business.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Answer[] Answers { get; set; }

        /// <summary>
        /// Time in seconds to answer the question
        /// </summary>
        public int TimeToAnswer { get; set; }

        public Question(int id, string text, Answer[] answers, int timeToAnswer = 3)
        {
            Id = id;
            Text = text;
            Answers = answers;
            TimeToAnswer = timeToAnswer;
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