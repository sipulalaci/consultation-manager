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
  PersonalProject,
} from "../PersonalProjects/PersonalProjects";
import { orderBy } from "lodash";
import { Context } from "../../contexts/UserContext";
import { Schedule } from "../../types/Schedule";
import { Comment } from "../../types/Comment";
import { Task } from "../../types/Task";

export const usePersonalProjectDetails = () => {
  const router = useRouter();
  const [personalProject, setPersonalProject] = useState<
    (PersonalProject & { schedules: Schedule[]; consultations: any[] }) | null
  >(null);
  const [activeSchedule, setActiveSchedule] = useState(0);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const context = useContext(Context);
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

  return {
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
  };
};
