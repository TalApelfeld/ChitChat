import { useContext, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router";
import { socket } from "../socket/socket";
import { UserContext, type UserContextType } from "../contexts/UserContext";

interface IMessage {
  message: string;
  name: string;
}

// const host =
//   location.hostname === "localhost" ? "localhost" : location.hostname;

export default function Conversation() {
  //   const { roomParam } = useParams();
  const [searchParams] = useSearchParams();
  const room = searchParams.get("room");
  const name = searchParams.get("name");
  const { user } = useContext<UserContextType>(UserContext);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  function getMessagesFromDB() {
    socket.emit("client:getMessages", room);
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log(`connected to socket in 'Conversation' on room: ${room}
        between [Current User]${user} and ${name}
        `);
    });

    socket.emit("room:join", room);

    getMessagesFromDB();

    socket.on("server:messages:sent", (msg) => {
      console.log(msg);
      setMessages(msg);
    });

    return () => {
      socket.emit("room:leave", room);
      socket.disconnect();
    };
  }, []);

  function handleSendMessage() {
    if (inputMessage.length === 0) return;
    socket.emit("client:message:sent", {
      message: inputMessage,
      name: user,
      room,
    });
    setInputMessage("");
  }

  return (
    <div className="h-screen bg-primary">
      <header className="h-[10vh]">
        {/*header left contianer - Name, Img , Online */}
        <div className="fixed top-0 w-[250px] h-[70px]  flex items-center">
          {/* Return Btn */}
          <NavLink to={"/allChats"}>
            <div className="p-3 bg to-blue-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width={32}
                height={32}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
            </div>
          </NavLink>

          {/* Img */}
          <div className="h-[100%] flex items-center justify-center pr-2">
            <img
              src="/contactImg.png"
              alt="contact Image"
              width={40}
              className="rounded-full"
            />
          </div>

          {/* name */}
          <div className="flex flex-col">
            <span className=" text-white font-bold">{name}</span>
            <span className="text-sm text-gray-300">Online</span>
          </div>
        </div>

        {/* Top RIGHT White background */}
        <div
          className=" fixed right-0 w-[170px] h-[70px] bg-white shadow-lg
                    [--r:40px]                           /* bottom-left fold radius */
                    [--rx:160px] [--ry:65px]            /* top-left: much more stretched inward curve */
                    [--br:1px]                          /* very pointy bottom-right corner */
                    [--_m:#0000_100%,#000_calc(100%_+_1px)]
                    [padding:16px]
                    [border-radius:0_0_var(--br)_calc(2*var(--r))]  /* sharp top-right, very pointy bottom-right */
                    
                    /* masks: 1) content box, 2) TOP-LEFT inward curve, 3) BOTTOM-LEFT fold */
                    [mask:conic-gradient(#000_0_0)_content-box,
                          radial-gradient(var(--rx)_var(--ry)_at_0_0,var(--_m))_0_0_no-repeat,
                          radial-gradient(var(--r)_at_0_100%,var(--_m))_0_100%_no-repeat]
                    
                    [mask-size:100%_100%,var(--rx)_var(--ry),var(--r)_var(--r)]"
        />
        {/* icons container */}
        <div className="fixed z-10 top-0 right-[10px] w-[120px] h-[70px]  rounded-2xl flex items-center justify-center gap-3">
          {/* Phone */}
          <div
            className="h-[50px] w-[50px] p-2  flex items-center justify-center border-[1px]
           border-black rounded-full btn-press active:bg-gray-300"
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
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
          </div>

          {/* Camera */}
          <div
            className="h-[50px] w-[50px] p-2  flex items-center justify-center border-[1px]
           border-black rounded-full btn-press active:bg-gray-300"
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
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/*Chat body*/}
      <div className="fixed top-[80px] left-[50%] -translate-x-1/2 w-[100%] h-[75%] flex flex-col items-start gap-4 p-4">
        {messages.map((msg: IMessage, index: number) => {
          if (msg.name === user) {
            return (
              <span
                className={`max-w-[300px] bg-chat-message rounded-bl-2xl rounded-br-2xl rounded-tr-2xl 
            inline-flex items-center justify-center p-3 text-white `}
                key={index}
              >
                {msg.message}
              </span>
            );
          } else {
            return (
              <span
                className={`max-w-[300px] self-end bg-white rounded-bl-2xl rounded-br-2xl rounded-tl-2xl 
            inline-flex items-center justify-center p-3 `}
                key={index}
              >
                {msg.message}
              </span>
            );
          }
        })}
      </div>

      {/* Input Container */}
      <div className="fixed bottom-[20px] left-[50%] -translate-x-1/2 w-[90%] h-[80px]  flex items-center justify-center gap-2">
        {/* Input */}
        <input
          placeholder="Enter message"
          type="text"
          className="p-3 bg-white rounded-3xl pl-6"
          value={inputMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputMessage(e.target.value);
          }}
        />

        {/* Send button */}
        <div
          className="w-[45px] h-[45px] p-3 bg-white rounded-full btn-press active:bg-gray-300"
          onClick={handleSendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#963df5"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            width={24}
            height={24}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
