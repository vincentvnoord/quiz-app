namespace Business.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Question[] Questions { get; set; }

        public Quiz()
        {
            Title = "Default Quiz";
            Questions = [];
        }

        public Quiz(int id, string title, Question[] questions)
        {
            Id = id;
            Title = title;
            Questions = questions;
        }
    }
}