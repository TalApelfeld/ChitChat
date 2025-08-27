import { NavLink } from "react-router";
import type { IGroup } from "../pages/Groups";

interface IGroupPreview {
  group: IGroup;
}

export default function GroupPreview({ group }: IGroupPreview) {
  return (
    <NavLink to={`/room/?room=${group.room_id}&&name=${group.group_name}`}>
      <div
        className={`w-[100%] h-[100px] grid grid-cols-[1fr_3fr_1fr] bg-white hover:bg-gray-300 rounded-2xl p-2`}
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
          <span className="font-medium">{group.group_name}</span>
          <span className="text-sm text-gray-400">
            Hey there, im a group of ChitChat
          </span>
        </div>
      </div>
    </NavLink>
  );
}
