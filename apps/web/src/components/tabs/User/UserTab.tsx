import React, { useState } from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { api } from "~/utils/api";
import { User } from "@prisma/client";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

export default function UserTab() {
  const { data: users, isPending, refetch } = api.user.getAll.useQuery();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">User List</Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create User
        </Button>
      </Box>

      <Paper>
        <List>
          {users?.length ? (
            users.map((user) => (
              <ListItem
                key={user.id}
                divider
                button
                onClick={() => setSelectedUser(user)}
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText
                  primary={user.name ?? user.email}
                  secondary={`Email: ${user.email} | Role: ${user.role}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No users found." />
            </ListItem>
          )}
        </List>
      </Paper>

      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={() => void refetch()}
      />

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={() => void refetch()}
        />
      )}
    </Container>
  );
}
