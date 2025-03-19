namespace Business.GameService
{
    public interface IConnectionManager
    {
        void Connect(string userId, string connectionId);
        string AddOrUpdatePlayerConnection(string playerId, string connectionId);
        public bool TryRemoveConnection(string connectionId);
        public string? GetPlayerId(string connectionId);
        string? GetConnectionId(string playerId);
        bool IsPlayerConnected(string playerId);
        Player[] getConnectedPlayers(Game game);
    }
}