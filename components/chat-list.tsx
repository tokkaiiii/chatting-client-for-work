"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogOut, Plus, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChatRoom {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
}

interface ChatListProps {
  username: string
  onSelectChat: (chatId: string) => void
  onLogout: () => void
}

export default function ChatList({ username, onSelectChat, onLogout }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // 샘플 채팅방 데이터
  const chatRooms: ChatRoom[] = [
    {
      id: "chat1",
      name: "Alice",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "완벽하네요! 그럼 3시에 회의실에서 뵙겠습니다. 😊",
      time: "오후 2:36",
      unread: 0,
      online: true,
    },
    {
      id: "chat2",
      name: "Bob",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "프로젝트 마감일이 언제였죠?",
      time: "오전 11:20",
      unread: 2,
      online: true,
    },
    {
      id: "chat3",
      name: "Charlie",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "주말에 팀 회식 어떠세요?",
      time: "어제",
      unread: 0,
      online: false,
    },
    {
      id: "chat4",
      name: "Diana",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "발표 자료 검토 부탁드립니다.",
      time: "어제",
      unread: 3,
      online: false,
    },
    {
      id: "chat5",
      name: "Edward",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "새 기능 개발 일정 공유해 주세요.",
      time: "월요일",
      unread: 0,
      online: false,
    },
    {
      id: "chat6",
      name: "팀 프로젝트",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Charlie: 다음 회의는 금요일 오후 2시입니다.",
      time: "월요일",
      unread: 0,
      online: false,
    },
  ]

  // 검색 기능
  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={username} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{username}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="대화 검색"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatRooms.length > 0 ? (
          filteredChatRooms.map((room) => (
            <div
              key={room.id}
              className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelectChat(room.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={room.avatar || "/placeholder.svg"} alt={room.name} />
                    <AvatarFallback>{room.name[0]}</AvatarFallback>
                  </Avatar>
                  {room.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{room.name}</h3>
                    <span className="text-xs text-muted-foreground">{room.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{room.lastMessage}</p>
                </div>
                {room.unread > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full h-5 min-w-[20px] flex items-center justify-center"
                  >
                    {room.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">검색 결과가 없습니다</div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t">
        <Button className="w-full" variant="default">
          <Plus className="h-4 w-4 mr-2" />새 대화
        </Button>
      </div>
    </div>
  )
}
