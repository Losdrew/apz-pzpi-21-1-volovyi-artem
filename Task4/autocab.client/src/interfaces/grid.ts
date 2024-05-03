import { GridValidRowModel } from "@mui/x-data-grid/models";
import { UserInfoDto } from "./account";
import { CarInfoDto } from "./car";

export interface GridCar extends CarInfoDto, GridValidRowModel { }
export interface GridUser extends UserInfoDto, GridValidRowModel { }