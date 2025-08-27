import { useContext } from "react";
import { UserContext, type UserContextType } from "../contexts/UserContext";
import { NavLink } from "react-router";
import type { IChat } from "../hooks/useGetChats";

interface IChatPreviewProps {
  chat: IChat;
}

export default function ChatPreview({ chat }: IChatPreviewProps) {
  const { user } = useContext<UserContextType>(UserContext);
  return (
    <NavLink
      to={`/room/?room=${chat.room_id}&&name=${
        user === chat.friend_name ? chat.name : chat.friend_name
      }`}
    >
      <div className="w-[100%] h-[100px] grid grid-cols-[1fr_3fr_1fr] hover:bg-gray-300 active:bg-gray-400 rounded-2xl p-2 ">
        {/* img Col */}
        <div className="w-[100%] h-[100%] flex items-center justify-center">
          <img
            src="../assets/contactImg.png"
            alt="contact Image"
            width={60}
            className="rounded-full"
          />
        </div>

        {/* Name Col */}
        <div className="flex flex-col justify-center ml-2">
          <span className="font-medium">
            {user === chat.friend_name
              ? chat.name.replace(/^./, (c: string) => c.toUpperCase())
              : chat.friend_name.replace(/^./, (c: string) => c.toUpperCase())}
          </span>
          <span className="text-sm text-gray-400">Okay, let me check</span>
        </div>

        {/*Last message Time */}
        <div className="self-center text-end mb-4">
          <span>09:38</span>
        </div>
      </div>
    </NavLink>
  );
}
