"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send, MoreVertical, Phone, Video, ArrowLeft, ImageIcon } from "lucide-react"
import ImageModal from "@/components/image-modal"
import ImagePreview from "@/components/image-preview"
import { useWebSocket, WebSocketMessage } from "@/lib/websocket"
import { config } from "@/lib/config"

interface Message {
  id: number
  user: string
  avatar: string
  message?: string
  imageUrl?: string
  time: string
  isMe: boolean
  type: "text" | "image"
}

interface ChatInterfaceProps {
  currentUser: string
  chatRoomName: string
  chatRoomId: string
  onBack: () => void
}

export default function ChatInterface({ currentUser, chatRoomName, chatRoomId, onBack }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")
  const [modalImageAlt, setModalImageAlt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])

  // WebSocket 연결
  const { sendMessage, lastMessage, isConnected } = useWebSocket(`${config.wsUrl}`, chatRoomId)

  // WebSocket 메시지 수신 처리
  useEffect(() => {
    if (lastMessage) {
      // 자신이 보낸 메시지는 이미 UI에 표시되어 있으므로 무시
      if (lastMessage.sender === currentUser) {
        return;
      }

      const now = new Date()
      const timeString = `오후 ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
      
      const newMsg: Message = {
        id: Date.now(), // 고유한 ID 생성
        user: lastMessage.sender,
        avatar: "/placeholder.svg?height=40&width=40",
        message: lastMessage.content,
        time: timeString,
        isMe: lastMessage.sender === currentUser,
        type: "text",
      }
      
      setMessages(prev => [...prev, newMsg])
    }
  }, [lastMessage, currentUser]) // messages.length 제거

  // 채팅방이 변경될 때마다 메시지 초기화
  useEffect(() => {
    setMessages([])
  }, [chatRoomId]) // chatRoomName 대신 chatRoomId 사용

  // 새 메시지가 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
  }

  const handleImageClick = (imageUrl: string, alt: string) => {
    setModalImageUrl(imageUrl)
    setModalImageAlt(alt)
    setImageModalOpen(true)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date()
    const timeString = `오후 ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

    if (selectedImage) {
      // 이미지 메시지 전송
      const imageUrl = URL.createObjectURL(selectedImage)
      const message: Message = {
        id: Date.now(), // 고유한 ID 생성
        user: currentUser,
        avatar: "/placeholder.svg?height=40&width=40",
        imageUrl,
        time: timeString,
        isMe: true,
        type: "image",
      }
      setMessages(prev => [...prev, message])
      setSelectedImage(null)
    } else if (newMessage.trim()) {
      // 텍스트 메시지 전송
      const wsMessage: WebSocketMessage = {
        type: "CHAT",
        sender: currentUser,
        content: newMessage,
        timestamp: new Date().toISOString(),
      }
      
      // 메시지를 먼저 UI에 표시
      const message: Message = {
        id: Date.now(), // 고유한 ID 생성
        user: currentUser,
        avatar: "/placeholder.svg?height=40&width=40",
        message: newMessage,
        time: timeString,
        isMe: true,
        type: "text",
      }
      setMessages(prev => [...prev, message])
      
      // WebSocket으로 메시지 전송
      sendMessage(wsMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={chatRoomName} />
              <AvatarFallback>{chatRoomName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{chatRoomName}</h2>
              <p className="text-sm text-muted-foreground">{isConnected ? "온라인" : "오프라인"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.isMe ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            {/* <Avatar className="w-8 h-8">
              <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.user} />
              <AvatarFallback>{message.isMe ? currentUser[0]?.toUpperCase() : message.user[0]}</AvatarFallback>
            </Avatar> */}
            <div
              className={`flex flex-col space-y-1 max-w-xs lg:max-w-md ${message.isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl ${message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {message.type === "text" ? (
                  <p className="text-sm">{message.message}</p>
                ) : (
                  <img
                    src={message.imageUrl || "/placeholder.svg"}
                    alt="Shared image"
                    className="max-w-xs max-h-60 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(message.imageUrl!, "Shared image")}
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{message.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="p-4">
          {selectedImage && (
            <div className="mb-3">
              <ImagePreview file={selectedImage} onRemove={handleRemoveImage} />
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder="메시지를 입력하세요..."
              className="flex-1"
              autoComplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!!selectedImage || !isConnected}
            />
            <Button type="submit" size="icon" disabled={(!newMessage.trim() && !selectedImage) || !isConnected}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
          <ImageModal
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            imageUrl={modalImageUrl}
            alt={modalImageAlt}
          />
        </CardContent>
      </Card>
    </div>
  )
}
