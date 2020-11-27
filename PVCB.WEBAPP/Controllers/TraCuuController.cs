using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using PVCB.WEBAPP.Models;

namespace PVCB.WEBAPP.Controllers
{
    [RoutePrefix("tracuu")]
    public class TraCuuController : ApiController
    {

        [HttpPost]
        [Route("printinvoice")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> PrintInvoice(JObject model)
        {
            HttpResponseMessage result;
            try
            {
                string url = $"{CommonConstants.HostApi}/Tracuu2/PrintInvoice";
                string type = model["type"].ToString();
                HttpClient client = new HttpClient();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(model.ToString(), Encoding.UTF8,
                    "application/json"));
                byte[] bytes = response.Content.ReadAsByteArrayAsync().Result;

                if (response.IsSuccessStatusCode)
                {

                    result = new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(bytes) };
                    if (type == "PDF")
                    {
                        result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("inline")
                        {
                            FileName = "InvoiceTemplate.pdf"
                        };
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                    }
                    else if (type == "Html")
                    {
                        result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
                    }
                }
                else
                {
                    result = new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                }
                result.Content.Headers.ContentLength = bytes.Length;

            }
            catch (Exception ex)
            {
                result = new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent(ex.Message, Encoding.UTF8)
                };
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                result.Content.Headers.ContentLength = ex.Message.Length;
            }

            return result;
        }


        [HttpPost]
        [Route("exportzipfilexml")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> ExportZipFileXml(JObject model)
        {

            HttpResponseMessage result;

            try
            {
                string url = $"{CommonConstants.HostApi}/Tracuu2/ExportZipFileXML";

                HttpClient client = new HttpClient();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(model.ToString(), Encoding.UTF8,
                    "application/json"));
                byte[] bytes = response.Content.ReadAsByteArrayAsync().Result;

                if (response.IsSuccessStatusCode)
                {
                    result = new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentDisposition =
                        new ContentDispositionHeaderValue("attach") { FileName = "HoaDon.zip" };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/zip");
                    result.Content.Headers.ContentLength = bytes.Length;
                }
                else
                {
                    result = new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                }
                result.Content.Headers.ContentLength = bytes.Length;
            }
            catch (Exception ex)
            {
                result = new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new StringContent(ex.Message) };
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                result.Content.Headers.ContentLength = ex.Message.Length;
            }

            return result;
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("getinfoinvoice")]
        public async Task<JObject> GetInfoInvoice(JObject model)
        {
            JObject json = new JObject();
            try
            {
                string url = $"{CommonConstants.HostApi}/Tracuu2/GetInfoInvoice";
                HttpClient client = new HttpClient();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(model.ToString(), Encoding.UTF8,
                    "application/json"));

                string result = response.Content.ReadAsStringAsync().Result;
                json = JObject.Parse(result);
                return json;
            }
            catch (Exception e)
            {
                json.Add(e.Message);
                return json;
            }
        }



        [HttpPost]
        [Route("uploadinv")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> UploadInv()
        {
            Stream streams = new MemoryStream();

            string fileName = null;

            try
            {
                int lenghtOfFile = 1;
                HttpRequest httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count < 1)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Chưa chọn file hóa đơn");
                }

                foreach (string file in httpRequest.Files)
                {
                    HttpPostedFile postedFile = httpRequest.Files[file];
                    if (postedFile != null)
                    {
                        streams = postedFile.InputStream;
                        fileName = postedFile.FileName;
                        lenghtOfFile = postedFile.ContentLength;
                    }
                }

                JObject json = new JObject();

                if (fileName != null && !fileName.EndsWith("zip"))
                {
                    json.Add("error", "File tải lên không đúng *.zip");
                    json.Add("status", "server");

                    return Request.CreateResponse(HttpStatusCode.BadRequest, json);
                }

                if (lenghtOfFile > 0)
                {
                    if (lenghtOfFile / 1024 > CommonConstants.FileSize)
                    {
                        json.Add("error", "Kích thước file upload không được lớn hơn 1 MB");
                        json.Add("status", "server");
                        return Request.CreateResponse(HttpStatusCode.BadRequest, json);
                    }
                }

                BinaryReader br = new BinaryReader(streams);
                byte[] bytesData = br.ReadBytes((Int32)streams.Length);

                var stringData = Convert.ToBase64String(bytesData);
                var request = new JObject
                {
                    {"data", stringData },
                    {"fileName", fileName }
                };

                HttpClient client = new HttpClient();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                string url = $"{CommonConstants.HostApi}/Tracuu2/UploadInv2";

                HttpResponseMessage response = await client.PostAsync(url, new StringContent(request.ToString(), Encoding.UTF8,
                    "application/json"));
                byte[] bytes = response.Content.ReadAsByteArrayAsync().Result;

                HttpResponseMessage result;
                if (response.IsSuccessStatusCode)
                {
                    result = new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentDisposition =
                        new ContentDispositionHeaderValue("inline") { FileName = "Invoice.pdf" };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                }
                else
                {
                    result = new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                }
                response.Content.Headers.ContentLength = bytes.Length;

                return result;
            }
            catch (Exception ex)
            {
              
                JObject json = new JObject { { "error", ex.Message }, { "status", "server" } };
                if (ex.Message.Contains("Maximum request length"))
                {
                    json = new JObject { { "error", "Kích thước file nhỏ hơn 1MB" }, { "status", "server" } };
                }
                return Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }
        }


        [HttpPost]
        [Route("printinvoicepdf")]
        [AllowAnonymous]
        public async Task<JObject> PrintInvoicePdf(JObject model)
        {
            JObject json = new JObject();
            try
            {
                string url = $"{CommonConstants.HostApi}/Tracuu2/PrintInvoicePdf";

                HttpClient client = new HttpClient();
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));//ACCEPT header
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(model.ToString(), Encoding.UTF8,
                    "application/json"));
                var result = response.Content.ReadAsStringAsync().Result;
                json = JObject.Parse(result);
                return json;
            }
            catch (Exception e)
            {
                json.Add(e.Message);
                return json;
            }
        }


        [HttpPost]
        [Route("veryfyxml")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> VeryfyXml()
        {
            Stream streams = new MemoryStream();
            string fileName = null;
            try
            {
                int lenghtOfFile = 0;
                HttpRequest httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count < 1)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Chưa chọn file hóa đơn");
                }
                foreach (string file in httpRequest.Files)
                {
                    HttpPostedFile postedFile = httpRequest.Files[file];
                    if (postedFile != null)
                    {
                        streams = postedFile.InputStream;
                        fileName = postedFile.FileName;
                        lenghtOfFile = postedFile.ContentLength;
                    }
                }
                JObject json = new JObject();
                if (fileName != null && !fileName.EndsWith("zip"))
                {
                    json.Add("error", "File tải lên không đúng *.zip");
                    json.Add("status", "server");
                    return Request.CreateResponse(HttpStatusCode.BadRequest, json);
                }

                if (lenghtOfFile > 0)
                {
                    if (lenghtOfFile / 1024 > CommonConstants.FileSize)
                    {
                        json.Add("error", "Kích thước file nhỏ hơn 1MB");
                        json.Add("status", "server");
                        return Request.CreateResponse(HttpStatusCode.BadRequest, json);
                    }
                }

                BinaryReader br = new BinaryReader(streams);
                byte[] bytesData = br.ReadBytes((Int32)streams.Length);
                var stringData = Convert.ToBase64String(bytesData);
                var request = new JObject
                {
                    {"data", stringData },
                    {"fileName", fileName }
                };
                HttpClient client = new HttpClient();

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Ssl3;
                string url = $"{CommonConstants.HostApi}/Tracuu2/VeryfyXml2";
                HttpResponseMessage response = await client.PostAsync(url, new StringContent(request.ToString(), Encoding.UTF8,
                    "application/json"));
                byte[] bytes = response.Content.ReadAsByteArrayAsync().Result;
                HttpResponseMessage result;
                if (response.IsSuccessStatusCode)
                {
                    result = new HttpResponseMessage(HttpStatusCode.OK) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentDisposition =
                        new ContentDispositionHeaderValue("inline") { FileName = "Invoice.pdf" };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
                }
                else
                {
                    result = new HttpResponseMessage(HttpStatusCode.BadRequest) { Content = new ByteArrayContent(bytes) };
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
                }
                response.Content.Headers.ContentLength = bytes.Length;
                return result;
            }
            catch (Exception ex)
            {
                JObject json = new JObject { { "error", ex.Message }, { "status", "server" } };
                return Request.CreateResponse(HttpStatusCode.BadRequest, json);
            }
        }
    }
}
