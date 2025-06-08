/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import TaskTab from "~/components/tabs/Task/TaskTab";
import ProjectTab from "~/components/tabs/Project/ProjectTab";
import UserTab from "~/components/tabs/User/UserTab";
import TeamsTab from "~/components/tabs/Team/TeamsTab";

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
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                color: "#000",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#fff",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#fff",
              },
            }}
          >
            <Tab label="Tasks" />
            <Tab label="Projects" />
            <Tab label="Users" />
            <Tab label="Teams" />
          </Tabs>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>
              {session?.user?.name ?? session?.user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box mt={3}>
        {tabIndex === 0 && <TaskTab />}
        {tabIndex === 1 && <ProjectTab />}
        {tabIndex === 2 && <UserTab />}
        {tabIndex === 3 && <TeamsTab />}
      </Box>
    </>
  );
}
