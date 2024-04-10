namespace AutoCab.Shared.Dto.Trip;

public class UpdateTripServicesCommandDto
{
    public ICollection<Guid>? Services { get; set; }
}