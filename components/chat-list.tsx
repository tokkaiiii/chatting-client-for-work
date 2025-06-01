"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogOut, Plus, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";
import { getToken, getUsername } from "@/lib/auth";

interface ChatRoom {
  chatRoomId: string;
  roomName: string;
  avatar: string;
  lastMessage: string;
  lastMessageDateTime: string;
  unreadMessageCount: number;
  online: boolean;
}

interface ChatListProps {
  username: string;
  onSelectChat: (chatRoomName: string, chatRoomId: string) => void;
  onLogout: () => void;
}

export default function ChatList({
  username,
  onSelectChat,
  onLogout,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/chat/rooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          throw new Error("채팅방 목록을 불러오는데 실패했습니다");
        }

        const data = await response.json();
        setChatRooms(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  // 검색 기능
  const filteredChatRooms = chatRooms.filter((room) =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onNewChat = async () => {
    const response = await fetch(`${config.apiUrl}/chat/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        roomName: `${getUsername()}의 새로운 채팅`,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      onSelectChat(data.roomName, data.roomName);
    } else {
      console.error("채팅 생성 실패");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt={username}
            />
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
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : filteredChatRooms.length > 0 ? (
          filteredChatRooms.map((room) => (
            <div
              key={room.chatRoomId}
              className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelectChat(room.roomName, room.chatRoomId)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={room.avatar || "/placeholder.svg"}
                      alt={room.roomName}
                    />
                    <AvatarFallback>{room.roomName[0]}</AvatarFallback>
                  </Avatar>
                  {room.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{room.roomName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {room.lastMessageDateTime}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {room.lastMessage}
                  </p>
                </div>
                {room.unreadMessageCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-full h-5 min-w-[20px] flex items-center justify-center"
                  >
                    {room.unreadMessageCount}
                  </Badge>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            검색 결과가 없습니다
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t">
        <Button className="w-full" variant="default" onClick={onNewChat}>
          <Plus className="h-4 w-4 mr-2" />새 대화
        </Button>
      </div>
    </div>
  );
}
