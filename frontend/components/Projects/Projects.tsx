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
import React, { useEffect, useState } from "react";
import { ProjectModal } from "../ProjectModal/ProjectModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { getProjects } from "../../api/api";
import { orderBy } from "lodash";

export const Projects = () => {
  const [projects, setProjects] = useState<
    {
      id: number;
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
    }[]
  >([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [textFilter, setTextFilter] = useState("");

  useEffect(() => {
    (async () => {
      const response = await getProjects();
      setProjects(response);
      setTeachers(response.map((project) => project.teacher));
    })();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
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
          <ProjectModal
            onSuccess={(newProj) =>
              setProjects((currentState) =>
                orderBy([...currentState, newProj], "title")
              )
            }
          />
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
              <MenuItem value={teacher.id}>{teacher.name}</MenuItem>
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
                <CardActions>
                  <Button size="small">Sign up</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
