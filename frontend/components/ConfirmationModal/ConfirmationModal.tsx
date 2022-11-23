import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";
import { style } from "../../consts/ModalStyle";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  description: string;
}

export const ConfirmationModal = ({
  isOpen,
  description,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Box sx={{ ...style, width: 300, p: 3 }}>
        <Typography
          id="modal-modal-title"
          sx={{ mb: 2 }}
          variant="h6"
          component="h2"
        >
          Confirmation
        </Typography>
        <Typography id="modal-modal-description" sx={{ mb: 2 }}>
          {description}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={onConfirm}>
            Confirm
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
