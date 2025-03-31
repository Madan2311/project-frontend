import React, { useContext, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu as MenuIcon, LocalShipping, Route, DirectionsCar, AssignmentInd, Group, TrackChanges } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import CreateShipment from '../components/CreateShipment';
import RoutesSection from '../components/RoutesSection';
import VehiclesSection from '../components/VehiclesSection';
import CarriersSection from '../components/CarriersSection';
import UserRolesSection from '../components/UserRolesSection';
import ShipmentAssignmentSection from '../components/ShipmentAssignmentSection';
import ShipmentTrackingSection from '../components/ShipmentTrackingSection';
import ShipmentListSection from '../components/ShipmentListSection';
import ShipmentPerformanceReport from '../components/ShipmentPerformanceReport';

type MenuOption = 'createShipment' | 'routes' | 'vehicles' | 'carriers' | 'users' | 'shipmentAssignment' | 'shipmentTracking' | 'shipmentList' | 'shipmentPerformanceReport';

const drawerWidth = 240;

const Dashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<MenuOption>('createShipment');


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    console.log("ENTRA AQUI")
    switch (selectedOption) {
      case 'createShipment':
        return <CreateShipment />;
      case 'routes':
        return <RoutesSection />;
      case 'vehicles':
        return <VehiclesSection />;
      case 'carriers':
        return <CarriersSection />;
      case 'users':
        return <UserRolesSection />;
      case 'shipmentAssignment':
        return <ShipmentAssignmentSection />;
      case 'shipmentTracking':
        return <ShipmentTrackingSection />;
      case 'shipmentList':
        return <ShipmentListSection />;
      case 'shipmentPerformanceReport':
        return <ShipmentPerformanceReport />;
      default:
        return <CreateShipment />;
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', backgroundColor: '#fff' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Menú
        </Typography>
      </Toolbar>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('createShipment'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <LocalShipping color="primary" />
            </ListItemIcon>
            <ListItemText primary="Crear Envío" />
          </ListItemButton>
        </ListItem>

        {<ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('shipmentAssignment'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <AssignmentInd color="primary" />
            </ListItemIcon>
            <ListItemText primary="Asignar Envío" />
          </ListItemButton>
        </ListItem>}

        <ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('shipmentList'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <TrackChanges color="primary" />
            </ListItemIcon>
            <ListItemText primary="Lista de Envíos" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('shipmentTracking'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <TrackChanges color="primary" />
            </ListItemIcon>
            <ListItemText primary="Seguimiento" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('shipmentPerformanceReport'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <TrackChanges color="primary" />
            </ListItemIcon>
            <ListItemText primary="Reporte" />
          </ListItemButton>
        </ListItem>

        {<ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('routes'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Route color="primary" />
            </ListItemIcon>
            <ListItemText primary="Rutas" />
          </ListItemButton>
        </ListItem>}

        {<ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('vehicles'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <DirectionsCar color="primary" />
            </ListItemIcon>
            <ListItemText primary="Vehículos" />
          </ListItemButton>
        </ListItem>}

        {<ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('carriers'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <AssignmentInd color="primary" />
            </ListItemIcon>
            <ListItemText primary="Transportistas" />
          </ListItemButton>
        </ListItem>}

        {<ListItem disablePadding>
          <ListItemButton onClick={() => { setSelectedOption('users'); handleDrawerToggle(); }}>
            <ListItemIcon>
              <Group color="primary" />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>
        </ListItem>}

        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LocalShipping color="primary" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#00AEEF',
        }}
      >
        <Toolbar>
          {isSmallScreen && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="menu"
      >
        <Drawer
          variant={isSmallScreen ? 'temporary' : 'permanent'}
          open={isSmallScreen ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, md: 3 },
          minHeight: '100vh',
          minWidth: '82.4vw',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
