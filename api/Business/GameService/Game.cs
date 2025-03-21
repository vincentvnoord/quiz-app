using System.Collections.Concurrent;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Contracts;
using Business.Models;

namespace Business.GameService
{
    public class Game
    {
        public TimeSpan StartTimer { get; private set; }
        public DateTime StartedAt { get; private set; }

        public GameState State { get; private set; } = new();
        public const int MAX_PLAYERS = 50;
        public string Id { get; private set; }
        public Quiz Quiz { get; private set; }
        public string HostId { get; private set; }
        public int CurrentQuestionIndex { get; private set; } = 0;

        public ConcurrentBag<Player> Players { get; private set; } = [];

        public Game(string id, string hostId, Quiz quiz, int startTimer = 5)
        {
            Id = id;
            HostId = hostId;
            Quiz = quiz;
            StartTimer = TimeSpan.FromSeconds(startTimer);
        }

        public void StartGame()
        {
            State.SetState(GameStateType.Starting);
            CurrentQuestionIndex = 0;
            StartedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Gets the remaining start time in milliseconds
        /// </summary>
        /// <returns></returns>
        public double RemainingStartTime()
        {
            double elapsedTime = (DateTime.UtcNow - StartedAt).TotalMilliseconds;
            double remainingTime = StartTimer.TotalMilliseconds - elapsedTime;
            Console.WriteLine($"StartedAt: {StartedAt}, Elapsed: {elapsedTime}ms, Remaining: {remainingTime}ms");

            return remainingTime < 0 ? 0 : remainingTime;
        }

        public Question GetCurrentQuestion()
        {
            return Quiz.Questions[CurrentQuestionIndex];
        }

        public bool NoMoreQuestions()
        {
            return CurrentQuestionIndex >= Quiz.Questions.Length - 1;
        }

        public Question StartQuestion()
        {
            var question = GetCurrentQuestion();
            question.Timer.Start();
            State.SetState(GameStateType.Question);
            return question;
        }

        public GameState Next()
        {
            CurrentQuestionIndex++;
            if (CurrentQuestionIndex >= Quiz.Questions.Length)
            {
                State.SetState(GameStateType.Results);
            }

            return State;
        }

        public void RevealAnswer()
        {
            State.SetState(GameStateType.RevealAnswer);
        }

        public bool TryAddPlayer(Player player)
        {
            if (Players.Count >= MAX_PLAYERS || State.State != GameStateType.Lobby)
            {
                return false;
            }

            Players.Add(player);
            return true;
        }

        // Not efficient at large player scales, but fine if kept small
        public void RemovePlayer(string playerId)
        {
            Player? player = Players.FirstOrDefault(p => p.Id == playerId);
            if (player != null)
            {
                Players = [.. Players.Where(p => p.Id != playerId)];
            }
        }

        public bool TryGetPlayer(string playerId, [NotNullWhen(true)] out Player? player)
        {
            player = Players.FirstOrDefault(p => p.Id == playerId);
            return player != null;
        }
    }
}