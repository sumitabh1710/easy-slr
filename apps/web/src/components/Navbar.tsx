// components/Navbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Tasks", href: "/tasks" },
  { label: "Projects", href: "/projects" },
  { label: "Users", href: "/users" },
  { label: "Teams", href: "/teams" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => signOut();

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        display: session ? "flex" : "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Task Manager
          </Typography>

          <Box display="flex" alignItems="center">
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                sx={{
                  mx: 1,
                  fontWeight: router.pathname === item.href ? "bold" : "normal",
                  borderBottom:
                    router.pathname === item.href
                      ? "2px solid white"
                      : "2px solid transparent",
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* Profile Dropdown */}
            {session?.user && (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                    <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }}>
                      {session.user.name?.[0] ?? "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    component={Link}
                    href="/profile"
                    onClick={handleMenuClose}
                  >
                    Profile Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
