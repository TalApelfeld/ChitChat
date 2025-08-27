import type { Dispatch, SetStateAction } from "react";

interface INavButtonProps {
  name: string;
  index: number;
  paint: boolean;
  setCurrentNavPressedIndex: Dispatch<SetStateAction<number>>;
}

export default function NavButton({
  name,
  index,
  setCurrentNavPressedIndex,
  paint,
}: INavButtonProps) {
  return (
    <button
      className={`p-3 ${
        paint ? "bg-violet-500 text-white font-medium" : ""
      } rounded-3xl`}
      onClick={() => setCurrentNavPressedIndex(index)}
    >
      {name}
    </button>
  );
}
