import {
  Box,
  Divider,
  Step,
  StepContent,
  StepLabel,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { Schedule as ScheduleType } from "../../types/Schedule";
import { QAndA } from "../QAndA/QAndA";
import { Tasks } from "../Tasks/Tasks";

interface Props {
  index: number;
  schedule: ScheduleType;
  handleCommentCreate: (scheduleId: string, question: string) => void;
  handleTaskCreate: (scheduleId: string, text: string) => void;
  handleTaskToggle: (scheduleId: string, taskId: string) => void;
  onStepClick: (step: number) => void;
}

export const Schedule = ({
  index,
  schedule,
  handleCommentCreate,
  handleTaskCreate,
  handleTaskToggle,
  onStepClick,
}: Props) => (
  <Step onClick={() => onStepClick(index)}>
    <StepLabel sx={{ ":hover": { cursor: "pointer" } }}>
      <Typography fontWeight={600}>{schedule.description}</Typography>
    </StepLabel>
    <StepContent>
      <Box sx={{ display: "flex", gap: ".5rem" }}>
        <Typography fontWeight={600}>Deadline: </Typography>
        <Typography>{` ${format(
          new Date(schedule.deadline),
          "yyyy-MM-dd"
        )}`}</Typography>
      </Box>
      <Divider sx={{ margin: "1rem 0" }} />
      <Typography fontWeight={600}>Tasks:</Typography>

      <Tasks
        tasks={schedule.tasks}
        onTaskCreate={(text) => handleTaskCreate(schedule.id, text)}
        onTaskToggle={(id) => handleTaskToggle(schedule.id, id)}
      />
      <Divider sx={{ margin: "1rem 0" }} />
      <QAndA
        comments={schedule.comments ?? []}
        scheduleId={schedule.id}
        onCommentCreate={(text) => handleCommentCreate(schedule.id, text)}
      />
    </StepContent>
  </Step>
);
