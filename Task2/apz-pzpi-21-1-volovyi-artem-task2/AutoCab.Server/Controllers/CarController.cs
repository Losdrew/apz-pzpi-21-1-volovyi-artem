using AutoCab.Server.Controllers.Base;
using AutoCab.Server.Features.Car;
using AutoCab.Shared.Dto.Car;
using AutoCab.Shared.Dto.Error;
using AutoCab.Shared.Helpers;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoCab.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CarController : BaseController
{
    public CarController(IMapper mapper, IMediator mediator)
        : base(mapper, mediator)
    {
    }

    /// <summary>
    /// Get a list of cars.
    /// </summary>
    /// <remarks>
    /// If the operation is successful, it will return an ICollection of CarInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("cars")]
    [ProducesResponseType(typeof(CarInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> GetCars()
    {
        var query = new GetCarsQuery();
        var result = await Mediator.Send(query);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Create new car.
    /// </summary>
    /// <param name="request">The request to create new car.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <remarks>
    /// If the operation is successful, it will return a CarInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("create")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(CarInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 403)]
    public async Task<IActionResult> CreateCar(CreateCarCommand request, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(request, cancellationToken);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Edit existing car.
    /// </summary>
    /// <param name="request">The request to edit car.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <remarks>
    /// If the operation is successful, it will return an CarInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("edit")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(CarInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 403)]
    public async Task<IActionResult> EditCar(EditCarCommand request, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(request, cancellationToken);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Delete existing car.
    /// </summary>
    /// <param name="carId">The request to delete car.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <remarks>
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpDelete("delete")]
    [Authorize(Roles = Roles.Administrator)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> DeleteCar(Guid carId, CancellationToken cancellationToken)
    {
        var command = new DeleteCarCommand
        {
            CarId = carId
        };
        var result = await Mediator.Send(command, cancellationToken);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Update existing car.
    /// </summary>
    /// <param name="request">The request to update car.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <remarks>
    /// If the operation is successful, it will return an success result.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("update")]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> UpdateCar(UpdateCarCommand request, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(request, cancellationToken);
        return ConvertFromServiceResponse(result);
    }
}