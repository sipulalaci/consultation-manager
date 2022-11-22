import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  AppBar,
  Box,
  createTheme,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";

const theme = createTheme({ palette: { background: { default: "yellow" } } });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Consultation Manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ bg: "#f5f5f5" }}>
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  );
}

export default MyApp;
