import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { api } from "~/utils/api";
import { User } from "@prisma/client";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditUserModal({
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const [name, setName] = useState(user.name ?? "");
  const [role, setRole] = useState(user.role);

  const updateMutation = api.user.updateByAdmin.useMutation({
    onSuccess: () => {
      onUpdated();
      onClose();
    },
    onError: (err) => alert(err.message),
  });

  const handleSubmit = () => {
    updateMutation.mutate({ id: user.id, name, role });
  };

  useEffect(() => {
    setName(user.name ?? "");
    setRole(user.role);
  }, [user]);

  return (
    <Dialog open={!!user} onClose={onClose} fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          fullWidth
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={updateMutation.isPending}
          onClick={handleSubmit}
        >
          {updateMutation.isPending ? "Saveing..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
