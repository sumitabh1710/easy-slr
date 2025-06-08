import React, { useState } from "react";
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
import CreateTeamModal from "./CreateTeamModal";
import EditTeamModal from "./EditTeamModal";
import { Team } from "@prisma/client";

export default function TeamsTab() {
  const { data: teams, isPending, refetch } = api.team.getAll.useQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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
        <Typography variant="h5">Teams</Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Team
        </Button>
      </Box>

      <Paper>
        <List>
          {teams?.length ? (
            teams.map((team) => (
              <ListItem
                key={team.id}
                divider
                button
                onClick={() => setSelectedTeam(team)}
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText
                  primary={team.name}
                  secondary={`Users: ${team.users.length}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No teams found." />
            </ListItem>
          )}
        </List>
      </Paper>

      <CreateTeamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => void refetch()}
      />

      {selectedTeam && (
        <EditTeamModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onUpdated={() => void refetch()}
        />
      )}
    </Container>
  );
}
