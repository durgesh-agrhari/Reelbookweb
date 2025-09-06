import React, { createContext, useState } from "react";

// 1️⃣ Create context
export const AppContext = createContext();

// 2️⃣ Create provider component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Example state
  const [theme, setTheme] = useState("light");

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};
