
using Business.Models;

namespace Business.GameSessions
{
    public interface IGameMessenger
    {
        Task HostConnected(string hostId, GameSession session);
        Task GameNotFound(string userId);
        Task UnAuthorized(string userId);
        Task NonRegisteredPlayer(string connectionId);

        /// <summary>
        /// Use this method to notify only the connected player
        /// </summary>
        /// <param name="state"></param>
        /// <param name="player"></param>
        /// <returns></returns>
        Task NotifyPlayerConnected(GameSession session, Player player);

        /// <summary>
        /// Use this method to notify only the host of the player that connected
        /// </summary>
        /// <param name="hostConnectionId"></param>
        /// <param name="player"></param>
        /// <returns></returns>
        Task NotifyHostPlayerConnected(string hostId, Player player);
        Task NotifyHostPlayerDisconnected(string hostId, string playerId);

        Task GameStarted(string gameCode, int timer);
        Task GameEnd(string gameCode);
        Task GameClosed(string gameCode);

        Task Question(string gameCode, Question question);
        Task RevealAnswer(string userId, int answer, PlayerAnswerResultType? playerAnswer = null);
    }
}