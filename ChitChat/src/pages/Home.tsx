import { useContext, useEffect, useState } from "react";
import ChatPreview from "../components/ChatPreview";
import { v4 as uuidv4 } from "uuid";
import { UserContext, type UserContextType } from "../contexts/UserContext";
import { NavLink, useOutletContext } from "react-router";
import type { IChat } from "../hooks/useGetChats";
import useGetChats from "../hooks/useGetChats";

// const host =
//   location.hostname === "localhost" ? "localhost" : location.hostname;

// const urlDev = `http://${host}:3000/rooms`;
const urlProd = "https://chitchat-znxw.onrender.com/rooms";

export default function Home() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [showModalUserName, setShowModalUserName] = useState(false);
  const [inputUserName, setInputUserName] = useState("");
  const [inputFriendName, setInputFriendName] = useState("");
  const [inputSearch, setInputSearch] = useState("");

  const { user, setUser } = useContext<UserContextType>(UserContext);
  const search = useOutletContext<boolean>();
  const { chats } = useGetChats(user);
  const room = uuidv4();

  useEffect(() => {
    if (user === "guest") {
      setShowModalUserName(true);
    }
  }, []);

  function handleUserName() {
    localStorage.setItem("user", inputUserName);
    setUser(inputUserName);
    setShowModalUserName(false);
    window.location.reload();
  }

  async function createRoomInDB() {
    try {
      const res = await fetch(urlProd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room, name: user, friend: inputFriendName }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-2 ">
      {/* Search bar */}
      {search && (
        <input
          type="text"
          placeholder="Search"
          className="fixed top-[73px] left-[50%] -translate-x-1/2 w-[80%] bg-white border-[1px] border-primary rounded-2xl p-3"
          value={inputSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputSearch(e.target.value);
          }}
        ></input>
      )}
      {chats.length === 0 ? (
        <p className="text-center mt-4">There isn't chats yet</p>
      ) : (
        chats
          .filter((chat: IChat) => {
            const q = inputSearch.toLowerCase();
            const name =
              user === chat.friend_name ? chat.name : chat.friend_name;
            return name.toLowerCase().includes(q);
          })
          .map((chat: IChat) => <ChatPreview chat={chat} key={chat.id} />)
      )}

      <button
        className="h-[36px] w-[36px] fixed bottom-[30px] right-[35px] p-8 rounded-full bg-primary btn-press active:bg-primary-active
        flex items-center justify-center border-[#44444E] border-[1px] text-white font-bold"
        onClick={() => {
          setShowAddContact(!showAddContact);
        }}
      >
        +
      </button>

      {/* Modal */}
      {showAddContact && (
        <div
          className="fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 z-10 w-[350px] 
         bg-violet-500 flex flex-col items-center gap-4 text-center rounded-2xl p-4"
        >
          <h1 className="text-white text-2xl">
            Enter your friend's name below
          </h1>

          <input
            placeholder="Enter your friend's name"
            type="text"
            className="w-[70%] h-[50px] bg-white rounded-3xl  text-center"
            value={inputFriendName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputFriendName(e.target.value);
            }}
          />

          {/* <div className="bg-blue-400 mb-4">{` http://localhost:5173/room?room=${room}&name=${user}`}</div>
          <div className="bg-blue-400">{` http://10.0.0.10:5173/room?room=${room}&&name=${user}`}</div> */}

          <NavLink
            to={`/room?room=${room}&name=${inputFriendName}`}
            className="px-4 py-4 bg-amber-100 rounded-[10px]"
            onClick={createRoomInDB}
          >
            Move me to chat
          </NavLink>
        </div>
      )}

      {showModalUserName && (
        <div
          className="fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 z-10 w-[350px] h-[300px] bg-violet-500 
        flex flex-col items-center gap-3 text-center rounded-2xl p-4"
        >
          <h1 className="text-white text-2xl">Please Enter your name below</h1>
          <h2>{`(it will be your unique identifier 
          and just so we can display it nicely (:   )`}</h2>
          <input
            placeholder="Enter your name"
            type="text"
            className="w-[70%] h-[50px] bg-white rounded-3xl  text-center"
            value={inputUserName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setInputUserName(e.target.value);
            }}
          />
          <button
            className="px-6 py-4 bg-gray-300 rounded-2xl"
            onClick={handleUserName}
          >
            Thats my name (:
          </button>
        </div>
      )}
    </div>
  );
}
