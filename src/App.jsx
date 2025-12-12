import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AppRoutes />
      </ThemeProvider>
    </>
  );
}
