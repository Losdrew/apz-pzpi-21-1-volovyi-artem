import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ExploreIcon from '@mui/icons-material/Explore';
import SensorsIcon from '@mui/icons-material/Sensors';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
 return (
   <Container>
     <Box textAlign="center" mt={10}>
       <Typography variant="h4" gutterBottom>
         {"Welcome to AutoCab"}
       </Typography>
       <Typography variant="subtitle1" color="textSecondary" paragraph>
         {"Unlock the Future of Transportation"}
       </Typography>

       <Box mt={4}>
         <IconButton color="primary">
           <DirectionsCarIcon fontSize="large" />
         </IconButton>
         <IconButton color="primary">
           <SensorsIcon fontSize="large" />
         </IconButton>
         <IconButton color="primary">
           <ExploreIcon fontSize="large" />
         </IconButton>
       </Box>

       <Box mt={5}>
         <Typography variant="h6" gutterBottom>
           {"AutoCab - Where Innovation Meets Convenience."}
         </Typography>
         <Typography variant="body1" paragraph>
           {"Your Key to Stress-Free Urban Travel"}
         </Typography>
       </Box>

       <Box mt={5}>
         <Button
           variant="contained"
           color="primary"
           size="large"
           endIcon={<ArrowForwardIcon />}
           component={Link}
           to="/sign-up"
         >
           {"Get Started"}
         </Button>
       </Box>
     </Box>
   </Container>
 );
};

export default Home;
