import {
    Box,
    Button,
    Collapse,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SelectServicesModal from '../components/SelectServicesModal';
import addressService from '../features/addressService';
import tripService from '../features/tripService';
import useAuth from '../hooks/useAuth';
import useStatusConverter from '../hooks/useStatusConverter';
import { TripStatus } from '../interfaces/enums';
import { TripFullInfo } from '../interfaces/trip';

const CustomerTrips = () => {
  const { auth } = useAuth();
  const { 
    CarStatusColors, 
    CarStatusLabels, 
    TripStatusColors, 
    TripStatusLabels 
  } = useStatusConverter();
  const [trips, setTrips] = useState<TripFullInfo[]>([]);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpand = (tripId: string) => {
    setExpandedTripId((prev) => (prev === tripId ? null : tripId));
  };

  const handleOpenModal = (tripId: string) => {
    setSelectedTripId(tripId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (auth.bearer) {
          const response = await tripService.getUserTrips(auth.bearer);
          setTrips(response);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, [auth.bearer, trips]);

  const handleCancelTrip = async (tripId: string) => {
    try {
      await tripService.cancelOwnTrip(tripId, auth.bearer!);
    } catch (error) {
      console.error('Error');
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom align="center" mt={3} mb={2}>
        {"My Trips"}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{"Date"}</TableCell>
              <TableCell>{"Car Name"}</TableCell>
              <TableCell>{"Car Licence Plate"}</TableCell>
              <TableCell>{"Trip Status"}</TableCell>
              <TableCell>{"Price"}</TableCell>
              <TableCell>{"Actions"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trips.map((trip) => (
              <React.Fragment key={trip.id}>
                <TableRow>
                  <TableCell>{trip.startDateTime?.toLocaleString()}</TableCell>
                  <TableCell> {trip.car.brand + " " + trip.car.model} </TableCell>
                  <TableCell> {trip.car.licencePlate} </TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '5px',
                        borderRadius: '10px',
                        backgroundColor: TripStatusColors[trip.tripStatus!],
                      }}
                    >
                      {TripStatusLabels[trip.tripStatus!]}
                    </span>
                  </TableCell>
                  <TableCell>{trip.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleExpand(trip.id)}
                    >
                      {expandedTripId === trip.id ? "Hide Details" : "View Details"}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Collapse in={expandedTripId === trip.id} timeout="auto" unmountOnExit>
                      <Box>
                        <Typography variant="h6" gutterBottom> {"Trip Info"} </Typography>
                        <Typography gutterBottom>
                          {"Start Address"}: {addressService.getFullAddress(trip.startAddress!)}
                        </Typography>
                        <Typography gutterBottom>
                          {"Destination Address"}: {addressService.getFullAddress(trip.destinationAddress!)}
                        </Typography>
                        {trip.car && (
                          <React.Fragment>
                            <Typography gutterBottom>
                              {"Car Status"}: 
                              <span
                                style={{
                                  marginLeft: '8px',
                                  padding: '5px',
                                  borderRadius: '10px',
                                  backgroundColor: CarStatusColors[trip.car.status!],
                                }}
                              >
                                {CarStatusLabels[trip.car.status!]}
                              </span>
                            </Typography>
                          </React.Fragment>
                        )}
                        <Typography gutterBottom>
                          {"Services"}: {trip.services?.map(service => service.name)}
                        </Typography>
                      </Box>
                      <Box display="flex" flexDirection="row" justifyContent="flex-end" gap="15px">
                        {trip.tripStatus === TripStatus.InProgress && (
                          <Button
                            variant="contained"
                            onClick={() => handleOpenModal(trip.id)}
                          >
                            {"Update services"}
                          </Button>
                        )}
                        {(trip.tripStatus === TripStatus.Created || trip.tripStatus === TripStatus.InProgress) && (
                          <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelTrip(trip.id!)}
                          >
                            {"Cancel Trip"}
                          </Button>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SelectServicesModal open={isModalOpen} onClose={handleCloseModal} tripId={selectedTripId} />
    </Container>
  );
};

export default CustomerTrips;
