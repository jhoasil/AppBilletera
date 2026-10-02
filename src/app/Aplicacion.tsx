import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * Presenta la pantalla inicial de AppBilletera para disponer de una base
 * ejecutable sobre la que se incorporarán los módulos en tareas posteriores.
 */
export function Aplicacion() {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <AccountBalanceWalletOutlined fontSize="large" />
          </Box>
          <Typography component="h1" variant="h1">AppBilletera</Typography>
        </Stack>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography component="h2" variant="h3">Aplicación en preparación</Typography>
              <Typography color="text.secondary">
                Administración personal de ingresos, gastos y billeteras.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
