"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatCard from "./StatCard";
import RoomCard from "./RoomCard";

const Dashboard1 = () => {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roomName, setRoomName] = useState("");
  const token = (session?.user as any)?.backendToken;
  //Fetch message
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:3001/room", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("API did not return an array:", data);
        setRooms([]);
      }
    } catch (err) {
      console.error("Error fetching rooms", err);
    }
  };
  useEffect(() => {
    if (token) {
      fetchRooms();
    }
  }, [token]);
  //FILTER
  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()),
  );
  //CREATE ROOM
  const createRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const res = await fetch("http://localhost:3001/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });
      const newRoom = await res.json();
      
      if (!res.ok) {
        console.error("Backend error creating room:", newRoom);
        alert(newRoom.message || "Failed to create room");
        return;
      }

      setRooms((prev) => [newRoom, ...prev]);
      setRoomName("");
      window.location.href = `/room/${newRoom.id}`;
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };
  return (
    <div
      className="flex-1 p-4 md:p-6
    overflow-y-auto"
    >
      {/*HEADER*/}
      <div className="mb-6">
        <h1
          className="text-2xl md:text-3xl
            font-semibold"
        >
          Agya Gandu!!
        </h1>
        <p className="text-gray-400 text-sm">Start chatting in your rooms</p>
      </div>
      {/*STATS*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total rooms" value={rooms.length} />
        <StatCard title="Active chats" value={rooms.length} />
        <StatCard title="Messages" value="--" />
      </div>
      {/* SEARCH & CREATE */}
      <div
        className="flex flex-col md:flex-row
        gap-3 mb-6"
      >
        <input
          className="bg-[#242424] border
              border-[#2A2A2A] rounded-md px-4
              py-2 w-full md:w-[400px]"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="bg-[#242424] border border-[#2A2A2A] rounded-md px-4 py-2 w-full md:w-[250px]"
          placeholder="Enter room name..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          onClick={createRoom}
          className="bg-indigo-600 px-4
              py-2 rounded-md"
        >
          +Create Room
        </button>
      </div>
      {/* ROOMS */}
      <div>
        <h2 className="text-lg md:text-xl mb-4">Browse rooms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
