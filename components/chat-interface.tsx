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
  chatId: string
  onBack: () => void
}

export default function ChatInterface({ currentUser, chatId, onBack }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState("")
  const [modalImageAlt, setModalImageAlt] = useState("")

  // 채팅방 ID에 따라 다른 대화 상대와 메시지 표시
  const chatData: Record<string, { contact: string; messages: Message[] }> = {
    chat1: {
      contact: "Alice",
      messages: [
        {
          id: 1,
          user: "Alice",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "안녕하세요! 오늘 회의 준비는 어떻게 되고 있나요?",
          time: "오후 2:30",
          isMe: false,
          type: "text",
        },
        {
          id: 2,
          user: currentUser,
          avatar: "/placeholder.svg?height=40&width=40",
          message: "네, 거의 다 준비됐어요. 자료 정리만 조금 더 하면 될 것 같습니다.",
          time: "오후 2:32",
          isMe: true,
          type: "text",
        },
        {
          id: 3,
          user: "Alice",
          avatar: "/placeholder.svg?height=40&width=40",
          imageUrl: "/placeholder.svg?height=300&width=400",
          time: "오후 2:33",
          isMe: false,
          type: "image",
        },
        {
          id: 4,
          user: "Alice",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "좋네요! 혹시 프레젠테이션 슬라이드도 확인해보셨나요?",
          time: "오후 2:33",
          isMe: false,
          type: "text",
        },
        {
          id: 5,
          user: currentUser,
          avatar: "/placeholder.svg?height=40&width=40",
          message: "네, 어제 검토했습니다. 몇 가지 수정사항이 있어서 오늘 오전에 업데이트했어요.",
          time: "오후 2:35",
          isMe: true,
          type: "text",
        },
        {
          id: 6,
          user: "Alice",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "완벽하네요! 그럼 3시에 회의실에서 뵙겠습니다. 😊",
          time: "오후 2:36",
          isMe: false,
          type: "text",
        },
      ],
    },
    chat2: {
      contact: "Bob",
      messages: [
        {
          id: 1,
          user: "Bob",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "안녕하세요, 프로젝트 진행 상황이 어떻게 되나요?",
          time: "오전 10:15",
          isMe: false,
          type: "text",
        },
        {
          id: 2,
          user: currentUser,
          avatar: "/placeholder.svg?height=40&width=40",
          message: "현재 70% 정도 완료되었습니다. 이번 주 내로 초안을 보내드릴게요.",
          time: "오전 10:30",
          isMe: true,
          type: "text",
        },
        {
          id: 3,
          user: "Bob",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "좋습니다. 프로젝트 마감일이 언제였죠?",
          time: "오전 11:20",
          isMe: false,
          type: "text",
        },
      ],
    },
    chat3: {
      contact: "Charlie",
      messages: [
        {
          id: 1,
          user: "Charlie",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "다음 주 일정 확인해 주세요.",
          time: "어제",
          isMe: false,
          type: "text",
        },
        {
          id: 2,
          user: currentUser,
          avatar: "/placeholder.svg?height=40&width=40",
          message: "네, 확인했습니다. 화요일 오후에 미팅 가능합니다.",
          time: "어제",
          isMe: true,
          type: "text",
        },
        {
          id: 3,
          user: "Charlie",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "주말에 팀 회식 어떠세요?",
          time: "어제",
          isMe: false,
          type: "text",
        },
      ],
    },
    chat4: {
      contact: "Diana",
      messages: [
        {
          id: 1,
          user: "Diana",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "발표 자료 검토 부탁드립니다.",
          time: "어제",
          isMe: false,
          type: "text",
        },
      ],
    },
    chat5: {
      contact: "Edward",
      messages: [
        {
          id: 1,
          user: "Edward",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "새 기능 개발 일정 공유해 주세요.",
          time: "월요일",
          isMe: false,
          type: "text",
        },
      ],
    },
    chat6: {
      contact: "팀 프로젝트",
      messages: [
        {
          id: 1,
          user: "Alice",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "다들 주간 보고서 작성하셨나요?",
          time: "월요일",
          isMe: false,
          type: "text",
        },
        {
          id: 2,
          user: "Bob",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "네, 제출했습니다.",
          time: "월요일",
          isMe: false,
          type: "text",
        },
        {
          id: 3,
          user: "Charlie",
          avatar: "/placeholder.svg?height=40&width=40",
          message: "다음 회의는 금요일 오후 2시입니다.",
          time: "월요일",
          isMe: false,
          type: "text",
        },
      ],
    },
  }

  const currentChat = chatData[chatId] || { contact: "Unknown", messages: [] }
  const [messages, setMessages] = useState<Message[]>(currentChat.messages)

  // 채팅방이 변경될 때마다 메시지 업데이트
  useEffect(() => {
    if (chatData[chatId]) {
      setMessages(chatData[chatId].messages)
    }
  }, [chatId])

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
      // Send image message
      const imageUrl = URL.createObjectURL(selectedImage)
      const message: Message = {
        id: messages.length + 1,
        user: currentUser,
        avatar: "/placeholder.svg?height=40&width=40",
        imageUrl,
        time: timeString,
        isMe: true,
        type: "image",
      }
      setMessages((prev) => [...prev, message])
      setSelectedImage(null)
    } else if (newMessage.trim()) {
      // Send text message
      const message: Message = {
        id: messages.length + 1,
        user: currentUser,
        avatar: "/placeholder.svg?height=40&width=40",
        message: newMessage,
        time: timeString,
        isMe: true,
        type: "text",
      }
      setMessages((prev) => [...prev, message])
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
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt={currentChat.contact} />
              <AvatarFallback>{currentChat.contact[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{currentChat.contact}</h2>
              <p className="text-sm text-muted-foreground">온라인</p>
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
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.user} />
              <AvatarFallback>{message.isMe ? currentUser[0]?.toUpperCase() : message.user[0]}</AvatarFallback>
            </Avatar>
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
              disabled={!!selectedImage}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim() && !selectedImage}>
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
