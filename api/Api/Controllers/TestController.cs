using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class TestController : Controller
    {
        [HttpGet]
        [Authorize]
        public ActionResult<string> Get()
        {
            return "Hello World!";
        }
    }
}