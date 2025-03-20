namespace Business.Models.Presenters
{
    public record PlayerStatePresenter
    {
        public string Id { get; init; } = default!;
        public string Name { get; init; } = default!;
    }
}