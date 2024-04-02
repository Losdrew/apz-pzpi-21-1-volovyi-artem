using System.ComponentModel.DataAnnotations.Schema;
using Point = NetTopologySuite.Geometries.Point;

namespace AutoCab.Db.Models;

public class Trip : Entity
{
    [Column(TypeName="geometry (point)")]
    public Point? StartLocation { get; set; }

    [Column(TypeName = "geometry (point)")]
    public Point? DestinationLocation { get; set; }

    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public TripStatus Status { get; set; }
    public decimal Price { get; set; }

    public Guid CarId { get; set; }
    public Car? Car { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}

public enum TripStatus
{
    Created,
    InProgress,
    Completed,
    Cancelled
}