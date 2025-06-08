// pages/dashboard.tsx

import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from "@mui/material";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import TaskPriorityChart from "~/components/dashboard/TaskPriorityChart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { data: tasks, isLoading: loadingTasks } = api.task.getAll.useQuery();
  const { data: projects, isLoading: loadingProjects } =
    api.project.getAll.useQuery();

  const today = dayjs();
  const dueToday =
    tasks?.filter((task) => dayjs(task.deadline).isSame(today, "day")) ?? [];
  const overdue =
    tasks?.filter((task) => dayjs(task.deadline).isBefore(today, "day")) ?? [];

  if (status === "unauthenticated") {
    router.push("auth/Login");
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {loadingTasks || loadingProjects ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Top Summary Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Task Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Task Summary
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Tasks"
                      secondary={tasks?.length ?? 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Due Today"
                      secondary={dueToday.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Overdue"
                      secondary={overdue.length}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Project Overview */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Project Overview
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <List dense>
                  {projects?.map((project) => (
                    <ListItem key={project.id}>
                      <ListItemText
                        primary={project.name}
                        secondary={`Tasks: ${project.tasks.length}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Team Activity Placeholder */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Team Activity
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  This section can later include recent activity, comments, or
                  updates from your team.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tasks by Priority
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" justifyContent="center">
              <TaskPriorityChart />
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}
