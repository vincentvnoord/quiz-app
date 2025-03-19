using Business.Models.GameState;

namespace Business.GameService
{
    public interface IGameMessenger
    {
        Task HostConnected(string hostId, GameStatePresenter state);
        Task GameNotFound(string userId);
        Task UnAuthorized(string userId);
        Task NonRegisteredPlayer(string connectionId);

        /// <summary>
        /// Use this method to notify only the connecting player with their own name
        /// </summary>
        /// <param name="connectionId"></param>
        /// <param name="playerName"></param>
        /// <returns></returns>
        Task NotifyPlayerConnected(string playerId, string playerName);

        /// <summary>
        /// Use this method to notify only the host of the player that connected
        /// </summary>
        /// <param name="hostConnectionId"></param>
        /// <param name="player"></param>
        /// <returns></returns>
        Task NotifyHostPlayerConnected(string hostId, PlayerStatePresenter player);
        Task NotifyHostPlayerDisconnected(string hostId, string playerId);

        Task GameStarted(string gameCode, int timer);
        Task GameEnd(string gameCode);
        Task GameClosed(string gameCode);

        Task Question(string gameCode, QuestionPresenter question);
        Task RevealAnswer(string gameCode, int answer);
    }
}