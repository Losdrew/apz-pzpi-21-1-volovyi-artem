﻿namespace AutoCab.Shared.Dto.Address;

public class AddressDto
{
    public Guid Id { get; set; }
    public string? AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string? AddressLine3 { get; set; }
    public string? AddressLine4 { get; set; }
    public string? TownCity { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
}