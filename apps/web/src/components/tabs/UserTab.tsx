import React from "react";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { api } from "~/utils/api";

export default function UserTab() {
  const { data: users, isLoading } = api.user.getAll.useQuery();

  if (isLoading) return <div>Loading users...</div>;

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        User List
      </Typography>
      <Paper>
        <List>
          {users?.length ? (
            users.map((user) => (
              <ListItem key={user.id}>
                <ListItemText
                  primary={user.name ?? user.email}
                  secondary={user.email}
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
    </Container>
  );
}
