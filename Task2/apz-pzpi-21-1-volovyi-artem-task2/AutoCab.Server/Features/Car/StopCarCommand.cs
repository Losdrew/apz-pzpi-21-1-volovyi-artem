using AutoCab.Db.DbContexts;
using AutoCab.Db.Models;
using AutoCab.Server.Extensions;
using AutoCab.Server.Features.Base;
using AutoCab.Shared.Dto.Car;
using AutoCab.Shared.Errors.ServiceErrors;
using AutoCab.Shared.ServiceResponseHandling;
using AutoMapper;
using MediatR;

namespace AutoCab.Server.Features.Car;

public class StopCarCommand : IRequest<ServiceResponse<CarInfoDto>>
{
    public Guid CarId { get; set; }

    public class StopCarCommandHandler :
        ExtendedBaseHandler<StopCarCommand, ServiceResponse<CarInfoDto>>
    {
        public StopCarCommandHandler(ApplicationDbContext context, IHttpContextAccessor contextAccessor,
            IMapper mapper, ILogger<StopCarCommandHandler> logger)
            : base(context, contextAccessor, mapper, logger)
        {
        }

        public override async Task<ServiceResponse<CarInfoDto>> Handle(StopCarCommand request,
            CancellationToken cancellationToken)
        {
            try
            {
                return await UnsafeHandleAsync(request, cancellationToken);
            }
            catch (Exception ex)
            {
                Logger.LogCritical(ex, "Stop car error");
                return ServiceResponseBuilder.Failure<CarInfoDto>(CarError.CarEditError);
            }
        }

        protected override async Task<ServiceResponse<CarInfoDto>> UnsafeHandleAsync(StopCarCommand request,
            CancellationToken cancellationToken)
        {
            var isUserIdValid = ContextAccessor.TryGetUserId(out var userId);

            if (!isUserIdValid)
            {
                return ServiceResponseBuilder.Failure<CarInfoDto>(UserError.InvalidAuthorization);
            }

            var user = await Context.Users.FindAsync(userId);

            if (user == null)
            {
                return ServiceResponseBuilder.Failure<CarInfoDto>(UserError.InvalidAuthorization);
            }

            var carToEdit = await Context.Cars.FindAsync(request.CarId);

            if (carToEdit == null)
            {
                return ServiceResponseBuilder.Failure<CarInfoDto>(CarError.CarNotFound);
            }

            Db.Models.Trip? trip;

            if (user != null)
            {
                trip = Context.Trips.FirstOrDefault(t => t.UserId == user.Id);

                if (trip == null || trip.Status != TripStatus.InProgress)
                {
                    return ServiceResponseBuilder.Failure<CarInfoDto>(CarError.CarUnavailableError);
                }

                carToEdit.Status = CarStatus.WaitingForPassenger;
                trip.Status = TripStatus.WaitingForPassenger;
            }

            await Context.SaveChangesAsync(cancellationToken);

            var result = Mapper.Map<CarInfoDto>(carToEdit);
            return ServiceResponseBuilder.Success(result);
        }
    }
}