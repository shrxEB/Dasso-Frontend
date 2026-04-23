"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { io,Socket } from "socket.io-client";

interface Message{
    id: string;
    content: string;
    createdat: string;
    userId: string;
    user?: {username: string};
}
const RoomChat = ({ roomId }: { roomId: string }) => {
  const { data: session } = useSession();
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  const token = (session?.user as any)?.backendToken;
  const currentUserId = (session?.user as any)?.id;
  const [messages, setMessages]= useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  //auto scroll to latest message
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);
  //fetch historical messages
  useEffect(() => {
    if(!token) return;
    const fetchMessages = async () => {
        try{
            const res = await fetch(`${BACKEND_URL}/message/${roomId}`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,           
                    }
                });
                const data = await res.json();
                if(Array.isArray(data)){
                  setMessages(data);
                }
        } catch(err) {
          console.error("error fetching messages",err);
        }
    };
    fetchMessages();
  },[roomId, token]);

  //Connect to websockets
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
      setSocket(newSocket);
      newSocket.on("connect", () => {
        newSocket.emit("join_room", roomId);
      });
      newSocket.on("receive_message",
        (message: Message) => {
          setMessages((prev) => [...prev, message]);
        }
      );
      return () => {
        newSocket.disconnect();
      };
  }, [roomId]);
  //send message to handler
  const sendMessage = () => {
    if(!newMessage.trim() || !socket || !currentUserId) return;
    socket.emit("send_message",{
      roomId,
      content: newMessage,
      userId: currentUserId,
    });
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
      {/* HEADER */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <h2 className="text-2xl font-semibold">Room Chat</h2>
        <p className="text-gray-400 text-sm">Send Message in real time</p>
      </div>
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg: Message) => {
          const isMe = msg.userId === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end": "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">
                {msg.user?.username || "Unknown"}
              </span>
              <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isMe ? "bg-indigo-600 text-white": "bg-[#2A2A2A] text-gray-100"}`}>
                {msg.content}

              </div>
            </div>
          );
        })}
        <div ref={messageEndRef}></div>
      </div>
      {/* Input box */}
      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex gap-3">
            <input
               type="text"
            className="flex-1 bg-[#242424] border border-[#2A2A2A] rounded-md px-4 py-3 focus:outline-none focus:border-indigo-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            />
            <button onClick={sendMessage} className="
            bg-indigo-600 hover:bg-indigo-700 transition-colors
            px-6 py-3 rounded-md font-medium">Send</button>

        </div>
      </div>
    </div>
  );
};

export default RoomChat;
