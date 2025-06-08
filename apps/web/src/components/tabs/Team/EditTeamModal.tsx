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
import { Team } from "@prisma/client";

interface EditTeamModalProps {
  team: Team;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditTeamModal({
  team,
  onClose,
  onUpdated,
}: EditTeamModalProps) {
  const [name, setName] = useState(team.name);
  const [userIds, setUserIds] = useState<string[]>(team.users.map((u) => u.id));

  const { data: users } = api.user.getAll.useQuery();

  const updateMutation = api.team.update.useMutation({
    onSuccess: () => {
      onUpdated();
      onClose();
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate({ id: team.id, name, userIds });
  };

  useEffect(() => {
    setName(team.name);
    setUserIds(team.users.map((u) => u.id));
  }, [team]);

  return (
    <Dialog open={!!team} onClose={onClose} fullWidth>
      <DialogTitle>Edit Team</DialogTitle>
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
          label="Users"
          SelectProps={{ multiple: true }}
          value={userIds}
          onChange={(e) => setUserIds(e.target.value as string[])}
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
          disabled={updateMutation.isPending}
          variant="contained"
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
