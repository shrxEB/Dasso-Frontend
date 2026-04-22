"use client"
import Sidebar from "@/components/Sidebar"
import React from 'react'
import { useParams } from 'next/navigation'
import RoomChat from "@/components/RoomChat";


const RoomPage = () => {
    const params = useParams();
    const roomId = params.roomId as string;
  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white overflow-hidden">
        <Sidebar />
        {roomId && <RoomChat roomId={roomId} />}
      
    </div>
  )
}

export default RoomPage

