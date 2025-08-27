import { useEffect, useState } from "react";


export interface IChat {
  friend_name: string;
  id: string;
  name: string;
  room_id: string;
}

const host =
  location.hostname === "localhost" ? "localhost" : location.hostname;

export default function useGetChats(user: string) {
  const [chats, setChats] = useState<IChat[]>([]);

  async function getChats() {
    try {
      const res = await fetch(`http://${host}:3000/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: user }),
      });

      const data = await res.json();
      setChats(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getChats();
  }, []);

  return { chats, setChats };
}
