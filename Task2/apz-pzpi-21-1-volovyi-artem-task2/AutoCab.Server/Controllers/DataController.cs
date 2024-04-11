using AutoCab.Db.DbContexts;
using AutoCab.Server.Extensions;
using AutoCab.Shared.Dto.Error;
using AutoCab.Shared.Helpers;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoCab.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DataController
{
    private readonly ApplicationDbContext _context;

    public DataController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("export-data")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(FileContentResult), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    [FileDownload(FileName = "Data.xlsx")]
    public async Task<IActionResult> ExportData()
    {
        var users = _context.Users.ToList();
        var roles = _context.Roles.ToList();
        var cars = _context.Cars.ToList();
        var trips = _context.Trips.ToList();
        var addresses = _context.Addresses.ToList();
        var services = _context.Services.ToList();

        using (var workbook = new XLWorkbook())
        {
            AddWorksheet(workbook, "Users", users);
            AddWorksheet(workbook, "Roles", roles);
            AddWorksheet(workbook, "Cars", cars);
            AddWorksheet(workbook, "Trips", trips);
            AddWorksheet(workbook, "Addresses", addresses);
            AddWorksheet(workbook, "Services", services);

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return new FileContentResult(content, "application/vnd.ms-excel");
            }
        }
    }

    private void AddWorksheet<T>(IXLWorkbook workbook, string worksheetName, IList<T> data)
    {
        var worksheet = workbook.Worksheets.Add(worksheetName);
        worksheet.Cell(1, 1).InsertTable(data);
    }
}