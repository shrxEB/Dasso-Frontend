"use client"
import { signOut } from "next-auth/react"

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64
    bg-[#181818] border-r border-[#2A2A2A]
    p-4 flex-col">
        <h1 className="text-xl font-semibold mb-6">DASSO</h1>
        <div className="space-y-2 text-sm">
            <div className="bg-[#242424] p-2
            rounded-md">Browse rooms</div>
            <div className="p-2 hover:bg-[#242424]
            rounded-md">My rooms</div>
            <div className="p-2 hover:bg-[#242424]
            rounded-md">Profile</div>
        </div>
        <div className="mt-6 text-xs text-gray-400">My Rooms</div>
        <div className="mt-2 space-y-2 text-sm">
            <div className="p-2 hover:bg-[#242424] rounded-md">#general</div>
            <div className="p-2 hover:bg-[#242424] rounded-md">#design</div>
            <div className="p-2 hover:bg-[#242424] rounded-md">#random</div>
        </div>
        <div className="mt-auto">
            <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left p-2 hover:bg-[#242424] text-red-400 rounded-md transition-colors"
            >
                Logout
            </button>
        </div>
    </div>
  )
}

export default Sidebar
