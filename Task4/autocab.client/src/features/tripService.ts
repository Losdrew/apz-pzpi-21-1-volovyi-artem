import axios from "axios";
import apiClient from "../config/apiClient";
import { CreateTripCommand, TripInfoDto } from "../interfaces/trip";
import { AddressDto } from "../interfaces/address";

const getTrips = async (
  bearerToken: string
): Promise<TripInfoDto[]> => {
  try {
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };
    const response = await apiClient.get<TripInfoDto[]>(
      'api/Trip/trips',
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};

const getUserTrips = async (
  bearerToken: string
): Promise<TripInfoDto[]> => {
  try {
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };
    const response = await apiClient.get<TripInfoDto[]>(
      'api/Trip/user-trips',
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};

const createTrip = async (
  price: number,
  startAddress: AddressDto,
  destinationAddress: AddressDto,
  carId: string,
  bearerToken: string
): Promise<TripInfoDto> => {
  try {
    const request: CreateTripCommand = {
      price,
      startAddress,
      destinationAddress,
      carId
    }
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };
    const response = await apiClient.post<TripInfoDto>(
      'api/Trip/create',
      request,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Unknown error occurred.");
    }
  }
};

const tripService = {
  getTrips,
  getUserTrips,
  createTrip
};

export default tripService;