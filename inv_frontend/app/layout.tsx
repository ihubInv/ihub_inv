"use client"; // 👈 Keep this to allow useState/useEffect

import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-config";
// import { AppProvider } from "@/lib/context/app-context";
// import { UserProvider } from "@/lib/context/user-context";
import { Notifications } from "@/components/ui/notifications";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store ,{ persistor }from "../lib/store/index";
import { AppProvider } from "@/lib/context/use-toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
         <AppProvider>
          {/* <UserProvider>  */}
            <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider defaultTheme="dark" storageKey="ihub-theme">
              <Notifications />
              {children}
            </ThemeProvider>
          
            </PersistGate>
            </Provider>
           {/* </UserProvider> */}
        </AppProvider> 
      </body>
    </html>
  );
}
