import { useState } from "react";

interface IContactProps {
  name: string;
  setContactsToAdd?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Contact({ name, setContactsToAdd }: IContactProps) {
  const [bgColor, setBgColor] = useState<string>("bg-white");

  return (
    <div
      className={`w-[100%] h-[100px] grid grid-cols-[1fr_3fr_1fr] ${bgColor} ${
        setContactsToAdd ? "" : "hover:bg-gray-300"
      }  rounded-2xl p-2`}
      onClick={() =>
        setContactsToAdd
          ? setContactsToAdd((prev) => {
              if (prev.includes(name)) {
                setBgColor("bg-white");
                return prev.filter((item: string) => item !== name);
              } else {
                setBgColor("bg-[#c599f4]");
                return [...prev, name];
              }
            })
          : ""
      }
    >
      {/* img Col */}
      <div className="w-[100%] h-[100%] flex items-center justify-center">
        <img
          src="/contactImg.png"
          alt="contact Image"
          width={60}
          className="rounded-full"
        />
      </div>

      {/* Name Col */}
      <div className="flex flex-col justify-center ml-2">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-gray-400">
          Hey there, im using ChitChat
        </span>
      </div>
    </div>
  );
}
