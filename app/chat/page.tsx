"use client"
import Dashboard from "@/components/Dashboard"
import Sidebar from "@/components/Sidebar"
import Dashboard1 from "@/components/Dashboard1"

const ChatPage = () => {
  return (
    <div className="flex h-screen
    bg-[#1E1E1E] text-white overflow-hidden">
      <Sidebar />
      <Dashboard1 />
    </div>
  )
}

export default ChatPage
