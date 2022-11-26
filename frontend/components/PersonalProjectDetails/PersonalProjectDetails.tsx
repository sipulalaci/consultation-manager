import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Step,
  StepContent,
  StepLabel,
  Stepper,
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
import {
  canBeEdited,
  isActiveProject,
  PersonalProject,
  personalProjectStatues,
} from "../PersonalProjects/PersonalProjects";
import { ScheduleModal } from "../ScheduleModal/ScheduleModal";
import { orderBy } from "lodash";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { Context } from "../../contexts/UserContext";
import { QAndA } from "../QAndA/QAndA";
import { Tasks } from "../Tasks/Tasks";
import { Schedule } from "../../types/Schedule";
import { Comment } from "../../types/Comment";
import { Task } from "../../types/Task";
import GroupsIcon from "@mui/icons-material/Groups";

export const PersonalProjectDetails = () => {
  const router = useRouter();
  const [personalProject, setPersonalProject] = useState<
    (PersonalProject & { schedules: Schedule[]; consultations: any[] }) | null
  >(null);
  const [activeSchedule, setActiveSchedule] = useState(0);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const context = useContext(Context);
  console.log({ isScheduleModalOpen });
  const canEdit =
    (context?.isTeacher ||
      (context?.isStudent &&
        personalProject &&
        canBeEdited(personalProject.status))) ??
    false;

  const handleScheduleCreate = async (schedule: {
    description: string;
    deadline: string;
  }) => {
    if (!personalProject || !canEdit) return;

    try {
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
      setIsScheduleModalOpen(false);
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data.message
      );
    }
  };

  const handleTaskCreate = async (scheduleId: string, text: string) => {
    if (!personalProject || !canEdit) return;
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
    if (!personalProject || !context || !context.user || !canEdit) return;

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
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
    }
  };

  const handleTaskToggle = async (scheduleId: string, taskId: string) => {
    if (!personalProject || !canEdit) return;
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
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
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
      .catch((e) => {
        toast.error(
          (e as AxiosError<{ statusCode: number; message: string }>).response
            ?.data?.message
        );
      });
  }, [router, personalProject]);

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
          <Box sx={{ display: "flex", gap: ".5rem" }}>
            <Typography fontWeight={600}>Status:</Typography>
            <Typography
              fontWeight={600}
              color={personalProjectStatues[personalProject.status].color}
            >
              {personalProjectStatues[personalProject.status].value}
            </Typography>
          </Box>
          <Typography fontWeight={600}>Objective:</Typography>
          <Typography>{personalProject.project.description}</Typography>
          <Divider sx={{ margin: "1rem 0" }} />
          {context?.isTeacher || isActiveProject(personalProject.status) ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={600}>Schedule:</Typography>
                {personalProject.schedules &&
                  !!personalProject.schedules.length &&
                  canEdit && (
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
                  {personalProject.schedules.map((schedule, index) => (
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
                          canBeEdited={canEdit}
                          onTaskCreate={(text) =>
                            handleTaskCreate(schedule.id, text)
                          }
                          onTaskToggle={(id) =>
                            handleTaskToggle(schedule.id, id)
                          }
                        />
                        <Divider sx={{ margin: "1rem 0" }} />
                        <QAndA
                          comments={schedule.comments ?? []}
                          canBeEdited={canEdit}
                          onCommentCreate={(text) =>
                            handleCommentCreate(schedule.id, text)
                          }
                        />
                      </StepContent>
                    </Step>
                  ))}
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
                  {canEdit ? (
                    <>
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
                    </>
                  ) : (
                    <Typography>Project is not active!</Typography>
                  )}
                </Box>
              )}
              <Divider sx={{ margin: "1rem 0" }} />
              <Typography fontWeight={600}>Events:</Typography>
              {personalProject.consultations?.length ? (
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  {personalProject.consultations.map((consultation) => (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <GroupsIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Consultation"
                        secondary={format(
                          new Date(consultation.date),
                          "HH:mm - yyyy.MM.dd"
                        )}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ textAlignLast: "center" }}>
                  There are no events for this project.
                </Typography>
              )}
            </>
          ) : (
            <Typography sx={{ textAlignLast: "center" }}>
              This project is not active. Please contact your teacher.
            </Typography>
          )}
        </Box>
      ) : null}
    </>
  );
};
