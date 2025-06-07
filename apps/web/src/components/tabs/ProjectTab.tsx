import React from "react";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { api } from "~/utils/api";

export default function ProjectTab() {
  const { data: projects, isLoading, refetch } = api.project.getAll.useQuery();

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCreateProject = () => {
    createProjectMutation.mutate({
      name: "New Project",
      description: "Default description",
    });
  };

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <Container sx={{ mt: 2 }}>
      <Box mb={2}>
        <Button variant="contained" onClick={handleCreateProject}>
          Create Project
        </Button>
      </Box>

      <Paper>
        <List>
          {projects?.length ? (
            projects.map((project) => (
              <ListItem key={project.id}>
                <ListItemText
                  primary={project.name}
                  secondary={project.description}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No projects found." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}
