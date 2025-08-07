"use client"
import { SendIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../contexts/socketContext';
import { useRouter } from 'next/navigation';

export default function Chat() {
    const [message, setMessage] = useState<string>("");
    const [messagesArray, setMessagesArray] = useState<{ userName: string, message: string }[]>([]);
    const [localUserName, setLocalUserName] = useState<string>("");
    const socket = useSocket();
    const router = useRouter();

    const handleMessageArrived = ({ userName, message }: { userName: string, message: string }) => {
        setMessagesArray(prev => [
            ...prev, {
                userName,
                message
            }
        ])
    }

    useEffect(() => {
        const userName = localStorage.getItem("userName");
        if (userName) {
            setLocalUserName(userName.trim());
        }
    }, [])


    useEffect(() => {
        if (socket) {
            socket.on("messageArrived", handleMessageArrived);
        }

        return () => {
            if (socket) {
                socket.off("messageArrived", handleMessageArrived);
            }
        }
    }, [socket])

    const sendMessage = (e: React.MouseEvent) => {
        e.preventDefault();

        if (socket) {
            socket.emit("message", { userName: localUserName, message });
            setMessage("");
        }
    }

    const handleLeaveRoom = (e: React.MouseEvent) => {
        e.preventDefault();

        router.push("/");
    }

    return (
        <>
            <section className='w-3/6 h-screen bg-white z-50 relative mx-auto py-4 px-8 flex flex-col shadow-md shadow-gray-400'>
                <h1 className='text-2xl font-semibold text-gray-600 mb-6'>
                    Your Messages
                </h1>

                <div className='flex-1 overflow-y-scroll px-4'>
                    {
                        messagesArray.map(({ userName, message }, index) => (
                            <div key={index} className={`${userName === localUserName ? "ml-auto bg-green-200" : "mr-auto bg-gray-200"} my-3 px-3 py-2 rounded-xl min-w-28 max-w-md w-fit break-words`}>
                                <p className='text-gray-600 text-[12px] font-semibold'> {userName} </p>
                                <p className='text-gray-700 text-[14px] font-semibold mt-1'> {message} </p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex justify-center items-center gap-4'>
                    <button className='bg-red-100 border-2 border-red-600 text-red-600 font-semibold px-8 py-2 rounded-md cursor-pointer' onClick={handleLeaveRoom}>
                        Leave
                    </button>

                    <div className="relative w-4/5 h-fit overflow-hidden mx-auto">
                        <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-4/5 rounded-full flex justify-center items-center cursor-pointer transition-all duration-200 ${message ? "rotate-0" : "rotate-45"}`} onClick={sendMessage}>
                            <SendIcon className={message ? "text-blue-600" : "text-gray-400"} />
                        </button>

                        <input
                            type="text" name='message' value={message}
                            className={`text-black bg-gray-100 placeholder:text-gray-600 border-gray-500 w-full h-12 pr-14 pl-6 outline-none border-2 py-2 rounded-full placeholder:font-medium`}
                            placeholder="Enter message here" onChange={e => setMessage(e.target.value)}
                        />
                    </div>
                </div>

            </section>
        </>
    )
}
