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

export interface Schedule {
  id: string;
  personalProjectId: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  tasks: Task[];
  comments: Question[];
}

export interface Question {
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
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [createdTaskDescrption, setCreatedTaskDescrption] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [createdQuestion, setCreatedQuestion] = useState("");
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

  const addTask = async (scheduleId: string) => {
    if (!personalProject || !createdTaskDescrption) return;
    const newTask = await postScheduleAddTask(scheduleId, {
      description: createdTaskDescrption,
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
    setIsAddingTask(false);
    setCreatedTaskDescrption("");
  };

  const handleCommentCreate = async (scheduleId: string) => {
    if (!personalProject || !createdQuestion || !context || !context.user)
      return;

    try {
      const newQuestion = await postComment({
        question: createdQuestion,
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
                        newQuestion as Question,
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

                      {schedule.tasks && schedule.tasks.length ? (
                        <Stack>
                          {schedule.tasks.map((task) => (
                            <FormControlLabel
                              key={task.id}
                              label={task.description}
                              control={
                                <Checkbox
                                  checked={task.isDone}
                                  onClick={() =>
                                    handleTaskToggle(schedule.id, task.id)
                                  }
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
                            value={createdTaskDescrption}
                            onChange={(e) =>
                              setCreatedTaskDescrption(e.target.value)
                            }
                            sx={{ width: "100%" }}
                          />
                          <IconButton
                            aria-label="add"
                            onClick={() => addTask(schedule.id)}
                            color="success"
                            sx={{ width: "3.5rem", height: "3.5rem" }}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            aria-label="add"
                            onClick={() => {
                              setIsAddingTask(false);
                              setCreatedTaskDescrption("");
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
                      <Divider sx={{ margin: "1rem 0" }} />
                      <Typography fontWeight={600}>Q&A</Typography>
                      {schedule?.comments.length ? (
                        <Stack>
                          {schedule.comments.map((comment) => (
                            <Paper
                              key={comment.id}
                              sx={{ padding: "1rem", marginBottom: "1rem" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: ".5rem",
                                  ...(comment.userId === context?.user?.id
                                    ? {
                                        justifyContent: "flex-start",
                                        flexDirection: "row-reverse",
                                      }
                                    : {
                                        justifyContent: "flex-start",
                                      }),
                                }}
                              >
                                <Typography fontWeight={600}>
                                  {comment.user.name}
                                </Typography>
                                <Typography>{` | `}</Typography>
                                <Typography>
                                  {format(
                                    new Date(comment.createdAt),
                                    "yyyy.MM.dd"
                                  )}
                                </Typography>
                              </Box>
                              <Divider />
                              <Typography>{comment.question}</Typography>
                            </Paper>
                          ))}
                        </Stack>
                      ) : (
                        <Typography>There are no questions.</Typography>
                      )}
                      <Collapse in={isAddingQuestion}>
                        <Box sx={{ display: "flex" }}>
                          <TextField
                            label="Text"
                            name="text"
                            variant="outlined"
                            multiline
                            rows={3}
                            value={createdQuestion}
                            onChange={(e) => setCreatedQuestion(e.target.value)}
                            sx={{ width: "100%" }}
                          />
                          <IconButton
                            aria-label="add"
                            onClick={() => handleCommentCreate(schedule.id)}
                            color="success"
                            sx={{ width: "3.5rem", height: "3.5rem" }}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            aria-label="add"
                            onClick={() => {
                              setIsAddingQuestion(false);
                              setCreatedQuestion("");
                            }}
                            color="warning"
                            sx={{ width: "3.5rem", height: "3.5rem" }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </Collapse>
                      <Collapse in={!isAddingQuestion}>
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
                              setIsAddingQuestion(true);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Collapse>
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
