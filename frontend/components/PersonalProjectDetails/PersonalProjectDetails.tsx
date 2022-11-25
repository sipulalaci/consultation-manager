import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPersonalProject,
  postSchedule,
  postScheduleAddTask,
} from "../../api/api";
import { PersonalProject } from "../PersonalProjects/PersonalProjects";
import { ScheduleModal } from "../ScheduleModal/ScheduleModal";
import { orderBy } from "lodash";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/system";

export interface Schedule {
  id: string;
  personalProjectId: string;
  description: string;
  deadline: Date;
  createdAt: Date;
  tasks: Task[];
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
                    tasks: [...schedule.tasks, newTask as Task],
                  }
                : schedule
            ),
          }
        : null
    );
    setIsAddingTask(false);
    setCreatedTaskDescrption("");
  };

  useEffect(() => {
    console.log("fetching project");
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
                    <StepLabel>
                      <Typography fontWeight={600}>
                        {schedule.description}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography>Tasks:</Typography>

                      {schedule.tasks && schedule.tasks.length ? (
                        <Stack>
                          {schedule.tasks.map((task) => (
                            <FormControlLabel
                              key={task.id}
                              label={task.description}
                              control={<Checkbox checked={task.isDone} />}
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
