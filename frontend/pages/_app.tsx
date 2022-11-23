import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { GlobalStyle } from "../styles/GlobalStyle";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalStyle>
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
    </GlobalStyle>
  );
}

export default MyApp;
