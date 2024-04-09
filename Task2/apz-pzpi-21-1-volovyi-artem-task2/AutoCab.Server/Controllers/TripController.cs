﻿using AutoMapper;
using AutoCab.Server.Controllers.Base;
using AutoCab.Server.Features.Trip;
using AutoCab.Shared.Dto.Error;
using AutoCab.Shared.Dto.Trip;
using AutoCab.Shared.Helpers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoCab.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TripController : BaseController
{
    public TripController(IMapper mapper, IMediator mediator)
        : base(mapper, mediator)
    {
    }

    /// <summary>
    /// Create new trip.
    /// </summary>
    /// <param name="request">The request to create new trip.</param>
    /// <param name="cancellationToken">The cancellation token.</param>
    /// <remarks>
    /// If the operation is successful, it will return a TripInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("create")]
    [Authorize(Roles = Roles.Customer)]
    [ProducesResponseType(typeof(TripInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    [ProducesResponseType(typeof(string), 401)]
    [ProducesResponseType(typeof(string), 403)]
    public async Task<IActionResult> CreateTrip(CreateTripCommand request, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(request, cancellationToken);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Get user's trips.
    /// </summary>
    /// <remarks>
    /// If the operation is successful, it will return an ICollection of TripInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpGet("user-trips")]
    [Authorize(Roles = Roles.Customer)]
    [ProducesResponseType(typeof(TripInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> GetOwnTrips()
    {
        var query = new GetOwnTripsQuery();
        var result = await Mediator.Send(query);
        return ConvertFromServiceResponse(result);
    }

    /// <summary>
    /// Cancel own trip.
    /// </summary>
    /// <remarks>
    /// If the operation is successful, it will return an TripInfoDto.
    /// If there is a bad request, it will return an ErrorDto.
    /// </remarks>
    /// <returns>An IActionResult representing the result of the operation.</returns>
    [HttpPost("cancel")]
    [Authorize(Roles = Roles.Customer)]
    [ProducesResponseType(typeof(TripInfoDto), 200)]
    [ProducesResponseType(typeof(ErrorDto), 400)]
    public async Task<IActionResult> CancelOwnTrip(CancelOwnTripCommand request, CancellationToken cancellationToken)
    {
        var result = await Mediator.Send(request, cancellationToken);
        return ConvertFromServiceResponse(result);
    }
}