using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Net.Http.Headers;
using Microsoft.Extensions.Primitives;
using Microsoft.SharePoint.Client;
using IO = System.IO;

namespace Aspire.FileUploadPOC.APIServer.Controllers
{
    
    [Route("[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {

        private readonly ILogger<FileController> _logger;
        private const string siteUrl = @"https://test.sharepoint.com/sites/working";
        private const string userName = @"target@test.onmicrosoft.com";
        private const string password = @"Working@123";

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
        }
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
        //File Upload
            try
            {
                var file = Request.Form.Files[0];                
                var pathToSave = IO.Path.Combine(IO.Directory.GetCurrentDirectory(), "Resources");
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = IO.Path.Combine(pathToSave, fileName);                    

                    using (var stream = new IO.FileStream(fullPath, IO.FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }


                    ClientContext context = new ClientContext(siteUrl);
                   // context.Credentials = new SharePointOnlineCredentials(userName, password);
                    Web web = context.Web;

                    List list = web.Lists.GetByTitle("POCFileUpload");
                    context.Load(list, f => f.Fields);
                    ListItemCreationInformation creationInfo = new ListItemCreationInformation();
                    ListItem item = list.AddItem(creationInfo);

                    foreach (KeyValuePair<string, StringValues> keyValuePair in Request.Form)
                    {

                        if (keyValuePair.Key == "metaData6")
                            item[keyValuePair.Key] = Convert.ToBoolean(keyValuePair.Value);
                        else
                            item[keyValuePair.Key] = Convert.ToString(keyValuePair.Value);
                    }

                    item.Update();

                    byte[] bytes = IO.File.ReadAllBytes(fullPath);

                    AttachmentCreationInformation attachment = new AttachmentCreationInformation();
                    attachment.ContentStream = new IO.MemoryStream(bytes);
                    attachment.FileName = fileName;
                    item.AttachmentFiles.Add(attachment);


                    await context.ExecuteQueryAsync();


                    return Ok("Item Created Successfully");

                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        public string Get()
        {
            return "Working";
        }


        }
}
