import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Formik } from "formik";
import { postRegister } from "../../api/api";
import { toast } from "react-toastify";
import { saveToStorage } from "../../utils/localStorageHelpers";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

export const SignUp = () => {
  const router = useRouter();

  const handleRegister = async (values) => {
    console.log(values);
    const user = {
      email: values.email,
      password: values.password,
      type: values.role,
      name: `${values.firstName} ${values.lastName}`,
      ...(values.role === "STUDENT"
        ? { neptun: values.identifier }
        : { department: values.identifier }),
    };

    try {
      const response = await postRegister(user);
      saveToStorage("token", response["access_token"]);

      router.replace("/");
    } catch (e) {
      toast.error((e as AxiosError).message);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        role: "",
        identifier: "",
      }}
      onSubmit={(values) => {
        handleRegister(values);
      }}
    >
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    onChange={handleChange}
                    value={values.firstName}
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    label="Last Name"
                    name="lastName"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    label="Email Address"
                    name="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.role}
                      label="Role"
                      onChange={(e) => setFieldValue("role", e.target.value)}
                    >
                      <MenuItem value={"STUDENT"}>Student</MenuItem>
                      <MenuItem value={"TEACHER"}>Teacher</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {values.role !== "" && (
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      value={values.identifier}
                      onChange={handleChange}
                      name="identifier"
                      label={
                        values.role === "student" ? "Neptun" : "Department"
                      }
                    />
                  </Grid>
                )}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </Formik>
  );
};
