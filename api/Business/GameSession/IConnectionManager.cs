namespace Business.GameSessions
{
    public interface IConnectionManager
    {
        void Connect(string userId, string gameCode, string connectionId);
        Task Disconnect(string userId, string gameCode);

        string AddOrUpdatePlayerConnection(string playerId, string connectionId);
        public bool TryRemoveConnection(string connectionId);
        public string? GetPlayerId(string connectionId);
        string? GetConnectionId(string playerId);
        bool IsPlayerConnected(string playerId);
        Player[] getConnectedPlayers(Game game);
    }
}