"use client"
import { useRouter } from "next/navigation"

const RoomCard = ({room}:any) => {
    const router = useRouter();
  return (
    <div className="bg-[#242424] rounded-xl
    p-4 border border-[#2A2A2A] flex flex-col
    justify-between">
        <div>
            <h3 className="text-lg font-medium"># {room.name}</h3>
            <p className="text-sm text-gray-400">
                Public Chat Room
            </p>
        </div>
        <button
           onClick={() => router.push(`/room/${room.id}`)}
           className="mt-4 bg-indigo-600 hover:bg-indigo-700
           transition rounded-md py-2"
        >
            Enter a room

        </button>
      
    </div>
  )
}

export default RoomCard
