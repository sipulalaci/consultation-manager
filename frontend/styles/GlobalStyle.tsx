import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";

const theme = createTheme({});

export const GlobalStyle = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
