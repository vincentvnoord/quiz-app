namespace Business.GameSessions
{
    public class Player
    {
        public string Id { get; private set; } = Guid.NewGuid().ToString();
        public string Name { get; private set; }
        public string GameCode { get; private set; }

        private Dictionary<int, int> _answers { get; set; } = [];

        public Player(string name, string gameCode)
        {
            Name = name;
            GameCode = gameCode;
        }

        public void AnswerQuestion(int questionIndex, int answerIndex)
        {
            _answers[questionIndex] = answerIndex;
        }

        public bool HasAnsweredQuestion(int questionIndex)
        {
            return _answers.ContainsKey(questionIndex);
        }

        public int? GetAnswer(int questionIndex)
        {
            return _answers.TryGetValue(questionIndex, out int value) ? value : null;
        }

        public PlayerAnswerResultType GetAnswerResult(int question, int correctAnswer)
        {
            if (!HasAnsweredQuestion(question))
                return PlayerAnswerResultType.NoAnswer;

            return GetAnswer(question) == correctAnswer ? PlayerAnswerResultType.Correct : PlayerAnswerResultType.Incorrect;
        }
    }
}