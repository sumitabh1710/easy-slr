import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { api } from "~/utils/api";
import { Task, User } from "@prisma/client";

interface EditTaskModalProps {
  task: Task & { assignedTo?: User | null };
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTaskModal({
  task,
  open,
  onClose,
  onUpdated,
}: EditTaskModalProps) {
  const [assignedToId, setAssignedToId] = useState<string | undefined>(
    task.assignedTo?.id ?? "",
  );
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().slice(0, 16),
  );

  const { data: users, isLoading } = api.user.getAll.useQuery();

  const updateMutation = api.task.update.useMutation({
    onSuccess: () => {
      onUpdated();
      onClose();
    },
    onError: (err) => alert(err.message),
  });

  const deleteMutation = api.task.delete.useMutation({
    onSuccess: () => {
      onUpdated();
      onClose();
    },
    onError: (err) => alert(err.message),
  });

  const handleSubmit = () => {
    updateMutation.mutate({
      id: task.id,
      assignedToId: assignedToId ?? undefined,
      deadline: deadline,
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate({ id: task.id });
    }
  };

  useEffect(() => {
    setAssignedToId(task.assignedTo?.id ?? "");
    setDeadline(new Date(task.deadline).toISOString().slice(0, 16));
  }, [task]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          select
          fullWidth
          label="Assignee"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          disabled={isLoading}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {users?.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name ?? user.email}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Deadline"
          type="datetime-local"
          fullWidth
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      <Box>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
