import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPersonalProject,
  postComment,
  postSchedule,
  postScheduleAddTask,
  putScheduleToggleTask,
} from "../../api/api";
import { PersonalProject } from "../PersonalProjects/PersonalProjects";
import { ScheduleModal } from "../ScheduleModal/ScheduleModal";
import { orderBy } from "lodash";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { Context, User } from "../../contexts/UserContext";
import { Comment as CommentComponent } from "../Comment/Comment";
import { QAndA } from "../QAndA/QAndA";
import { Tasks } from "../Tasks/Tasks";

export interface Schedule {
  id: string;
  personalProjectId: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  tasks: Task[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  scheduleId: string;
  question: string;
  userId: string;
  user: User;
  createdAt: Date;
}

export interface Task {
  id: string;
  scheduleId: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}

export const PersonalProjectDetails = () => {
  const router = useRouter();
  const [personalProject, setPersonalProject] = useState<
    (PersonalProject & { schedules: Schedule[] }) | null
  >(null);
  const [activeSchedule, setActiveSchedule] = useState(0);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const context = useContext(Context);

  const handleScheduleCreate = async (schedule: {
    description: string;
    deadline: string;
  }) => {
    const newSchedule = await postSchedule({
      ...schedule,
      personalProjectId: personalProject?.id,
    });
    setPersonalProject((currentState) =>
      currentState
        ? {
            ...currentState,
            schedules: orderBy(
              [...currentState?.schedules, newSchedule as Schedule],
              "deadline",
              "asc"
            ),
          }
        : null
    );
  };

  const handleTaskCreate = async (scheduleId: string, text: string) => {
    if (!personalProject) return;
    const newTask = await postScheduleAddTask(scheduleId, {
      description: text,
    });

    setPersonalProject((currentState) =>
      currentState
        ? {
            ...currentState,
            schedules: currentState.schedules.map((schedule) =>
              schedule.id === scheduleId
                ? {
                    ...schedule,
                    tasks: [...(schedule.tasks ?? []), newTask as Task],
                  }
                : schedule
            ),
          }
        : null
    );
  };

  const handleCommentCreate = async (scheduleId: string, text: string) => {
    if (!personalProject || !context || !context.user) return;

    try {
      const newQuestion = await postComment({
        question: text,
        scheduleId,
        userId: context.user.id,
      });
      setPersonalProject((currentState) =>
        currentState
          ? {
              ...currentState,
              schedules: currentState.schedules.map((schedule) =>
                schedule.id === scheduleId
                  ? {
                      ...schedule,
                      comments: [
                        ...(schedule.comments ?? []),
                        newQuestion as Comment,
                      ],
                    }
                  : schedule
              ),
            }
          : null
      );
    } catch (error) {
      toast.error((error as AxiosError).message);
    }
  };

  const handleTaskToggle = async (scheduleId: string, taskId: string) => {
    if (!personalProject) return;
    try {
      const updatedTask = await putScheduleToggleTask(scheduleId, taskId);
      setPersonalProject((currentState) =>
        currentState
          ? {
              ...currentState,
              schedules: currentState.schedules.map((schedule) =>
                schedule.id === scheduleId
                  ? {
                      ...schedule,
                      tasks: schedule.tasks.map((task) =>
                        task.id === taskId ? updatedTask : task
                      ),
                    }
                  : schedule
              ),
            }
          : null
      );
    } catch (err) {
      toast.error((err as AxiosError).message);
    }
  };

  useEffect(() => {
    if (!router || !router.query.personalProjectId || personalProject) {
      return;
    }
    const { personalProjectId } = router.query;
    getPersonalProject(personalProjectId as string)
      .then((res) => {
        setPersonalProject(res);
      })
      .catch((err) => {
        toast.error((err as AxiosError).message);
      });
  }, [router]);

  return (
    <>
      <ScheduleModal
        onClose={() => {
          setIsScheduleModalOpen(false);
        }}
        onSuccess={handleScheduleCreate}
        forceOpen={isScheduleModalOpen}
        showButton={false}
      />
      {personalProject ? (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h5"
            color="inherit"
            component="div"
            fontWeight={600}
          >
            {personalProject.project.title}
          </Typography>
          <Divider sx={{ margin: "1rem 0" }} />
          <Typography fontWeight={600}>Objective:</Typography>
          <Typography>{personalProject.project.description}</Typography>
          <Divider sx={{ margin: "1rem 0" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight={600}>Schedule:</Typography>
            {personalProject.schedules && personalProject.schedules.length && (
              <IconButton
                aria-label="add"
                onClick={() => setIsScheduleModalOpen(true)}
              >
                <AddIcon />
              </IconButton>
            )}
          </Box>

          {personalProject?.schedules.length ? (
            <Stepper activeStep={activeSchedule} orientation="vertical">
              {personalProject.schedules.map((schedule, index) => {
                return (
                  <Step
                    key={schedule.id}
                    onClick={() => setActiveSchedule(index)}
                  >
                    <StepLabel sx={{ ":hover": { cursor: "pointer" } }}>
                      <Typography fontWeight={600}>
                        {schedule.description}
                      </Typography>
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
                        onTaskCreate={(text) =>
                          handleTaskCreate(schedule.id, text)
                        }
                        onTaskToggle={(id) => handleTaskToggle(schedule.id, id)}
                      />
                      <Divider sx={{ margin: "1rem 0" }} />
                      <QAndA
                        comments={schedule.comments ?? []}
                        scheduleId={schedule.id}
                        onCommentCreate={(text) => {
                          console.log(text);
                          handleCommentCreate(schedule.id, text);
                        }}
                      />
                    </StepContent>
                  </Step>
                );
              })}
            </Stepper>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>
                There are no elements. Please add the first one.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 1, mr: 1, width: "15rem" }}
                onClick={() => setIsScheduleModalOpen(true)}
              >
                Add
              </Button>
            </Box>
          )}
        </Box>
      ) : null}
    </>
  );
};
