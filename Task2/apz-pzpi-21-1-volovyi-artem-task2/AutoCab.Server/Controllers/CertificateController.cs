using AutoCab.Server.Controllers.Base;
using AutoCab.Server.Extensions;
using AutoCab.Shared.Dto.Error;
using AutoCab.Shared.Helpers;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace AutoCab.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CertificateController : BaseController
{
    private const string CertificateName = "autocab.client";

    public CertificateController(IMapper mapper, IMediator mediator)
        : base(mapper, mediator)
    {
    }

    [HttpGet("get-certificate")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(CertificateInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> GetCertificate()
    {
        string baseFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        string certFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.pem");
        string keyFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.key");

        if (System.IO.File.Exists(certFilePath) && System.IO.File.Exists(keyFilePath))
        {
            var cert = new X509Certificate2(certFilePath);

            var certInfo = new CertificateInfoDto
            {
                Subject = cert.Subject,
                Issuer = cert.Issuer,
                IssuedDate = cert.NotBefore,
                ExpiryDate = cert.NotAfter,
                Thumbprint = cert.Thumbprint
            };

            return Ok(certInfo);
        }

        return BadRequest("Certificate doesn't exist");
    }

    [HttpGet("export")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    [FileDownload(FileName = "certificate.pfx")]
    public async Task<IActionResult> ExportCertificate()
    {
        string baseFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        string certFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.pem");
        string keyFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.key");

        if (System.IO.File.Exists(certFilePath) && System.IO.File.Exists(keyFilePath))
        {
            X509Certificate2 certificate = new X509Certificate2(certFilePath);

            byte[] privateKeyBytes = System.IO.File.ReadAllBytes(keyFilePath);
            RSA privateKey = RSA.Create();
            int bytesRead = 0;
            privateKey.ImportRSAPrivateKey(privateKeyBytes, out bytesRead);

            X509Certificate2 certificateWithPrivateKey = certificate.CopyWithPrivateKey(privateKey);

            byte[] pfxBytes = certificateWithPrivateKey.Export(X509ContentType.Pfx);
            return new FileContentResult(pfxBytes, "application/octet-stream");
        }

        return BadRequest("Certificate doesn't exist");
    }

    [HttpPost("import")]
    [Authorize(Roles = Roles.Administrator)]
    public async Task<IActionResult> ImportCertificate(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        var tempFilePath = Path.GetTempFileName();

        using (var stream = System.IO.File.Create(tempFilePath))
        {
            await file.CopyToAsync(stream);
        }

        string baseFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        string keyFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.key");
        string pemFilePath = Path.Combine(baseFolder, "ASP.NET", "https", $"{CertificateName}.pem");

        var cert = new X509Certificate2(tempFilePath, "", X509KeyStorageFlags.Exportable | X509KeyStorageFlags.MachineKeySet);

        var privateKey = cert.GetRSAPrivateKey();
        if (privateKey == null)
        {
            throw new InvalidOperationException("Private key not found in the certificate.");
        }

        // Export the private key to .key file
        var privateKeyBytes = privateKey.ExportRSAPrivateKey();
        System.IO.File.WriteAllBytes(keyFilePath, privateKeyBytes);

        // Export the certificate to .pem file
        var pemString = cert.Export(X509ContentType.Cert);
        System.IO.File.WriteAllBytes(pemFilePath, pemString);

        return Ok("Certificate uploaded successfully.");
    }
}

public class CertificateInfoDto
{
    public string Subject { get; set; }
    public string Issuer { get; set; }
    public DateTime IssuedDate { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string Thumbprint { get; set; }
}
