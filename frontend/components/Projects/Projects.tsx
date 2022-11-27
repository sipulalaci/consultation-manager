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
import { get, orderBy, uniqBy } from "lodash";
import { Context } from "../../contexts/UserContext";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import { UserEnum } from "../../types/User";

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
  const [shouldForceModalOpen, setShouldForceModalOpen] = useState(false);
  console.log({ context });

  const handleSignup = async () => {
    if (!context?.user || !selectedProject) return;

    try {
      await postPersonalProject({
        projectId: selectedProject.id,
        studentId: context.user.id,
      });

      router.reload();
    } catch (e) {
      toast.error(
        (e as AxiosError<{ statusCode: number; message: string }>).response
          ?.data?.message
      );
    }
  };

  const handleCancel = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getProjects();
        setProjects(response);
      } catch (e) {
        toast.error(
          (e as AxiosError<{ statusCode: number; message: string }>).response
            ?.data?.message
        );
      }
    })();
  }, []);

  useEffect(() => {
    const teachers = projects.map((project) => project.teacher);
    setTeachers(uniqBy(teachers, "id"));
  }, [projects]);

  useEffect(() => {
    if (
      context &&
      context.user &&
      context.user.type === UserEnum.STUDENT &&
      selectedProject
    ) {
      setIsModalOpen(true);
    }
  }, [selectedProject, context]);

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
          {!isFilterOpen ? (
            <IconButton onClick={() => setIsFilterOpen((current) => !current)}>
              <FilterAltIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsFilterOpen((current) => !current)}>
              <FilterAltOffIcon />
            </IconButton>
          )}
          {context?.isTeacher && (
            <ProjectModal
              forceOpen={shouldForceModalOpen}
              onCancel={() => setShouldForceModalOpen(false)}
              onSuccess={(newProj) =>
                setProjects((currentState) =>
                  orderBy([...currentState, newProj], "title")
                )
              }
            />
          )}
        </Box>
      </Box>
      <Collapse in={isFilterOpen}>
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
            id="teacher-select"
            select
            value={teacherFilter}
            label="Teacher"
            onChange={(e) => setTeacherFilter(e.target.value)}
            sx={{ width: "50%" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {teachers.map((teacher) => (
              <MenuItem value={teacher.id} key={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>
      <Grid container spacing={2}>
        {projects?.length ? (
          projects
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
                      {`${get(project, "personalProjectsCount", 0)}/${
                        project.capacity
                      }`}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {project.title}
                    </Typography>

                    <Typography variant="body2">
                      {project.description}
                    </Typography>
                  </CardContent>
                  {context?.isStudent &&
                    !context?.hasActivePersonalProject &&
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
            ))
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "Center",
              gap: "1rem",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ width: "fit-content" }}
            >
              {context?.isTeacher
                ? "There are no projects to show, add the first one."
                : "There are no projects to show, ask your teacher to create one."}
            </Typography>
            {context?.isTeacher && (
              <Button
                variant="contained"
                onClick={() => setShouldForceModalOpen(true)}
              >
                Add project
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
