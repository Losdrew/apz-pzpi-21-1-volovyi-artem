import axios from "axios";
import apiClient from "../config/apiClient";
import { AddressDto } from "../interfaces/address";

const getFullAddress = (address: AddressDto) => {
  const fullAddress: string[] = [];

  fullAddress.push(`${address.addressLine1} `);
  fullAddress.push(`${address.addressLine2} `);

  if (address.addressLine3 && address.addressLine3.trim() !== '') {
    fullAddress.push(`${address.addressLine3} `);
  }

  if (address.addressLine4 && address.addressLine4.trim() !== '') {
    fullAddress.push(`${address.addressLine4} `);
  }

  fullAddress.push(`, ${address.townCity}`);
  fullAddress.push(`, ${address.region}`);
  fullAddress.push(`, ${address.country}`);

  return fullAddress.join('');
}

const getAddresses = async (
): Promise<AddressDto[]> => {
  try {
    const response = await apiClient.get<AddressDto[]>(
      'api/Address/addresses'
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

const addressService = {
  getFullAddress,
  getAddresses
};

export default addressService;