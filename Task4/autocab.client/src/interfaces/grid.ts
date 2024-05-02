import { GridValidRowModel } from "@mui/x-data-grid/models";
import { CarInfoDto } from "./car";

export interface GridCar extends CarInfoDto, GridValidRowModel { }