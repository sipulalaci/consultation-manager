import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Task } from "../../types/Task";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  tasks: Task[];
  onTaskCreate: (text: string) => void;
  onTaskToggle: (id: string) => void;
}

export const Tasks = ({ tasks, onTaskCreate, onTaskToggle }: Props) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskText, setTaskText] = useState<string>("");

  return (
    <>
      {tasks.length ? (
        <Stack>
          {tasks.map((task) => (
            <FormControlLabel
              key={task.id}
              label={task.description}
              control={
                <Checkbox
                  checked={task.isDone}
                  onClick={() => onTaskToggle(task.id)}
                />
              }
            />
          ))}
        </Stack>
      ) : (
        <Typography>
          There are no tasks for this element, please add one.
        </Typography>
      )}
      <Collapse in={isAddingTask}>
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            sx={{ width: "100%" }}
          />
          <IconButton
            aria-label="add"
            onClick={() => {
              if (taskText !== "") {
                onTaskCreate(taskText);
                setTaskText("");
                setIsAddingTask(false);
              }
            }}
            color="success"
            sx={{ width: "3.5rem", height: "3.5rem" }}
            disabled={taskText === ""}
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            aria-label="add"
            onClick={() => {
              setIsAddingTask(false);
              setTaskText("");
            }}
            color="warning"
            sx={{ width: "3.5rem", height: "3.5rem" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Collapse>
      <Collapse in={!isAddingTask}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="add"
            size="large"
            onClick={() => {
              setIsAddingTask(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Collapse>
    </>
  );
};
