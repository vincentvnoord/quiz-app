namespace Business.Models.GameStates
{
    public record PlayerState
    {
        public string Id { get; init; } = default!;
        public string Name { get; init; } = default!;
    }
}