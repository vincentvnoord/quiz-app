using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class TestController : Controller
    {
        [HttpGet]
        public ActionResult<string> Get()
        {
            return "Hello World!";
        }
    }
}