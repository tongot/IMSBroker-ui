"use client"; // ✅ Only this file becomes a Client Component

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationsProvider, } from "@toolpad/core/useNotifications";
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotificationsProvider>
          <DialogsProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </DialogsProvider>
        </NotificationsProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}
