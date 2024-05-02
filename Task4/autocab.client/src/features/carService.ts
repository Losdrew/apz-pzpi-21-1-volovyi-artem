import axios from "axios";
import apiClient from "../config/apiClient";
import { CarInfoDto, CreateCarCommand, EditCarCommand } from "../interfaces/car";

const getCars = async (
): Promise<CarInfoDto[]> => {
  try {
    const response = await apiClient.get<CarInfoDto[]>(
      'api/Car/cars'
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

const createCar = async (
  brand: string,
  model: string,
  licencePlate: string,
  passengerSeatsNum: number,
  deviceId: string,
  bearerToken: string
): Promise<CarInfoDto> => {
  try {
    const request: CreateCarCommand = { 
      brand,
      model,
      licencePlate,
      passengerSeatsNum,
      deviceId
    }
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };
    const response = await apiClient.post<CarInfoDto>(
      'api/Car/create',
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

const editCar = async (
  bearerToken: string,
  id?: string,
  brand?: string,
  model?: string,
  licencePlate?: string,
  passengerSeatsNum?: number,
  deviceId?: string,
): Promise<CarInfoDto> => {
  try {
    const request: EditCarCommand = { 
      id,
      brand,
      model,
      licencePlate,
      passengerSeatsNum,
      deviceId
    }
    const headers = {
      'Authorization': 'Bearer ' + bearerToken
    };
    const response = await apiClient.post<CarInfoDto>(
      'api/Car/edit',
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

const carService = {
  getCars,
  createCar,
  editCar
};

export default carService;