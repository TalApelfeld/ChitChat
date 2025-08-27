import { useContext, useState } from "react";
import useGetChats, { type IChat } from "../hooks/useGetChats";
import { UserContext, type UserContextType } from "../contexts/UserContext";
import Contact from "../components/Contact";
import { v4 as uuidv4 } from "uuid";
import { useOutletContext } from "react-router";

// const host =
//   location.hostname === "localhost" ? "localhost" : location.hostname;

// const urlDev = `http://${host}:3000/rooms`;
const urlProd = "https://chitchat-znxw.onrender.com/rooms";

export default function Contacts() {
  const [showModal, setShowModal] = useState(false);
  const [inputContactName, setInputContactName] = useState("");
  const [inputSearch, setInputSearch] = useState("");

  const search = useOutletContext<boolean>();
  const { user } = useContext<UserContextType>(UserContext);
  const { chats } = useGetChats(user);

  async function createRoomInDB() {
    try {
      const res = await fetch(urlProd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: uuidv4(),
          name: user,
          friend: inputContactName,
        }),
      });
      const data = await res.json();
      setInputContactName("");
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-4">
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
      {chats ? (
        chats
          .filter((chat: IChat) => {
            const q = inputSearch.toLowerCase();
            const name =
              user === chat.friend_name ? chat.name : chat.friend_name;
            return name.toLowerCase().includes(q);
          })
          .map((chat: IChat) => (
            <Contact
              key={chat.id}
              name={user === chat.friend_name ? chat.name : chat.friend_name}
            />
          ))
      ) : (
        <p>No contacts yes. Start adding</p>
      )}

      {showModal && (
        <div
          className="fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 z-10 w-[350px] 
         bg-primary  flex flex-col items-center gap-4 text-center rounded-2xl p-4"
        >
          <h1 className="text-2xl text-white ">Enter the name of contact:</h1>

          <input
            type="text"
            placeholder="Enter contact name"
            className="w-[80%] h-[30px] bg-white rounded-[12px] p-6"
            value={inputContactName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputContactName(e.target.value)
            }
          />

          <button
            className="px-6 py-4 bg-purple-300 rounded-2xl"
            onClick={createRoomInDB}
          >
            Add contact
          </button>
        </div>
      )}

      <button
        className="h-[36px] w-[36px] fixed bottom-[30px] right-[35px] p-8 rounded-[10px] bg-primary
       active:bg-primary-active btn-press flex items-center justify-center border-[#44444E] border-[1px] text-white font-bold"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        +
      </button>
    </div>
  );
}
