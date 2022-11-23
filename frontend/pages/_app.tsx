import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { GlobalStyle } from "../styles/GlobalStyle";
import { getFromStorage } from "../utils/localStorageHelpers";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isUserAuthenticated = getFromStorage("token") ? true : false;
  const isPublicPage = ["/login", "/signup"].includes(router.pathname);

  useEffect(() => {
    if (!isUserAuthenticated && !isPublicPage) {
      router.push("/login");
    }
  }, [isUserAuthenticated]);

  return (
    <>
      <ToastContainer />
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
    </>
  );
}

export default MyApp;
