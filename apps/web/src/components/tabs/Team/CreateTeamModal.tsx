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

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTeamModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);

  const { data: users, isLoading } = api.user.getAll.useQuery();

  const createMutation = api.team.create.useMutation({
    onSuccess: () => {
      onCreated();
      onClose();
      setName("");
      setUserIds([]);
    },
  });

  const handleSubmit = () => {
    if (!name) return;
    createMutation.mutate({ name, userIds });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create Team</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Team Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          select
          fullWidth
          label="Assign Users"
          SelectProps={{ multiple: true }}
          value={userIds}
          onChange={(e) => setUserIds(e.target.value as string[])}
          disabled={isLoading}
        >
          {users?.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name ?? user.email}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          variant="contained"
        >
          {createMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
