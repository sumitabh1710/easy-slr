import React, { useState } from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { api } from "~/utils/api";
import EditTaskModal from "./EditTaskModal";
import { Task } from "@prisma/client";
import CreateTaskModal from "./CreateTaskModal";

export default function TaskTab() {
  const { data: tasks, isPending, refetch } = api.task.getAll.useQuery();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (isPending)
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
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom>
          Task List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setModalOpen(true)}
        >
          Create Task
        </Button>
      </Box>

      <Paper>
        <List>
          {tasks?.length ? (
            tasks.map((task) => (
              <ListItem
                key={task.id}
                button
                divider
                onClick={() => setSelectedTask(task)}
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText
                  primary={task.title}
                  secondary={
                    <>
                      Project: {task.project?.name ?? "Unknown"} <br />
                      Assigned to: {task.assignedTo?.name ?? "Unassigned"}{" "}
                      <br />
                      Deadline: {new Date(task.deadline).toLocaleString()}
                    </>
                  }
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

      {selectedTask && (
        <EditTaskModal
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdated={async () => {
            await refetch();
            setSelectedTask(null);
          }}
        />
      )}
    </Container>
  );
}
