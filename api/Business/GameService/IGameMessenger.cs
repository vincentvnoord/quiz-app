using Business.Models.GameStates;

namespace Business.GameService
{
    public interface IGameMessenger
    {
        Task HostConnected(string hostId, HostConnectedState state);
        Task GameNotFound(string userId);
    }
}