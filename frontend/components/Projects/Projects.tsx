import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ProjectModal } from "../ProjectModal/ProjectModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { getProjects, postPersonalProject } from "../../api/api";
import { orderBy, uniqBy } from "lodash";
import { Context, UserEnum } from "../../contexts/UserContext";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { AxiosError } from "axios";

export interface Project {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  createdAt: string;
  capacity: number;
  personalProjectsCount: number;
  teacher: {
    id: string;
    name: string;
  };
}

export const Projects = () => {
  const context = useContext(Context);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignup = async () => {
    if (!context?.user || !selectedProject) return;

    try {
      await postPersonalProject({
        projectId: selectedProject.id,
        studentId: context.user.id,
      });

      router.reload();
    } catch (e) {
      toast.error((e as AxiosError).message);
    }
  };

  const handleCancel = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const response = await getProjects();
      setProjects(response);
      setTeachers(
        uniqBy(
          response.map((project) => project.teacher),
          "id"
        )
      );
    })();
  }, []);

  useEffect(() => {
    if (
      context &&
      context.user &&
      context.user.type === UserEnum.STUDENT &&
      selectedProject
    ) {
      setIsModalOpen(true);
    }
  }, [selectedProject]);

  return (
    <Box sx={{ p: 2 }}>
      <ConfirmationModal
        description={`Are you sure you want to sign up for ${selectedProject?.title}?`}
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onConfirm={handleSignup}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit" component="div">
          Projects
        </Typography>

        <Box>
          {isFilterOpen ? (
            <IconButton aria-label="add" onClick={() => setIsFilterOpen(false)}>
              <FilterAltIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="add" onClick={() => setIsFilterOpen(true)}>
              <FilterAltOffIcon />
            </IconButton>
          )}
          {context?.isTeacher && (
            <ProjectModal
              onSuccess={(newProj) =>
                setProjects((currentState) =>
                  orderBy([...currentState, newProj], "title")
                )
              }
            />
          )}
        </Box>
      </Box>
      <Collapse in={!isFilterOpen}>
        <Box sx={{ mt: 1, mb: 3, display: "flex", gap: 2 }}>
          <TextField
            id="title"
            label="Title"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            variant="outlined"
            sx={{ width: "50%" }}
          />
          <TextField
            id="demo-simple-select"
            select
            value={teacherFilter}
            label="Teacher"
            onChange={(e) => setTeacherFilter(e.target.value)}
            sx={{ width: "50%" }}
          >
            {teachers.map((teacher) => (
              <MenuItem value={teacher.id} key={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>
      <Grid container spacing={2}>
        {projects
          ?.filter((project) => {
            if (!textFilter && !teacherFilter) return true;
            if (textFilter && !teacherFilter)
              return project.title
                .toLowerCase()
                .includes(textFilter.toLowerCase());
            if (!textFilter && teacherFilter)
              return project.teacherId === teacherFilter;
            if (textFilter && teacherFilter)
              return (
                project.title
                  .toLowerCase()
                  .includes(textFilter.toLowerCase()) &&
                project.teacherId === teacherFilter
              );
          })
          .map((project) => (
            <Grid item xs={12} key={project.id}>
              <Card>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {`${project.personalProjectsCount}/${project.capacity}`}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {project.title}
                  </Typography>

                  <Typography variant="body2">{project.description}</Typography>
                </CardContent>
                {context?.isStudent &&
                  project.personalProjectsCount < project.capacity && (
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => setSelectedProject(project)}
                      >
                        Sign up
                      </Button>
                    </CardActions>
                  )}
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
