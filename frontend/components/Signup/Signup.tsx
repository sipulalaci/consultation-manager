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

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import { postRegister } from "../../api/api";
import { toast } from "react-toastify";
import { saveToStorage } from "../../utils/localStorageHelpers";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { UserEnum } from "../../types/User";
import * as Yup from "yup";
import { Context } from "../../contexts/UserContext";

export const SignUp = () => {
  const router = useRouter();
  const context = React.useContext(Context);

  const handleRegister = async (values) => {
    const user = {
      email: values.email,
      password: values.password,
      type: values.role,
      name: `${values.firstName} ${values.lastName}`,
      ...(values.role === UserEnum.STUDENT
        ? { neptun: values.identifier }
        : { department: values.identifier }),
    };

    try {
      const response = await postRegister(user);
      context?.setUser(response.user);
      saveToStorage("token", response["access_token"]);

      router.replace("/");
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
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
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email required"),
        firstName: Yup.string().required("First name required"),
        lastName: Yup.string().required("Last name required"),
        password: Yup.string().required("Password required"),
        role: Yup.string()
          .required("Role required")
          .oneOf([UserEnum.STUDENT, UserEnum.TEACHER], "Invalid role"),
        identifier: Yup.string().required("Identifier required"),
      })}
      onSubmit={(values) => {
        handleRegister(values);
      }}
      validateOnMount={true}
      validateOnBlur={true}
    >
      {({
        errors,
        touched,
        values,
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
      }) => (
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
                    error={touched.firstName && !!errors.firstName}
                    helperText={
                      (touched.firstName && errors.firstName) ?? undefined
                    }
                    value={values.firstName}
                    onBlur={() => setFieldTouched("firstName", true)}
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
                    error={touched.lastName && !!errors.lastName}
                    helperText={
                      (touched.lastName && errors.lastName) ?? undefined
                    }
                    onBlur={() => setFieldTouched("lastName", true)}
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
                    error={touched.email && !!errors.email}
                    helperText={(touched.email && errors.email) ?? undefined}
                    onBlur={() => setFieldTouched("email", true)}
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
                    error={touched.password && !!errors.password}
                    helperText={
                      (touched.password && errors.password) ?? undefined
                    }
                    onBlur={() => setFieldTouched("password", true)}
                    value={values.password}
                    onChange={handleChange}
                    label="Password"
                    type="password"
                    id="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      required
                      error={touched.password && !!errors.password}
                      onBlur={() => setFieldTouched("role", true)}
                      value={values.role}
                      label="Role"
                      onChange={(e) => setFieldValue("role", e.target.value)}
                    >
                      <MenuItem value={UserEnum.STUDENT}>Student</MenuItem>
                      <MenuItem value={UserEnum.TEACHER}>Teacher</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.role && errors.role}
                    </FormHelperText>
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
                      error={touched.identifier && !!errors.identifier}
                      helperText={
                        (touched.identifier && errors.identifier) ?? undefined
                      }
                      onBlur={() => setFieldTouched("identifier", true)}
                      label={
                        values.role === UserEnum.STUDENT
                          ? "Neptun"
                          : "Department"
                      }
                    />
                  </Grid>
                )}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={Object.keys(errors).length > 0}
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
