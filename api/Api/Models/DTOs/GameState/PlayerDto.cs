using Business.GameSessions;

namespace Api.Models.DTOs.GameState
{
    public record PlayerDto
    {
        public string Id { get; private set; }
        public string Name { get; private set; }

        public PlayerDto(Player player)
        {
            Id = player.Id;
            Name = player.Name;
        }
    }
}