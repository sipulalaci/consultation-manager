import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { postLogin } from "../../api/api";
import { saveToStorage } from "../../utils/localStorageHelpers";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Context } from "../../contexts/UserContext";
import * as Yup from "yup";

export const Login = () => {
  const router = useRouter();
  const context = useContext(Context);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email equired"),
      password: Yup.string().required("Password required"),
    }),
    onSubmit: async (values) => handleSubmit2(values),
    validateOnMount: true,
    validateOnBlur: true,
  });

  const handleSubmit2 = async (values) => {
    if (!values.email || !values.password) {
      return;
    }

    try {
      const response = await postLogin(values.email, values.password);

      saveToStorage("token", response["access_token"]);
      context?.setUser(response.user);

      router.replace("/");
    } catch (e) {
      toast.error("Invalid credentials");
    }
  };

  return (
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
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            onBlur={() => setFieldTouched("email", true)}
            error={touched.email && !!errors.email}
            helperText={(touched.email && errors.email) ?? undefined}
            label="Email Address"
            name="email"
            value={values.email}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            onBlur={() => setFieldTouched("password", true)}
            error={touched.password && !!errors.password}
            helperText={(touched.password && errors.password) ?? undefined}
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            id="password"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={Object.keys(errors).length > 0}
            onClick={(e) => handleSubmit()}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
