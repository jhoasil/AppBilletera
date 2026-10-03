import type { PropsWithChildren } from 'react';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import RemoveCircleOutlined from '@mui/icons-material/RemoveCircleOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppBar from '@mui/material/AppBar';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Pagina } from './usePaginaActual';

const anchoLateral = 256;
const destinosPrincipales = [
  { pagina: 'inicio', titulo: 'Inicio', icono: <HomeOutlined /> },
  { pagina: 'ingresos', titulo: 'Ingresos', icono: <AddCircleOutlined /> },
  { pagina: 'gastos', titulo: 'Gastos', icono: <RemoveCircleOutlined /> },
  { pagina: 'reportes', titulo: 'Reportes', icono: <BarChartOutlined /> },
] as const;
const destinosLaterales = [
  ...destinosPrincipales,
  { pagina: 'billeteras', titulo: 'Billeteras', icono: <AccountBalanceWalletOutlined /> },
  { pagina: 'ajustes', titulo: 'Ajustes', icono: <SettingsOutlined /> },
] as const;

/** Página activa y contenido único del marco de navegación. */
type PropiedadesEstructura = PropsWithChildren<{ paginaActual: Pagina }>;

/** Adapta la navegación al ancho disponible sin duplicar páginas ni sus contenidos. */
export function EstructuraPrincipal({ paginaActual, children }: PropiedadesEstructura) {
  const tema = useTheme();
  /** Crea un enlace lateral que identifica el destino activo para lectores de pantalla. */
  function mostrarDestinoLateral(destino: (typeof destinosLaterales)[number]) {
    return (
      <ListItemButton
        key={destino.pagina}
        component="a"
        href={`#/${destino.pagina}`}
        selected={paginaActual === destino.pagina}
        aria-current={paginaActual === destino.pagina ? 'page' : undefined}
        sx={{ minHeight: 48, borderRadius: 2, mx: 1, mb: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{destino.icono}</ListItemIcon>
        <ListItemText primary={destino.titulo} />
      </ListItemButton>
    );
  }

  /** Crea un enlace inferior para acceder a los destinos principales desde el móvil. */
  function mostrarDestinoInferior(destino: (typeof destinosPrincipales)[number]) {
    return (
      <BottomNavigationAction
        key={destino.pagina}
        component="a"
        href={`#/${destino.pagina}`}
        value={destino.pagina}
        label={destino.titulo}
        icon={destino.icono}
        aria-current={paginaActual === destino.pagina ? 'page' : undefined}
        sx={{ minWidth: 0, minHeight: 56, px: 1 }}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <AppBar position="fixed" sx={{ zIndex: tema.zIndex.drawer + 1, borderBottom: 1, borderColor: 'divider', pt: 'env(safe-area-inset-top)', pl: 'env(safe-area-inset-left)', pr: 'env(safe-area-inset-right)' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            component="a" href="#/inicio" variant="h6"
            sx={{ flexGrow: 1, color: 'text.primary', textDecoration: 'none' }}
          >
            AppBilletera
          </Typography>
          <IconButton
            component="a" href="#/billeteras" aria-label="Abrir Billeteras" color={paginaActual === 'billeteras' ? 'primary' : 'default'}
          ><AccountBalanceWalletOutlined /></IconButton>
          <IconButton
            component="a" href="#/ajustes" aria-label="Abrir Ajustes"
            aria-current={paginaActual === 'ajustes' ? 'page' : undefined}
            color={paginaActual === 'ajustes' ? 'primary' : 'default'}
          >
            <SettingsOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: anchoLateral, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box component="nav" aria-label="Navegación principal">
          <List>{destinosLaterales.map(mostrarDestinoLateral)}</List>
        </Box>
      </Drawer>
      <Box sx={{ ml: { md: `${anchoLateral}px` } }}>
        <Toolbar />
        <Container
          component="main" id="contenido-principal" tabIndex={-1} maxWidth="lg"
          sx={{ minWidth: 0, pt: { xs: 'calc(24px + env(safe-area-inset-top))', md: 'calc(32px + env(safe-area-inset-top))' }, pb: { xs: 'calc(96px + env(safe-area-inset-bottom))', md: 'max(32px, env(safe-area-inset-bottom))' }, pl: { xs: 'max(16px, env(safe-area-inset-left))', sm: 'max(24px, env(safe-area-inset-left))' }, pr: { xs: 'max(16px, env(safe-area-inset-right))', sm: 'max(24px, env(safe-area-inset-right))' } }}
        >
          {children}
        </Container>
      </Box>
      <Paper
        component="nav" aria-label="Navegación principal móvil" elevation={0} square
        sx={{
          display: { xs: 'block', md: 'none' }, position: 'fixed',
          bottom: 0, left: 0, right: 0, zIndex: 'appBar',
          borderTop: 1, borderColor: 'divider', pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <BottomNavigation showLabels value={paginaActual}>
          {destinosPrincipales.map(mostrarDestinoInferior)}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
