import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { api } from "../utils/api";

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
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const createTaskMutation = api.task.create.useMutation({
    onSuccess: () => {
      onCreated();
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle("");
    setProjectId("");
    setPriority("Medium");
    setDeadline("");
  };

  const handleSubmit = () => {
    if (!title || !projectId || !priority || !deadline) return;

    createTaskMutation.mutate({
      title,
      projectId,
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
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Project ID"
          fullWidth
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <TextField
          select
          label="Priority"
          fullWidth
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
