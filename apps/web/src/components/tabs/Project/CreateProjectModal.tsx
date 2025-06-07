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

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateProjectModal({
  open,
  onClose,
  onCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");

  const createProjectMutation = api.project.create.useMutation({
    onSuccess: () => {
      onCreated();
      onClose();
      resetForm();
    },
  });

  const { data: teams, isLoading: loadingTeams } = api.team.getAll.useQuery();

  const resetForm = () => {
    setName("");
    setTeamId("");
  };

  const handleSubmit = () => {
    if (!name || !teamId) return;

    createProjectMutation.mutate({ name, teamId });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Project Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          select
          label="Select Team"
          fullWidth
          required
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          disabled={loadingTeams}
        >
          {loadingTeams ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            teams?.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))
          )}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={createProjectMutation.isPending}>
          {createProjectMutation.isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
