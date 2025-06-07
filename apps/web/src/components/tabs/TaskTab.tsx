import React from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { api } from "~/utils/api";

export default function TaskTab() {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Task List
      </Typography>
      <Paper>
        <List>
          {tasks?.length ? (
            tasks.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={task.title}
                  secondary={`Project ID: ${task.projectId}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No tasks found." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}
