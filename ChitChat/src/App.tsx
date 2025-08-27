import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import Groups from "./pages/Groups";
import Contacts from "./pages/Contacts";
import Conversation from "./pages/Conversation";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";

export default function App() {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) return user;
    else return "guest";
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="allChats" replace />} />

          <Route path="/allChats" element={<Home />} />
          <Route path="/Groups" element={<Groups />} />
          <Route path="/Contacts" element={<Contacts />} />
        </Route>

        <Route path={"/room"} element={<Conversation />} />
      </Routes>
    </UserContext.Provider>
  );
}
