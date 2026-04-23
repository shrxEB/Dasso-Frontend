"use client"
import Sidebar from "@/components/Sidebar"
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import RoomChat from "@/components/RoomChat";
import { useSession } from "next-auth/react"

const RoomPage = () => {
    const params = useParams();
    const roomId = params.roomId as string;
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
            {roomId && <RoomChat roomId={roomId} />}
        </div>
    )
}

export default RoomPage

