using Business.Models;

namespace Business.GameService
{
    public class QuestionTimer
    {
        private TimeSpan _timeToAnswer;
        private readonly DateTime _startedAt;
        public Question Question { get; private set; }

        public QuestionTimer(Question question)
        {
            Question = question;
            _startedAt = DateTime.UtcNow;
            _timeToAnswer = TimeSpan.FromSeconds(question.TimeToAnswer);
        }

        public double RemainingTime()
        {
            double elapsedTime = (DateTime.UtcNow - _startedAt).TotalMilliseconds;
            double remainingTime = _timeToAnswer.TotalMilliseconds - elapsedTime;
            Console.WriteLine($"StartedAt: {_startedAt}, Elapsed: {elapsedTime}ms, Remaining: {remainingTime}ms");

            return remainingTime < 0 ? 0 : remainingTime;
        }
    }
}