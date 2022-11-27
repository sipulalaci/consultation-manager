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
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import {
  isActiveProject,
  personalProjectStatues,
} from "../PersonalProjects/PersonalProjects";
import { ScheduleModal } from "../ScheduleModal/ScheduleModal";
import AddIcon from "@mui/icons-material/Add";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { QAndA } from "../QAndA/QAndA";
import { Tasks } from "../Tasks/Tasks";
import GroupsIcon from "@mui/icons-material/Groups";
import { usePersonalProjectDetails } from "./usePersonalProjectDetails";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { Schedule } from "../../types/Schedule";

const getScheduleStatus = (schedule: Schedule) => {
  const isComplete = schedule.tasks.every((task) => task.isDone);
  const isOverdue = isBefore(new Date(schedule.deadline), new Date());
  const isDue =
    isBefore(new Date(), new Date(schedule.deadline)) &&
    isAfter(new Date(), addDays(new Date(schedule.deadline), -5));

  return {
    isCompleted: isComplete,
    isFailed: isOverdue && !isComplete,
    isDue,
    isInprogress: !isComplete && !isOverdue && !isDue,
  };
};

export const PersonalProjectDetails = () => {
  const {
    activeSchedule,
    canEdit,
    context,
    isScheduleModalOpen,
    personalProject,
    setActiveSchedule,
    setIsScheduleModalOpen,
    handleScheduleCreate,
    handleTaskCreate,
    handleCommentCreate,
    handleTaskToggle,
  } = usePersonalProjectDetails();

  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { active?: boolean };
    scheduleState: {
      isInprogress?: boolean;
      isCompleted?: boolean;
      isDue?: boolean;
      isFailed?: boolean;
    };
  }>(({ theme, ownerState, scheduleState }) => ({
    zIndex: 1,
    color: "#fff",
    width: 24,
    height: 24,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      background: "#1976d2",
    }),
    ...(scheduleState.isInprogress && {
      background: "#dce775",
    }),
    ...(scheduleState.isDue && {
      background: "#ff5722",
    }),
    ...(scheduleState.isFailed && {
      background: "#d50000",
    }),
    ...(scheduleState.isCompleted && {
      background: "#4caf50",
    }),
  }));

  const CustomStepIcon = (props: {
    active: boolean;
    isInprogress: boolean;
    isCompleted: boolean;
    isFailed: boolean;
    isDue: boolean;
  }) => {
    const { isInprogress, isCompleted, isFailed, isDue, active } = props;
    return (
      <ColorlibStepIconRoot
        ownerState={{ active }}
        scheduleState={{ isInprogress, isCompleted, isFailed, isDue }}
      >
        {isInprogress ? (
          <AccessTimeIcon />
        ) : isCompleted ? (
          <DoneIcon />
        ) : isDue ? (
          <WarningIcon />
        ) : (
          <ErrorIcon />
        )}
      </ColorlibStepIconRoot>
    );
  };

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
                      <StepLabel
                        sx={{ ":hover": { cursor: "pointer" } }}
                        StepIconComponent={({ active }: StepIconProps) => (
                          <CustomStepIcon
                            active={active ?? false}
                            // isCompleted
                            // isInprogress
                            // isDue
                            // isFailed
                            {...getScheduleStatus(schedule)}
                          />
                        )}
                      >
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
                  {personalProject.consultations.map((consultation, index) => (
                    <ListItem
                      key={consultation.id}
                      divider={
                        index !== personalProject.consultations.length - 1
                      }
                      disabled={isBefore(
                        new Date(consultation.date),
                        new Date()
                      )}
                    >
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
