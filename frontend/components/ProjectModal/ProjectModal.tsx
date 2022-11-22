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
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const blockInvalidNumberInputChar = (e: any) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

export const ProjectModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton aria-label="add" onClick={() => setIsOpen(true)}>
        <AddIcon />
      </IconButton>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
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
            <Button variant="contained">Create</Button>
            <Button variant="outlined" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
