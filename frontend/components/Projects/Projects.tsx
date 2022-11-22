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
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ProjectModal } from "../ProjectModal/ProjectModal";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "This is the first project",
    teacherId: 1,
    createdAt: "2021-09-01T00:00:00.000Z",
    capacity: 4,
  },
  {
    id: 2,
    title: "Project 2",
    description: "This is the second project",
    teacherId: 1,
    createdAt: "2021-09-01T00:00:00.000Z",
    capacity: 4,
  },
  {
    id: 3,
    title: "Project 3",
    description: "This is the third project",
    teacherId: 1,
    createdAt: "2021-09-01T00:00:00.000Z",
    capacity: 4,
  },
];

const names = ["Oliver Hansen", "Van Henry", "April Tucker"];

export const Projects = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit" component="div">
          Projects
        </Typography>

        <Box>
          {!isFilterOpen ? (
            <IconButton aria-label="add" onClick={() => setIsFilterOpen(true)}>
              <FilterAltIcon />
            </IconButton>
          ) : (
            <IconButton aria-label="add" onClick={() => setIsFilterOpen(false)}>
              <FilterAltOffIcon />
            </IconButton>
          )}
          <ProjectModal />
        </Box>
      </Box>
      <Collapse in={!isFilterOpen}>
        <Box sx={{ mt: 1, mb: 3, display: "flex", gap: 2 }}>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            sx={{ width: "50%" }}
          />
          <TextField
            id="demo-simple-select"
            select
            value={name}
            label="Teacher"
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "50%" }}
          >
            {names.map((name) => (
              <MenuItem value={name}>{name}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} key={project.id}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {`12/${project.capacity}`}
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
