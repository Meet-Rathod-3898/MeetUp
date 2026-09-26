import { useCallback, useState, useRef, useEffect } from "react"
import { socket } from "../config/socket"

export const useChat = (roomId, user) => {
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const isChatOpenRef = useRef(isChatOpen)
  
  useEffect(() => {
    isChatOpenRef.current = isChatOpen
  }, [isChatOpen])

  useEffect(() => {
    if (!roomId) return

    const handleReceiveMessage = (data) => {
      // ✅ Handle payload whether backend sends `data` directly or `{ message: data }`
      const incomingMessage = data?.message || data;

      setMessages((prev) => [...prev, incomingMessage])

      if (!isChatOpenRef.current) {
        setUnreadCount((prev) => prev + 1)
      }
    }

    socket.on("receive-message", handleReceiveMessage)

    return () => {
      socket.off("receive-message", handleReceiveMessage)
    }
  }, [roomId])

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !user) return

      const message = {
        id: Date.now().toString(),
        text: text.trim(),
        senderName: user.name || user.fullName || "You",
        senderId: user.id,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // ✅ 1. Emit to Socket for remote participants
      socket.emit("send-message", { roomId, message })

      // ✅ 2. Instantly append to local state so sender sees their own message
      setMessages((prev) => [...prev, message])
    },
    [roomId, user]
  )

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) setUnreadCount(0)
      return !prev
    })
  }, [])

  return {
    messages,
    sendMessage,
    unreadCount,
    isChatOpen,
    toggleChat
  }
}