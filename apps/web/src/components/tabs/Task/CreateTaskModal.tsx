import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { api } from "~/utils/api";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const priorities = ["Low", "Medium", "High"];

export default function CreateTaskModal({
  open,
  onClose,
  onCreated,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      onCreated();
      onClose();
      resetForm();
    },
  });

  const { data: projects, isLoading: loadingProjects } =
    api.project.getAll.useQuery();

  const resetForm = () => {
    setTitle("");
    setProjectId("");
    setDescription("");
    setPriority("Medium");
    setDeadline("");
  };

  const handleSubmit = () => {
    if (!title || !projectId || !priority || !deadline) return;

    createTaskMutation.mutate({
      title,
      projectId,
      description: description || undefined,
      priority,
      deadline,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Title"
          fullWidth
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          select
          label="Project"
          fullWidth
          required
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={loadingProjects}
        >
          {loadingProjects ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            projects?.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          select
          label="Priority"
          fullWidth
          required
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Deadline"
          type="datetime-local"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createTaskMutation.isPending}
        >
          {createTaskMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
