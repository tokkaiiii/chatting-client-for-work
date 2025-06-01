"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import SignupForm from "@/components/signup-form"
import ChatList from "@/components/chat-list"
import ChatInterface from "@/components/chat-interface"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"login" | "signup" | "chatList" | "chat">("login")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  // 반응형 디자인을 위한 미디어 쿼리
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleLogin = (username: string) => {
    setCurrentUser(username)
    setCurrentView("chatList")
  }

  const handleSignup = (username: string) => {
    setCurrentUser(username)
    setCurrentView("chatList")
  }

  const handleSwitchToSignup = () => {
    setCurrentView("signup")
  }

  const handleSwitchToLogin = () => {
    setCurrentView("login")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedChatId(null)
    setCurrentView("login")
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    if (isMobile) {
      setCurrentView("chat")
    }
  }

  const handleBackToList = () => {
    if (isMobile) {
      setCurrentView("chatList")
    }
  }

  // 로그인/회원가입 화면
  if (!currentUser) {
    if (currentView === "signup") {
      return <SignupForm onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />
    }
    return <LoginForm onLogin={handleLogin} onSwitchToSignup={handleSwitchToSignup} />
  }

  // 모바일 화면에서는 채팅 목록과 채팅 인터페이스를 전환
  if (isMobile) {
    if (currentView === "chat" && selectedChatId) {
      return <ChatInterface currentUser={currentUser} chatId={selectedChatId} onBack={handleBackToList} />
    }

    return <ChatList username={currentUser} onSelectChat={handleSelectChat} onLogout={handleLogout} />
  }

  // 데스크톱 화면에서는 채팅 목록과 채팅 인터페이스를 나란히 표시
  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <ChatList username={currentUser} onSelectChat={handleSelectChat} onLogout={handleLogout} />
      </div>
      <div className="w-2/3">
        {selectedChatId ? (
          <ChatInterface currentUser={currentUser} chatId={selectedChatId} onBack={handleBackToList} />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/20">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">대화를 선택하세요</h2>
              <p className="text-muted-foreground">왼쪽 목록에서 대화를 선택하여 채팅을 시작하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
