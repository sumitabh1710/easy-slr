/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { api } from "../utils/api";
import CreateTaskModal from "../components/CreateTaskModal";
import { useRouter } from "next/router";
import TaskTab from "~/components/tabs/TaskTab";
import ProjectTab from "~/components/tabs/ProjectTab";
import UserTab from "~/components/tabs/UserTab";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleLogout = () => signOut();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("auth/Login");
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">EasySLR Dashboard</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>
              {session?.user?.name ?? session?.user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          sx={{
            "& .MuiTab-root": {
              color: "#000",
            },
            "& .Mui-selected": {
              color: "#fff",
            },
          }}
        >
          <Tab label="Tasks" />
          <Tab label="Projects" />
          <Tab label="Users" />
          <Tab label="Teams" />
        </Tabs>
      </AppBar>

      {/* Content */}
      <Box mt={3}>
        {tabIndex === 0 && <TaskTab />}
        {tabIndex === 1 && <ProjectTab />}
        {tabIndex === 2 && <UserTab />}
        {tabIndex === 3 && <UserTab />}
      </Box>
    </>
  );
}
