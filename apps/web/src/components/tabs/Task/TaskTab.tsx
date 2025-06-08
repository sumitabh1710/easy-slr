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
  Chip,
  Stack,
} from "@mui/material";
import { api } from "~/utils/api";
import EditTaskModal from "./EditTaskModal";
import { Task } from "@prisma/client";
import CreateTaskModal from "./CreateTaskModal";

const priorities = ["All", "High", "Medium", "Low"] as const;

export default function TaskTab() {
  const { data: tasks, isPending, refetch } = api.task.getAll.useQuery();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] =
    useState<(typeof priorities)[number]>("All");

  const filteredTasks =
    filterPriority === "All"
      ? tasks
      : tasks?.filter((task) => task.priority === filterPriority);

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
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">Task List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Create Task
        </Button>
      </Box>

      <Stack direction="row" spacing={1} mb={2}>
        {priorities.map((p) => (
          <Chip
            key={p}
            label={p}
            color={filterPriority === p ? "primary" : "default"}
            onClick={() => setFilterPriority(p)}
            clickable
          />
        ))}
      </Stack>

      <Paper>
        <List>
          {filteredTasks?.length ? (
            filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                button
                divider
                onClick={() => setSelectedTask(task)}
                sx={{
                  ":hover": { cursor: "pointer" },
                }}
              >
                <ListItemText
                  primary={
                    <>
                      {task.title}{" "}
                      <Chip
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === "High"
                            ? "error"
                            : task.priority === "Medium"
                              ? "warning"
                              : "default"
                        }
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
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
