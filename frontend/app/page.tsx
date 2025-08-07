"use client"
import { useEffect, useState } from "react";
import { useSocket } from "./contexts/socketContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const socket = useSocket();
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  const handleUserJoinedRoom = ({ userName }: { userName: string }) => {
    router.push("/chat");
  }

  useEffect(() => {
    if (socket) {
      socket.on("user-joined-room", handleUserJoinedRoom);
    }

    return () => {
      if (socket) {
        socket.off("user-joined-room", handleUserJoinedRoom);
      }
    }
  }, [socket])

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("userName", userName);

    if (!userName) {
      alert("Enter username first!");
    }

    if (socket && userName) {
      socket.emit("join-room", { userName });
    }

  }

  return (
    <>
      <section className="relative z-50 flex justify-center items-center w-screen h-screen">

        {/* Join Chat */}
        <form className="bg-white shadow-2xl shadow-gray-400 w-96 h-fit px-8 py-8 rounded-2xl" onSubmit={handleJoinRoom}>

          <div className="flex flex-col justify-center items-center gap-2 mb-4">
            <h1 className="text-center text-gray-700 font-semibold text-3xl">
              Let's Chat
            </h1>

            <p className="text-center font-medium text-sm text-gray-600">
              Enter username to join chat room
            </p>
          </div>

          <fieldset className="flex flex-col justify-center items-center gap-10">
            <input type="text" name="username" value={userName} onChange={e => setUserName(e.target.value)} className="h-12 mt-2 px-3 w-full border-2 border-gray-400 rounded-md outline-none" placeholder="Enter username" />

            <input type="submit" value="Join" className="bg-blue-500 hover:bg-blue-600 cursor-pointer px-10 py-2 w-full font-semibold text-white rounded-md" />
          </fieldset>
        </form>

      </section>
    </>
  );
}
