import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

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

export const PersonalProjects = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" color="inherit" component="div">
        Personal projects
      </Typography>
      <Grid container spacing={2}>
        {projects.map((project) => (
          <Grid item xs={12} key={project.id}>
            <Card sx={{ cursor: "pointer" }} onClick={console.log}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {project.title}
                </Typography>

                <Typography variant="body2">{project.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
