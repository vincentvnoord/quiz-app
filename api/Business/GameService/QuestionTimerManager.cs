using Business.GameService;
using Business.Models;

namespace Businessn.GameService
{
    public class QuestionTimerManager
    {
        private readonly Question _question;

        private readonly CancellationTokenSource _cancellationTokenSource = new();

        public event Action? TimeRunOut;

        public QuestionTimerManager(Question question)
        {
            _question = question;
        }

        public void StartTimer()
        {
            Task _timerTask = Task.Delay(_question.TimeToAnswer * 1000, _cancellationTokenSource.Token);
            _timerTask.ContinueWith(t => OnTimerCompleted(), TaskScheduler.Default);
        }

        private void OnTimerCompleted()
        {
            TimeRunOut?.Invoke();
        }

        public void CancelTimer()
        {
            if (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                _cancellationTokenSource.Cancel();
            }

            _cancellationTokenSource?.Dispose();
        }
    }
}