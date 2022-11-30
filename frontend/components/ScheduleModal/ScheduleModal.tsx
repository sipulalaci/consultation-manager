import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, useFormik } from "formik";
import { style } from "../../consts/ModalStyle";
import { addDays } from "date-fns";

interface Props {
  showButton?: boolean;
  forceOpen?: boolean;
  onClose: () => void;
  onSuccess: (newSchedule: { description: string; deadline: string }) => void;
}

export const ScheduleModal = ({
  showButton = true,
  forceOpen = false,
  onClose,
  onSuccess,
}: Props) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const { values, errors, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: {
      deadline: "",
      description: "",
    },
    onSubmit: (values) => {
      onSuccess(values);
      setIsOpen(false);
      resetForm();
    },
  });

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {showButton && (
        <IconButton aria-label="add" onClick={() => setIsOpen(true)}>
          <AddIcon />
        </IconButton>
      )}

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{ mb: 2 }}
            variant="h6"
            component="h2"
          >
            Add new schedule section
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DatePicker
                value={values.deadline}
                onChange={(value) => setFieldValue("deadline", value)}
                inputFormat="yyyy/MM/dd"
                minDate={addDays(new Date(), 1)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth autoFocus />
                )}
              ></DatePicker>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="schedule-description"
                name="description"
                error={!!errors.description}
                value={values.description}
                label="Description"
                onChange={(e) => setFieldValue("description", e.target.value)}
                fullWidth
              />
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
            <Button
              variant="outlined"
              onClick={() => {
                resetForm();
                onClose();
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};
