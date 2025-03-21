namespace Business.Models
{
    public class QuestionTimer
    {
        private TimeSpan _timeToAnswer;
        private DateTime _startedAt;

        public QuestionTimer(int timeInSeconds)
        {
            _startedAt = DateTime.UtcNow;
            _timeToAnswer = TimeSpan.FromSeconds(timeInSeconds);
        }

        public void Start()
        {
            _startedAt = DateTime.UtcNow;
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