namespace Business.Models.GameState
{
    public record PlayerState
    {
        public string Id { get; init; } = default!;
        public string Name { get; init; } = default!;
    }
}