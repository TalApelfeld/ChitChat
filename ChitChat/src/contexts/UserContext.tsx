import { createContext } from "react";

export interface UserContextType {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType>({
  user: "guest",
  setUser: () => {},
});
