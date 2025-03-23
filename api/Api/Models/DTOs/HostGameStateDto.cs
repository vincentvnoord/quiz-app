using Business.GameService;

namespace Api.Models.DTOs
{
    public record HostGameStateDto : GameStateDto
    {
        public string Title { get; init; } = default!;
        public int QuestionCount { get; init; }
        public PlayerDto[] Players { get; init; } = [];

        public HostGameStateDto(Game game, PlayerDto[] players) : base(game)
        {
            Title = game.Quiz.Title;
            QuestionCount = game.Quiz.Questions.Length;
            Players = players;
        }
    }
}