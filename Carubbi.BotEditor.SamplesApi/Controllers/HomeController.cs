using System.Web.Mvc;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }
    }
}
