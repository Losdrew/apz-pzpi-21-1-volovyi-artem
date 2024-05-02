import { Alert, Box, Button, Container, Divider, Paper, Snackbar, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CarEditToolbar from '../components/CarEditToolbar';
import CarLocationModal from '../components/CarLocationModal';
import EditableDataGrid from '../components/EditableDataGrid';
import carService from '../features/carService';
import dataService from '../features/dataService';
import useAuth from '../hooks/useAuth';
import useStatusConverter from '../hooks/useStatusConverter';
import { CarStatus } from '../interfaces/enums';
import { GridCar } from '../interfaces/grid';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const { CarStatusColors, CarStatusLabels } = useStatusConverter();
  const [cars, setCars] = useState<GridCar[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
 
  const handleExportData = async () => {
    try {
      const response = await dataService.getExportedData(auth.bearer!);
      
      const link = document.createElement('a');
      const blob = new Blob([response]);

      link.href = window.URL.createObjectURL(blob);
      link.download = 'database.tar';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error exporting data', error);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carService.getCars();
        setCars(response);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, [auth.bearer]) 

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSaveStatus(null);
  };

  const saveChanges = async () => {
    try {
      for (const car of cars) {
        if (car.isNew) {
          await carService.createCar(
            car.brand,
            car.model,
            car.licencePlate,
            car.passengerSeatsNum,
            car.deviceId,
            auth.bearer
          );
        }
        else {
          await carService.editCar(
            auth.bearer,
            car.id,
            car.brand,
            car.model,
            car.licencePlate,
            car.passengerSeatsNum,
            car.deviceId,
          );
        }
      }
      setSaveStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus('error');
    }
  };

  const carColumns: GridColDef[] = [
    { field: 'brand', headerName: "Brand", width: 170, editable: true },
    { field: 'model', headerName: "Model", width: 170, editable: true },
    { field: 'licencePlate', headerName: "Licence Plate", width: 100, editable: true },
    { field: 'passengerSeatsNum', headerName: "Passenger Seats", width: 100, editable: true },
    { field: 'deviceId', headerName: "Device ID", width: 170, editable: true },
    {
      field: 'temperature',
      headerName: "Temperature",
      width: 100,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params && params.value != null) {
          return `${params.value} %`;
        }
        return '';
      }
    },
    {
      field: 'fuel',
      headerName: "Fuel",
      width: 100,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params && params.value != null) {
          return `${params.value} %`;
        }
        return '';
      }
    },
    { 
      field: 'status',
      headerName: "Status",
      renderCell: (params: GridRenderCellParams<any, CarStatus>) => (
      <span
        style={{
          padding: '5px',
          borderRadius: '10px',
          backgroundColor: CarStatusColors[params.value],
        }}
      >
        {CarStatusLabels[params.value]}
      </span>
    ),
    }
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom align="center" mt={3} mb={2}>
        {"Administrator dashboard"}
      </Typography>
      <Paper elevation={3} style={{ padding: '20px', paddingBottom: '20px' }}>
        <Box mb={2} display="flex" flexDirection="column">
          <Typography variant="h6" gutterBottom mb={2}>
            {"Export/import current system data"}
          </Typography>
          <Box mb={2} display="flex" flexDirection="row" gap="20px">
            <Button variant="contained" color="primary" onClick={handleExportData}>
              {"Export database"}
            </Button>
            <Button
              variant="contained"
              component="label"
            >
              {"Import database"}
              <input
                type="file"
                hidden
              />
            </Button>
          </Box>
        </Box>
        <Divider />
        <Typography variant="h6" gutterBottom mt={2} mb={2}>
          {"Cars"}
        </Typography>
        <EditableDataGrid
          toolbar={CarEditToolbar}
          toolbarProps={{
            setModal: setIsModalOpen, 
            rows: cars || [],
            setRows: setCars
          }}
          rows={cars || []}
          setRows={setCars}
          initialColumns={carColumns}
        />
        <Divider />
        <Box sx={{mt: 4}} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={saveChanges}>
            {"Save changes"}
          </Button>
          <Snackbar
            open={saveStatus !== null}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              elevation={6}
              variant="filled"
              severity={(saveStatus === 'success' || saveStatus === null) ? 'success' : 'error'}
              onClose={handleCloseSnackbar}
            >
              {saveStatus === 'success' || saveStatus === null
                ? "Changes saved successfully"
                : "Error saving changes"}
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
      <CarLocationModal open={isModalOpen} handleClose={handleCloseModal} />
    </Container>
  );
};

export default AdminDashboard;