import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { Router, useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPersonalProjects } from "../../api/api";
import { Context } from "../../contexts/UserContext";
import { Project } from "../Projects/Projects";

export interface PersonalProject {
  id: string;
  studentId: string;
  projectId: string;
  createdAt: string;
  project: Project & { teacher: { id: string; name: string } };
  status: keyof typeof PersonalProjectStatusEnum;
  student: { name: string };
}

export enum PersonalProjectStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FAILED = "FAILED",
  DONE = "DONE",
}

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
  const [personalProjects, setPersonalProjects] = useState<PersonalProject[]>(
    []
  );

  useEffect(() => {
    if (context && context.user && !personalProjects.length) {
      getPersonalProjects()
        .then((response) => {
          setPersonalProjects(response);
        })
        .catch((error) => toast.error((error as AxiosError).message));
    }
  }, [context]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="inherit" component="div" mb={2}>
        Personal projects
      </Typography>
      <Grid container spacing={2}>
        {personalProjects.map(({ id, project, status, student }) => (
          <Grid item xs={12} key={id}>
            <Card
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/personal-projects/${id}`)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {project.title}
                </Typography>
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
        ))}
      </Grid>
    </Box>
  );
};
