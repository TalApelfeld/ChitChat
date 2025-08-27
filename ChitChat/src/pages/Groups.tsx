import { useContext, useEffect, useState } from "react";
import Contact from "../components/Contact";
import useGetChats, { type IChat } from "../hooks/useGetChats";
import { UserContext, type UserContextType } from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";
import GroupPreview from "../components/GroupPreview";
import { useOutletContext } from "react-router";

export interface IGroup {
  room_id: string;
  group_name: string;
  name1: string;
  name2?: string;
  name3?: string;
  name4?: string;
  name5?: string;
}

// const host =
//   location.hostname === "localhost" ? "localhost" : location.hostname;

// const urlDev = `http://${host}:3000/addGroup`;
const urlProd = "https://chitchat-znxw.onrender.com/addGroup";

export default function Groups() {
  const [showModal, setShowModal] = useState(false);
  const [contactsToAdd, setContactsToAdd] = useState<string[]>([]);
  const [inputGroupName, setInputGroupName] = useState("");
  const [groups, setGroups] = useState<IGroup[]>();
  const [inputSearch, setInputSearch] = useState("");

  const search = useOutletContext<boolean>();
  const { user } = useContext<UserContextType>(UserContext);
  const { chats } = useGetChats(user);

  async function createGroup() {
    try {
      setInputGroupName("");
      setShowModal(false);
      const res = await fetch(urlProd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: uuidv4(),
          groupName: inputGroupName,
          contacts: [...contactsToAdd, user],
        }),
      });

      const data = await res.json();
      window.location.reload();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getGroupsFromDB() {
    try {
      setInputGroupName("");
      setShowModal(false);
      const res = await fetch(urlProd, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user,
        }),
      });

      const data = await res.json();
      setGroups(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getGroupsFromDB();
  }, []);

  return (
    <div className="p-2">
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
      {groups?.length === 0 ? (
        <p className="text-center">No groups yet.</p>
      ) : (
        groups
          ?.filter((group: IGroup) => {
            const q = inputSearch.toLowerCase();
            return group.group_name.toLowerCase().includes(q);
          })
          .map((group: IGroup) => (
            <GroupPreview group={group} key={group.room_id} />
          ))
      )}

      {showModal && (
        <div
          className="fixed w-[90%] h-[80%] top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2
         bg-primary flex flex-col items-center gap-4 rounded-2xl p-6 overflow-scroll"
        >
          <h1 className="text-2xl text-white text-center">
            Enter the name of the group:
          </h1>
          <h2>{`(we allow up to 4 contacts)`}</h2>

          <input
            type="text"
            placeholder="Enter group name"
            className="w-[80%] h-[30px] bg-white rounded-[12px] p-6"
            value={inputGroupName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputGroupName(e.target.value)
            }
          />
          {chats.map((chat: IChat) => (
            <Contact
              name={user === chat.friend_name ? chat.name : chat.friend_name}
              setContactsToAdd={setContactsToAdd}
            />
          ))}

          <button
            className="px-6 py-4 bg-purple-200 rounded-2xl"
            onClick={createGroup}
          >
            Add group
          </button>
        </div>
      )}

      <button
        className="h-[36px] w-[36px] fixed bottom-[30px] right-[35px] p-8 rounded-3xl bg-primary btn-press
       active:bg-primary-active flex items-center justify-center border-[#44444E] border-[1px] text-white font-bold"
        onClick={() => {
          setShowModal(!showModal);
        }}
      >
        +
      </button>
    </div>
  );
}
