import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Context } from "../../contexts/UserContext";

interface Props {
  children: React.ReactNode;
}

export const UserWrapper = ({ children }: Props) => {
  const router = useRouter();
  const context = useContext(Context);
  const isPublicPage = ["/login", "/signup"].includes(router.pathname);

  const renderPage = () => {
    if (isPublicPage || (context && context.user)) {
      return <>{children}</>;
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
  };

  return renderPage();
};
