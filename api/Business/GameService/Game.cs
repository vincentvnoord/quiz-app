using System.Collections.Concurrent;
using System.Diagnostics.CodeAnalysis;
using Business.Models;
using Business.Models.Game;
using Business.Models.Presenters;

namespace Business.GameService
{

    public class Game
    {
        public GameState State { get; private set; } = new();
        public const int MAX_PLAYERS = 50;
        public string Id { get; private set; }
        public Quiz Quiz { get; private set; }
        public string HostId { get; private set; }
        public int CurrentQuestionIndex { get; private set; } = 0;

        public ConcurrentBag<Player> Players { get; private set; } = [];

        public Game(string id, string hostId, Quiz quiz)
        {
            Id = id;
            HostId = hostId;
            Quiz = quiz;
        }

        public void StartGame()
        {
            State.SetState(GameStateType.Starting);
            CurrentQuestionIndex = 0;
        }

        public Question GetCurrentQuestion()
        {
            return Quiz.Questions[CurrentQuestionIndex];
        }

        public bool NoMoreQuestions()
        {
            return CurrentQuestionIndex >= Quiz.Questions.Length - 1;
        }

        public GameState Next()
        {
            CurrentQuestionIndex++;
            if (CurrentQuestionIndex >= Quiz.Questions.Length)
            {
                State.SetState(GameStateType.Results);
            }
            else
            {
                State.SetState(GameStateType.Question);
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

        // Not efficient at large player scales, but good if kept small
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