namespace Business.UserService
{
    public enum RegistrationExceptionType
    {
        EmailAlreadyExists,
    }

    public class RegistrationException : Exception
    {
        public RegistrationExceptionType Type { get; set; }

        public RegistrationException(string message, RegistrationExceptionType type) : base(message)
        {
            Type = type;
        }
    }
}