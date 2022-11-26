import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { style } from "../../consts/ModalStyle";
import { Formik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getDate, getMonth, getYear } from "date-fns";

export const ConsultationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = (values) => {
    const consultation = {
      date: new Date(
        getYear(values.date),
        getMonth(values.date),
        getDate(values.date),
        values.hour,
        values.minute
      ),
    };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <IconButton aria-label="add" onClick={() => setIsOpen(true)}>
        <AddIcon />
      </IconButton>
      <Formik
        initialValues={{
          date: "",
          hour: "",
          minute: "",
        }}
        onSubmit={(values) => handleCreate(values)}
      >
        {({ values, errors, handleSubmit, setFieldValue }) => (
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Box sx={style}>
              <Typography
                id="modal-modal-title"
                sx={{ mb: 2 }}
                variant="h6"
                component="h2"
              >
                Add new consultation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DatePicker
                    value={values.date}
                    onChange={(value) => setFieldValue("date", value)}
                    inputFormat="yyyy/MM/dd"
                    renderInput={(params) => (
                      <TextField {...params} fullWidth autoFocus />
                    )}
                  ></DatePicker>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="hour-select"
                    select
                    name="hour"
                    error={!!errors.hour}
                    value={values.hour}
                    label="Hour"
                    onChange={(e) => setFieldValue("hour", e.target.value)}
                    fullWidth
                  >
                    {Array.from(new Array(24)).map((_, index) => (
                      <MenuItem value={index} key={index}>
                        {index}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="minute-select"
                    select
                    name="minute"
                    error={!!errors.minute}
                    value={values.minute}
                    label="Minute"
                    onChange={(e) => setFieldValue("minute", e.target.value)}
                    fullWidth
                  >
                    {[0, 15, 30, 45].map((name) => (
                      <MenuItem value={name} key={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  disabled={Object.keys(errors).length > 0}
                >
                  Create
                </Button>
                <Button variant="outlined" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Formik>
    </LocalizationProvider>
  );
};
