import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Box, CssBaseline } from "@mui/material";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={GeistSans.className}>
        <CssBaseline />
        <Navbar />
        <Box sx={{ mt: "80px" }}>
          <Component {...pageProps} />
        </Box>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
