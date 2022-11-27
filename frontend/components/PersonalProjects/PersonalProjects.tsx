import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPersonalProjects, putPersonalProject } from "../../api/api";
import { Context } from "../../contexts/UserContext";
import { Project } from "../Projects/Projects";

export interface PersonalProject {
  id: string;
  studentId: string;
  projectId: string;
  createdAt: string;
  project: Project & { teacher: { id: string; name: string } };
  status: PersonalProjectStatus;
  student: { name: string };
}

export type PersonalProjectStatus = keyof typeof PersonalProjectStatusEnum;

export enum PersonalProjectStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FAILED = "FAILED",
  DONE = "DONE",
}

export const isActiveProject = (status: PersonalProjectStatus) =>
  [
    PersonalProjectStatusEnum.APPROVED,
    PersonalProjectStatusEnum.DONE,
    PersonalProjectStatusEnum.FAILED,
  ].includes(PersonalProjectStatusEnum[status]);

export const canBeEdited = (status: PersonalProjectStatus) =>
  status === PersonalProjectStatusEnum.APPROVED;

export const personalProjectStatues = {
  [PersonalProjectStatusEnum.PENDING]: {
    value: "Pending",
    color: "#CCCC00",
  },
  [PersonalProjectStatusEnum.APPROVED]: {
    value: "Approved",
    color: "blue",
  },
  [PersonalProjectStatusEnum.REJECTED]: {
    value: "Rejected",
    color: "darkred",
  },
  [PersonalProjectStatusEnum.FAILED]: {
    value: "Failed",
    color: "velvet",
  },
  [PersonalProjectStatusEnum.DONE]: {
    value: "Done",
    color: "green",
  },
};

export const PersonalProjects = () => {
  const context = useContext(Context);
  const router = useRouter();
  const [personalProjects, setPersonalProjects] = useState<
    PersonalProject[] | null
  >([]);

  const handleStatusChange = async (
    id: string,
    status: PersonalProjectStatus
  ) => {
    if (!context?.isTeacher) return;

    try {
      const res = (await putPersonalProject(id, { status })) as PersonalProject;
      setPersonalProjects((currentState) =>
        currentState
          ? currentState.map((personalProject) =>
              personalProject.id === res.id
                ? { ...personalProject, ...res }
                : personalProject
            )
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
    if (
      context &&
      context.user &&
      personalProjects &&
      !personalProjects.length
    ) {
      getPersonalProjects()
        .then((response) => {
          setPersonalProjects(response);
        })
        .catch((e) =>
          toast.error(
            (e as AxiosError<{ statusCode: number; message: string }>).response
              ?.data?.message
          )
        );
    }
  }, [context, personalProjects]);

  return personalProjects ? (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="inherit" component="div" mb={2}>
        Personal projects
      </Typography>
      <Grid container spacing={2}>
        {personalProjects.length ? (
          personalProjects.map(({ id, project, status, student }) => (
            <Grid item xs={12} key={id}>
              <Card
                {...((isActiveProject(status) || context?.isTeacher) && {
                  sx: { cursor: "pointer" },
                  onClick: () => router.push(`/personal-projects/${id}`),
                })}
              >
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5" component="div">
                      {project.title}
                    </Typography>
                    {context?.isTeacher && (
                      <TextField
                        id="status-select"
                        select
                        value={status}
                        label="Status"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(
                            id,
                            e.target.value as PersonalProjectStatus
                          )
                        }
                        sx={{ width: "8rem" }}
                      >
                        {Object.entries(personalProjectStatues).map(
                          ([key, value]) => (
                            <MenuItem
                              value={key}
                              key={key}
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                color: value.color,
                              }}
                            >
                              {value.value}
                            </MenuItem>
                          )
                        )}
                      </TextField>
                    )}
                  </Box>
                  <Typography
                    component="div"
                    color={personalProjectStatues[status].color}
                  >
                    {personalProjectStatues[status].value}
                  </Typography>

                  <Box>
                    <Typography component="span" fontWeight={600}>
                      {context?.isStudent ? "Teacher" : "Student"}:
                    </Typography>
                    <Typography component="span">
                      {context?.isStudent ? project.teacher.name : student.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2">{project.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlignLast: "center" }}
            >
              You have no personal projects. Please, visit the{" "}
              <Link href="/">projects page</Link> and apply for the desired one
              or contact your teacher.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
