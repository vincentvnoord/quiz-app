
using Business.GameSessions;
using Business.Models;

namespace Business.GameSessions
{
    public class GameSession
    {
        public Game Game { get; private set; }
        private readonly IGameMessenger _gameMessenger;
        private readonly IConnectionManager _connectionManager;

        public QuestionTimerManager? QuestionTimerManager { get; private set; }

        public GameSession(Game game, IGameMessenger gameMessenger, IConnectionManager connectionManager)
        {
            Game = game;
            _gameMessenger = gameMessenger;
            _connectionManager = connectionManager;
        }

        public async Task OnPlayerJoined(Player player)
        {
            await _gameMessenger.NotifyPlayerConnected(this, player);
            await _gameMessenger.NotifyHostPlayerConnected(Game.HostId, player);
        }

        public async Task Start()
        {
            Player[] connectedPlayers = _connectionManager.getConnectedPlayers(Game);
            Game.StartGame(connectedPlayers);
            await _gameMessenger.GameStarted(Game.Id, (int)Game.StartTimer.TotalMilliseconds);

            await Task.Delay((int)Game.StartTimer.TotalMilliseconds);
            await ShowQuestion();
        }

        public async Task Continue()
        {
            if (Game?.State.State != GameStateType.RevealAnswer)
                return;

            if (Game.NoMoreQuestions())
            {
                Game.ShowResults();
                await _gameMessenger.GameEnd(Game.Id);
                return;
            }

            var state = Game.Next();
            if (state.State == GameStateType.Results)
            {
                return;
            }

            await ShowQuestion();
        }

        private async Task ShowQuestion()
        {
            var question = Game.GetCurrentQuestion();
            if (QuestionTimerManager == null)
            {
                QuestionTimerManager = new QuestionTimerManager(question.TimeToAnswer);
                QuestionTimerManager.OnTimerComplete(async () => await RevealAnswer(question));
                QuestionTimerManager.StartTimer();
            }

            Game.StartQuestion();

            await _gameMessenger.Question(Game.Id, question);
        }

        private async Task RevealAnswer(Question question)
        {
            if (QuestionTimerManager != null)
            {
                QuestionTimerManager.CancelTimer();
                QuestionTimerManager = null;
            }

            Game.RevealAnswer();
            int correctAnswerIndex = question.CorrectAnswer();
            Console.WriteLine($"Correct answer: {correctAnswerIndex}");

            var tasks = Game.Players.Select((player) =>
            {
                var playerAnswerResult = player.GetAnswerResult(Game.CurrentQuestionIndex, correctAnswerIndex);
                return _gameMessenger.RevealAnswer(player.Id, correctAnswerIndex, playerAnswerResult);
            }).ToList();

            tasks.Add(_gameMessenger.RevealAnswer(Game.HostId, correctAnswerIndex));

            await Task.WhenAll(tasks);
        }

        public async Task AnswerQuestion(string playerId, int answerIndex)
        {
            if (Game.State.State != GameStateType.Question)
            {
                return;
            }

            if (!Game.TryGetPlayer(playerId, out Player? player))
            {
                return;
            }

            int currentQuestion = Game.CurrentQuestionIndex;

            if (player.HasAnsweredQuestion(currentQuestion))
            {
                return;
            }

            player.AnswerQuestion(currentQuestion, answerIndex);
            Game.RegisterAnswer(player.Id, currentQuestion);

            if (Game.AllPlayersAnswered())
            {
                if (QuestionTimerManager != null)
                {
                    QuestionTimerManager.CancelTimer();
                    QuestionTimerManager = null;
                }

                await RevealAnswer(Game.GetCurrentQuestion());
            }
        }
    }
}