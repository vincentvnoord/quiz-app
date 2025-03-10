namespace Business.GameService
{
    public class Player
    {
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public string Name { get; private set; }

        public Player(string name)
        {
            Name = name;
        }
    }
}