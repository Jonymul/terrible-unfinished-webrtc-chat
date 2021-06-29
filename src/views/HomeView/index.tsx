import { FC } from "react";
import { Link } from "react-router-dom";

export const HomeView: FC = () => {
  return (
    <div>
      <Link to="/join-room">Join room</Link>
      <Link to="/create-room">Create room</Link>
    </div>
  );
};