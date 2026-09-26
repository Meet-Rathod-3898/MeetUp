import React, { useEffect, useState, useRef } from 'react'
import { SendIcon, XIcon } from 'lucide-react'

const ChatPanel = ({ isChatOpen, onClose, messages = [], onSendMessage, currentUser }) => {
    const [text, setText] = useState("")
    const messageEndRef = useRef(null)

    useEffect(() => {
        if (isChatOpen) {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isChatOpen])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText("")
        }
    }

    if (!isChatOpen) return null;

    return (
        <aside className='w-full sm:w-80 h-full bg-white border-l border-slate-200 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-200'>
            {/* HEADER */}
            <div className='p-4 border-b border-slate-200 flex items-center justify-between'>
                <h3 className='font-medium text-slate-900 text-base flex items-center'>
                    In-Meeting Chat
                </h3>
                <button 
                    onClick={onClose}
                    className='p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer'
                >
                    <XIcon className='h-5 w-5'/>
                </button>
            </div>

            {/* Messages Container */}
            <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                {messages.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center text-center text-slate-400 text-sm'>
                        <p>No Messages Yet.</p>
                        <p className='text-xs mt-1 text-slate-400'>Send A Message To Start Chatting With Participants!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div className='flex items-center gap-2 mb-1'>
                                    <span className='text-xs font-semibold text-slate-500'>{isMe ? "You" : msg.senderName}</span>
                                    <span className='text-[10px] text-slate-400'>{msg.time}</span>
                                </div>
                                <div className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-xs ${
                                    isMe
                                        ? "bg-blue-600 text-white rounded-tr-none font-medium"
                                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 font-medium"
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messageEndRef}></div>
            </div>

            {/* Send Form */}
            <form onSubmit={handleSubmit} className='p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2'>
                <input 
                    type="text"
                    placeholder='Type A Message....'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='flex-1 bg-white border border-slate-200 focus:border-blue-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs' 
                />
                <button 
                    type='submit'
                    disabled={!text.trim()}
                    className='p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-all cursor-pointer shadow-xs'
                >
                    <SendIcon className='w-4 h-4'/>
                </button>
            </form>
        </aside>
    )
}

export default ChatPanel