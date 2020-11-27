using System.Web.Mvc;
using PVCB.WEBAPP.Models;

namespace PVCB.WEBAPP.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string mst, string sobaomat)
        {
            TracuuModels models = new TracuuModels
            {
                Mst = mst,
                Sobaomat = sobaomat
            };

            ViewBag.Tracuu = models;
            ViewBag.FileSize = CommonConstants.FileSize;

            return View();
        }

        public PartialViewResult _Header()
        {
            return PartialView();
        }

        public PartialViewResult _HeaderMobile()
        {
            return PartialView();
        }

        public PartialViewResult _Footer()
        {
            return PartialView();
        }
    }
}
