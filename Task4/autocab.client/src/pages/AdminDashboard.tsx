import { Alert, Box, Button, Container, Divider, Paper, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams, GridRowSelectionModel, GridValueFormatterParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import CarEditToolbar from '../components/CarEditToolbar';
import CarLocationModal from '../components/CarLocationModal';
import EditToolbar from '../components/EditToolbar';
import EditableDataGrid from '../components/EditableDataGrid';
import addressService from '../features/addressService';
import authService from '../features/authService';
import carService from '../features/carService';
import certificateService from '../features/certificateService';
import dataService from '../features/dataService';
import tripService from '../features/tripService';
import userService from '../features/userService';
import useAuth from '../hooks/useAuth';
import useStatusConverter from '../hooks/useStatusConverter';
import { AddressDto } from '../interfaces/address';
import { CertificateInfoDto } from '../interfaces/certificate';
import { CarStatus } from '../interfaces/enums';
import { GridCar, GridService, GridTrip, GridUser } from '../interfaces/grid';
import { ServiceInfoDto } from '../interfaces/service';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const { CarStatusColors, CarStatusLabels, TripStatusColors, TripStatusLabels } = useStatusConverter();
  const [cars, setCars] = useState<GridCar[]>();
  const [users, setUsers] = useState<GridUser[]>();
  const [trips, setTrips] = useState<GridTrip[]>();
  const [services, setServices] = useState<GridService[]>();
  const [certificate, setCertificate] = useState<CertificateInfoDto>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [selectedCar, setSelectedCar] = useState<GridCar>();
 
  const handleExportData = async () => {
    try {
      const response = await dataService.exportData(auth.bearer!);
      
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

  const handleImportDatabase = async (file: File) => {
    if (file == null) {
      return;
    }
    try {
      const response = await dataService.importData(file, auth.bearer!);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error importing database:', error);
      setSaveStatus('error');
    }
  }

  const handleExportCertificate = async () => {
    try {
      const response = await certificateService.exportCertificate(auth.bearer!);

      const link = document.createElement('a');
      const blob = new Blob([response]);

      link.href = window.URL.createObjectURL(blob);
      link.download = 'certificate.pfx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error exporting data', error);
    }
  };

  const handleImportCertificate = async (file: File) => {
    if (file == null) {
      return;
    }
    try {
      const response = await certificateService.importCertificate(file, auth.bearer!);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error importing database:', error);
      setSaveStatus('error');
    }
  }

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
    const selectedCarId = rowSelectionModel.at(0);
    setSelectedCar(cars?.find((car) => car.id === selectedCarId))
  }

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

    const fetchTrips = async () => {
      try {
        const response = await tripService.getTrips(auth.bearer!);
        setTrips(response);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await tripService.getServices();
        setServices(response);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchCars();
    fetchUsers();
    fetchTrips();
    fetchServices();
  }, [auth.bearer]) 

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await certificateService.getCertificateInfo(auth.bearer!);
        setCertificate(response);
      } catch (error) {
        console.error('Error fetching certificate:', error);
      }
    };

    fetchCertificate();
  }, [auth.bearer, certificate]) 

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
      for (const service of services) {
        if (service.isNew) {
          await tripService.createService(
            service.name,
            service.command,
            auth.bearer
          );
        }
        else {
          await tripService.editService(
            auth.bearer,
            service.id,
            service.name,
            service.command
          );
        }
      }
      setSaveStatus('success');
    } catch (error) {
      console.error('Error:', error);
      setSaveStatus('error');
    }
  };

  const userColumns: GridColDef[] = [
    { field: 'id', headerName: "User Id", width: 170, editable: true },
    { field: 'email', headerName: "Email", width: 170, editable: true },
    { field: 'firstName', headerName: "First Name", width: 170, editable: true },
    { field: 'lastName', headerName: "Last Name", width: 170, editable: true },
    { field: 'phoneNumber', headerName: "Phone Number", width: 170, editable: true },
    { field: 'role', headerName: "Role", width: 100, editable: true }
  ];

  const tripColumns: GridColDef[] = [
    { field: 'userId', headerName: "User Id", width: 170, editable: false },
    {
      field: 'tripStatus',
      headerName: "Status",
        renderCell: (params: GridRenderCellParams<any, CarStatus>) => (
          <span
            style={{
              padding: '5px',
              borderRadius: '10px',
              backgroundColor: TripStatusColors[params.value],
            }}
          >
            {TripStatusLabels[params.value]}
          </span>
        ),
    },
    {
      field: 'startDateTime',
      headerName: "Start Date",
      width: 170,
      valueFormatter: (params: GridValueFormatterParams<Date>) => {
        if (params != null) {
          const date = new Date(Date.parse(params?.toString()));
          return date.toLocaleString();
        }
        return '';
      },
      editable: true
    },
    { field: 'price', headerName: "Price", width: 100, editable: true },
    {
      field: 'startAddress',
      headerName: "Start Address",
      width: 170,
      valueFormatter: (params: GridValueFormatterParams<AddressDto>) => {
        if (params != null) {
          return addressService.getFullAddress(params);
        };
        return '';
      }
    },
    {
      field: 'destinationAddress',
      headerName: "Destination Address",
      width: 170,
      valueFormatter: (params: GridValueFormatterParams<AddressDto>) => {
        if (params != null) {
          return addressService.getFullAddress(params);
        };
        return '';
      }
    },
    {
      field: 'carBrand',
      headerName: "Car Brand",
      width: 170,
      renderCell: (params) => {
        return params?.row?.car.brand;
      },
      editable: false
    },
    {
      field: 'carModel',
      headerName: "Car Model",
      width: 170,
      renderCell: (params) => {
        return params?.row?.car.model;
      },
      editable: false
    },
    {
      field: 'carLicencePlate',
      headerName: "Car Licence Plate",
      width: 100,
      renderCell: (params) => {
        return params?.row?.car.licencePlate;
      },
      editable: false
    },
    {
      field: 'services',
      headerName: "Services",
      width: 170,
      renderCell: (params: GridRenderCellParams<any, ServiceInfoDto[]>) => (
        <ul className="flex"
          style={{
            margin: 0,
            padding: '0px 0px 0px 5px',
        }}>
          {params?.value?.map((service, id) => (
            <li key={id}>{service.name}</li>
          ))}
        </ul>
      )
    },
  ];

  const serviceColumns: GridColDef[] = [
    { field: 'name', headerName: "Name", width: 170, editable: true },
    { field: 'command', headerName: "Command", width: 170, editable: true }
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
                onChange={(event) => handleImportDatabase(event.target.files[0])}
              />
            </Button>
          </Box>
        </Box>
        <Divider />
        <Typography variant="h6" gutterBottom mt={2}>
          {"Certificate management"}
        </Typography>
        <Table sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>{"Subject"}</TableCell>
              <TableCell>{"Issuer"}</TableCell>
              <TableCell>{"Issued Date"}</TableCell>
              <TableCell>{"Expiry Date"}</TableCell>
              <TableCell>{"Thumbprint"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{certificate?.subject}</TableCell>
              <TableCell>{certificate?.issuer}</TableCell>
              <TableCell>{certificate?.issuedDate?.toLocaleString()}</TableCell>
              <TableCell>{certificate?.expiryDate?.toLocaleString()}</TableCell>
              <TableCell>{certificate?.thumbprint}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box mb={2} display="flex" flexDirection="row" gap="20px">
          <Button variant="contained" color="primary" onClick={handleExportCertificate}>
            {"Export certificate"}
          </Button>
          <Button
            variant="contained"
            component="label"
          >
            {"Import certificate"}
            <input
              type="file"
              hidden
              onChange={(event) => handleImportCertificate(event.target.files[0])}
            />
          </Button>
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
          {"Trips"}
        </Typography>
        <EditableDataGrid
          toolbar={EditToolbar}
          toolbarProps={{
            setModal: setIsModalOpen,
            rows: trips || [],
            setRows: setTrips
          }}
          rows={trips || []}
          setRows={setTrips}
          initialColumns={tripColumns}
        />
        <Divider />
        <Typography variant="h6" gutterBottom mt={2} mb={2}>
          {"Services"}
        </Typography>
        <EditableDataGrid
          toolbar={EditToolbar}
          toolbarProps={{
            setModal: setIsModalOpen,
            rows: services || [],
            setRows: setServices
          }}
          rows={services || []}
          setRows={setServices}
          initialColumns={serviceColumns}
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
          handleSelectionChange={ handleSelectionChange }
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
      <CarLocationModal open={isModalOpen} handleClose={handleCloseModal} selectedCar={selectedCar} />
    </Container>
  );
};

export default AdminDashboard;