import { NavLink, Outlet } from "react-router";
import { useContext, useState } from "react";
import { UserContext, type UserContextType } from "../contexts/UserContext";

const TABS = [
  { label: "All Chats", to: "/allChats" },
  { label: "Groups", to: "/Groups" },
  { label: "Contacts", to: "/Contacts" },
];

export default function Layout() {
  const [search, setSearch] = useState(false);
  const { user } = useContext<UserContextType>(UserContext);

  return (
    <div className="h-screen bg-[#F6F6F6] font-chat">
      {/* Header */}
      <header>
        <div className="flex justify-between">
          {/* Name */}
          <h1 className="p-3">
            <span className="text-gray-400 block">Hello,</span>
            <span className="font-bold ml-2 text-2xl">
              {user.replace(/^./, (c) => c.toUpperCase())}
            </span>
          </h1>
          {/* Icons */}
          <div className="flex items-center justify-center gap-2 p-2">
            {/* magnifying glass ICON */}
            <div
              className="  w-[42px] h-[42px] flex items-center justify-center p-2 border-[1px]
                         border-black rounded-full active:bg-gray-300 active:border-primary-active btn-press"
              onClick={() => {
                setSearch(!search);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#963df5"
                width={24}
                height={24}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>

            {/* ellipsis-vertical ICON */}
            <div
              className="w-[42px] h-[42px]  flex items-center justify-center p-2 border-[1px]
                       border-black rounded-full  active:bg-gray-300 active:border-primary-active btn-press"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#963df5"
                width={32}
                height={32}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/*NEW Navigation */}
      <div className="w-[80%] h-[50px] mx-auto bg-gray-300 rounded-3xl grid grid-cols-3 p-1 gap-1">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              [
                "rounded-3xl flex items-center justify-center text-sm transition",
                isActive
                  ? "bg-primary active:bg-primary-active shadow font-semibold text-white btn-press"
                  : "hover:bg-gray-200",
              ].join(" ")
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Content */}
      <Outlet context={search} />
    </div>
  );
}
