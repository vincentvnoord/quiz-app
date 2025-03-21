
using Microsoft.AspNetCore.Authorization;

namespace Api.Authorization
{
    public class GameHostRequirement : IAuthorizationRequirement
    {

        public GameHostRequirement()
        {
        }
    }
}