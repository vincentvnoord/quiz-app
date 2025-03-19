using Business.Models.GameState;

namespace Business.GameService
{
    public interface IGameMessenger
    {
        Task HostConnected(string hostId, GameStatePresenter state);
        Task GameNotFound(string userId);
        Task UnAuthorized(string userId);

        Task GameStarted(string gameCode, int timer);
        Task GameEnd(string gameCode);

        Task Question(string gameCode, QuestionPresenter question);
        Task RevealAnswer(string gameCode, int answer);
    }
}