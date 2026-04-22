"use client";

import StatCard from "./StatCard";
import RoomCard from "./RoomCard";

const Dashboard = () => {
  return (
    <div
      className="flex-1 p-4 md:p-6
     overflow-y-auto"
    >
      {/*Header*/}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl
            font-semibold"
        >
          Agya Gandu!!
        </h1>
        <p className="text-gray-400 text-sm">Start chatting in your rooms</p>
      </div>
      {/*Stats*/}
      <div
        className="grid grid-cols-1
        sm:grid-cols-2 lg:grid-cols-3
        gap-4 mb-8"
      >
        <StatCard title="Rooms joined" value="3" />
        <StatCard title="Online now" value="8" />
        <StatCard title="Unread" value="14" />
      </div>
      {/*Rooms*/}
      <div>
        <h2 className="text-lg md:text-xl mb-4">Browse rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <RoomCard name="# general" desc="Team chat" />
          <RoomCard name="# design" desc="UI feedback" />
          <RoomCard name="# random" desc="Anything goes" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
