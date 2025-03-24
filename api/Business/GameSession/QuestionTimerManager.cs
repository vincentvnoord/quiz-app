using Business.Models;

namespace Business.GameSessions
{

    public class QuestionTimerManager
    {
        private readonly QuestionTimer timer;
        private readonly int _timeToAnswer;

        private event Action? OnTimerCompleted;
        private Action? _subscribedAction;
        private readonly CancellationTokenSource _cancellationTokenSource = new();

        public QuestionTimerManager(int timeToAnswer)
        {
            _timeToAnswer = timeToAnswer;
            timer = new QuestionTimer(timeToAnswer);
        }

        public void StartTimer()
        {
            timer.Start();
            Task _timerTask = Task.Delay(_timeToAnswer * 1000, _cancellationTokenSource.Token);
            _timerTask.ContinueWith(t => OnTimerCompleted?.Invoke(), TaskScheduler.Default);
        }

        public void OnTimerComplete(Action action)
        {
            _subscribedAction = action;
            OnTimerCompleted += action;
        }

        public void CancelTimer()
        {
            if (_subscribedAction != null)
            {
                OnTimerCompleted -= _subscribedAction;
                _subscribedAction = null;
            }

            if (!_cancellationTokenSource.Token.IsCancellationRequested)
            {
                _cancellationTokenSource.Cancel();
            }

            _cancellationTokenSource?.Dispose();
        }

        public double RemainingTime()
        {
            return timer.RemainingTime();
        }
    }
}