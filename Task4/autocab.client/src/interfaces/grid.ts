import { GridValidRowModel } from "@mui/x-data-grid/models";
import { UserInfoDto } from "./account";
import { CarInfoDto } from "./car";
import { ServiceInfoDto } from "./service";
import { TripInfoDto } from "./trip";

export interface GridCar extends CarInfoDto, GridValidRowModel { }
export interface GridUser extends UserInfoDto, GridValidRowModel { }
export interface GridTrip extends TripInfoDto, GridValidRowModel { }
export interface GridService extends ServiceInfoDto, GridValidRowModel { }