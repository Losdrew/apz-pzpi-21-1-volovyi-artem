using AutoMapper;
using AutoCab.Db.Models;
using AutoCab.Server.Features.Car;
using AutoCab.Shared.Dto.Geolocation;
using AutoCab.Shared.Dto.Car;
using NetTopologySuite.Geometries;

namespace AutoCab.Server.Mapper;

public class CarProfile : Profile
{
    public CarProfile()
    {
        CreateMap<CreateCarCommand, Car>();
        CreateMap<EditCarCommand, Car>();
        CreateMap<Car, CarInfoDto>()
            .ForMember(dest => dest.Location, opt => 
                opt.MapFrom(src => src.Location == null ? null : new LocationDto
                {
                    X = src.Location.X, 
                    Y = src.Location.Y
                }));
    }
}