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
import { useContext, useState } from "react";
import { style } from "../../consts/ModalStyle";
import { useFormik } from "formik";
import { postProject } from "../../api/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Context } from "../../contexts/UserContext";
import { blockInvalidNumberInputChar } from "../../utils/blockInvalidNumberInputChar";

export const ProjectModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(Context);

  const handleCreate = async (values) => {
    if (!context || !context.user || !context?.isTeacher) {
      handleCancel();
      return;
    }

    try {
      const response = await postProject({
        ...values,
        teacherId: context.user.id,
      });
      onSuccess(response);
      handleCancel();
    } catch (e) {
      toast.error((e as AxiosError).message);
    }
  };

  const { values, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: {
      title: "",
      description: "",
      capacity: 0,
    },
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

  const handleCancel = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <IconButton aria-label="add" onClick={() => setIsOpen(true)}>
        <AddIcon />
      </IconButton>
      <Modal open={isOpen} onClose={handleCancel}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{ mb: 2 }}
            variant="h6"
            component="h2"
          >
            Add new project
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                required
                fullWidth
                id="title"
                label="Title"
                autoFocus
                value={values.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 99999,
                  type: "number",
                }}
                required
                fullWidth
                id="capacity"
                label="Capacity"
                name="capacity"
                onKeyDown={blockInvalidNumberInputChar}
                value={values.capacity}
                onChange={handleChange}
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
            <Button variant="contained" onClick={() => handleSubmit()}>
              Create
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
