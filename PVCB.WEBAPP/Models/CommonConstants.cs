using System.Configuration;

namespace PVCB.WEBAPP.Models
{
    public class CommonConstants
    {
        public static string HostApi = ConfigurationManager.AppSettings["HostApi"];
        public static int FileSize = int.Parse(ConfigurationManager.AppSettings["FileSize"]);
    }
}