import { Alert, Box, Button, Container, Divider, Paper, Snackbar, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CarEditToolbar from '../components/CarEditToolbar';
import CarLocationModal from '../components/CarLocationModal';
import EditToolbar from '../components/EditToolbar';
import EditableDataGrid from '../components/EditableDataGrid';
import authService from '../features/authService';
import carService from '../features/carService';
import dataService from '../features/dataService';
import userService from '../features/userService';
import useAuth from '../hooks/useAuth';
import useStatusConverter from '../hooks/useStatusConverter';
import { CarStatus } from '../interfaces/enums';
import { GridCar, GridUser } from '../interfaces/grid';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const { CarStatusColors, CarStatusLabels } = useStatusConverter();
  const [cars, setCars] = useState<GridCar[]>();
  const [users, setUsers] = useState<GridUser[]>();
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

    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers(auth.bearer!);
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchCars();
    fetchUsers();
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
      for (const user of users) {
        if (user.isNew) {
          if (user.role === 'customer') {
            await authService.signUpCustomer(
              user.email,
              'password',
              user.firstName,
              user.lastName,
              user.phoneNumber
            );
          }
          if (user.role === 'admin') {
            await authService.signUpAdmin(
              user.email,
              'password',
              user.firstName,
              user.lastName,
              user.phoneNumber
            );
          }
        }
      }
      setSaveStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus('error');
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'email', headerName: "Email", width: 170, editable: true },
    { field: 'firstName', headerName: "First Name", width: 170, editable: true },
    { field: 'lastName', headerName: "Last Name", width: 170, editable: true },
    { field: 'phoneNumber', headerName: "Phone Number", width: 170, editable: true },
    { field: 'role', headerName: "Role", width: 100, editable: true }
  ];

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
          {"Users"}
        </Typography>
        <EditableDataGrid
          toolbar={EditToolbar}
          toolbarProps={{
            setModal: setIsModalOpen,
            rows: users || [],
            setRows: setUsers
          }}
          rows={users || []}
          setRows={setUsers}
          initialColumns={userColumns}
        />
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