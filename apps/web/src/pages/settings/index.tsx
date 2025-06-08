import { useSession } from "next-auth/react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Role } from "@prisma/client";

const roles = ["USER", "ADMIN"];

export default function ProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: userData, isLoading } = api.user.getById.useQuery(
    { id: userId! },
    { enabled: !!userId },
  );

  const updateUser = api.user.update.useMutation();

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("USER");

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? "");
      setRole(userData.role ?? "user");
    }
  }, [userData]);

  const handleSubmit = async () => {
    try {
      await updateUser.mutateAsync({
        id: userId!,
        name,
        role,
      });
      alert("Profile updated successfully!");
    } catch {
      alert("Update failed.");
    }
  };

  if (!session) return <Alert severity="error">You must be logged in.</Alert>;

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <TextField
        label="Email"
        value={userData?.email ?? ""}
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        {roles.map((r) => (
          <MenuItem key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={updateUser.isPending}
        >
          {updateUser.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Container>
  );
}
