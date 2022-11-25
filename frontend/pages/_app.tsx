import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import type { AppProps } from "next/app";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { GlobalStyle } from "../styles/GlobalStyle";
import { getFromStorage } from "../utils/localStorageHelpers";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { UserContext } from "../contexts/UserContext";
import LogoutIcon from "@mui/icons-material/Logout";

const menuElements = [
  {
    name: "Projects",
    link: "/",
  },
  {
    name: "Personal projects",
    link: "/personal-projects",
  },
  {
    name: "Consultations",
    link: "/consultations",
  },
];

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
      <UserContext>
        <GlobalStyle>
          <AppBar position="static">
            <Toolbar
              variant="dense"
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                sx={{ ":hover": { cursor: "pointer" } }}
                onClick={() => router.push("/")}
              >
                Consultation Manager
              </Typography>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                {menuElements.map((element) => (
                  <Typography
                    variant="h6"
                    key={element.name}
                    onClick={() => router.push(element.link)}
                    sx={{
                      ":hover": { cursor: "pointer" },
                      fontSize: "1rem",
                      alignSelf: "center",
                    }}
                  >
                    {element.name}
                  </Typography>
                ))}
                <IconButton color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{ bg: "#f5f5f5" }}>
            <Component {...pageProps} />
          </Box>
        </GlobalStyle>
      </UserContext>
    </>
  );
}

export default MyApp;
