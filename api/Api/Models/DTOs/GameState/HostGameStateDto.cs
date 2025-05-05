using Business.GameSessions;

namespace Api.Models.DTOs.GameState
{
    public record HostGameStateDto : GameStateDto
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public PlayerDto[] Players { get; init; } = [];

        public HostGameStateDto(GameSession session, PlayerDto[] players) : base(session)
        {
            Game game = session.Game;
            Title = game.Quiz.Title;
            QuestionCount = game.Quiz.Questions.Length;
            Players = players;
        }
    }
}