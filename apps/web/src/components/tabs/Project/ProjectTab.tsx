import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { api } from "~/utils/api";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectTab() {
  const { data: projects, isPending, refetch } = api.project.getAll.useQuery();
  const [openModal, setOpenModal] = React.useState(false);

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
        <Typography variant="h5">Projects</Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Create Project
        </Button>
      </Box>
      <Paper>
        <List>
          {projects?.length ? (
            projects.map((project) => (
              <ListItem
                key={project.id}
                divider
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText
                  primary={project.name}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Team: {project.team?.name ?? "Unknown"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tasks: {project.tasks.length}
                      </Typography>
                    </>
                  }
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
      <CreateProjectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={() => void refetch()}
      />
    </Container>
  );
}
