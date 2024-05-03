import { AddressDto } from "./address";
import { TripStatus } from "./enums";
import { ServiceInfoDto } from "./service";

export interface CreateTripCommand {
  price: number;
  startAddress?: AddressDto;
  destinationAddress?: AddressDto;
  carId: string;
}

export interface TripInfoDto {
  id: string;
  userId: string;
  tripStatus: TripStatus;
  startDateTime: Date;
  price: number;
  startAddress?: AddressDto;
  destinationAddress?: AddressDto;
  carId: string;
  services?: ServiceInfoDto[];
}
