using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Carubbi.BotEditor.UI.Controllers
{
    public class BotsController : Controller
    {
        // GET: Bots
        public ActionResult Index()
        {
            return View();
        }
    }
}