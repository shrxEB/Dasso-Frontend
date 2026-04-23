"use client"
import Dashboard1 from "@/components/Dashboard1"
import Sidebar from "@/components/Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const ChatPage = () => {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen bg-[#1E1E1E] text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white overflow-hidden">
      <Sidebar />
      <Dashboard1 />
    </div>
  )
}

export default ChatPage
