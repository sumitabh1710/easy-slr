import React, { useState } from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { api } from "~/utils/api";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskTab() {
  const { data: tasks, isLoading, refetch } = api.task.getAll.useQuery();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isLoading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Task List
      </Typography>

      {/* Create Task Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setModalOpen(true)}
      >
        Create Task
      </Button>

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
      <CreateTaskModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={async () => {
          await refetch();
          setModalOpen(false);
        }}
      />
    </Container>
  );
}
