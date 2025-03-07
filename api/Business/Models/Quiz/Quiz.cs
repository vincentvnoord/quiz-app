namespace Business.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Question[] Questions { get; set; }

        public Quiz(int id, string name, Question[] questions)
        {
            Id = id;
            Name = name;
            Questions = questions;
        }
    }
}