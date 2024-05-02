import { TripStatus, CarStatus } from '../interfaces/enums';

const useStatusConverter = () => {
  const TripStatusLabels = {
    [TripStatus.Created]: "Created",
    [TripStatus.InProgress]: "In Progress",
    [TripStatus.WaitingForPassenger]: "Waiting for Passenger",
    [TripStatus.Completed]: "Completed",
    [TripStatus.Cancelled]: "Cancelled",
  };

  const TripStatusColors = {
    [TripStatus.Created]: '#DE5DF1',
    [TripStatus.InProgress]: '#9C9405',
    [TripStatus.WaitingForPassenger]: '#9631F5',
    [TripStatus.Completed]: '#34C42F',
    [TripStatus.Cancelled]: '#F54C64',
  };

  const CarStatusLabels = {
    [CarStatus.Inactive]: "Inactive",
    [CarStatus.Idle]: "Idle",
    [CarStatus.EnRoute]: "En Route",
    [CarStatus.OnTrip]: "On Trip",
    [CarStatus.WaitingForPassenger]: "Waiting for Passenger",
    [CarStatus.Maintenance]: "Maintenance",
    [CarStatus.Danger]: "Danger",
  };

  const CarStatusColors = {
    [CarStatus.Inactive]: '#44474D',
    [CarStatus.Idle]: '#C77a1C',
    [CarStatus.EnRoute]: '#DE5DF1',
    [CarStatus.OnTrip]: '#9C9405',
    [CarStatus.WaitingForPassenger]: '#9631F5',
    [CarStatus.Maintenance]: '#2355A6',
    [CarStatus.Danger]: '#F54C64',
  };

  return {
    TripStatusLabels,
    TripStatusColors,
    CarStatusLabels,
    CarStatusColors,
  };
};

export default useStatusConverter;