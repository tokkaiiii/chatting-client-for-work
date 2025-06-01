"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, MessageCircle, Check, X } from "lucide-react"

interface SignupFormProps {
  onSignup: (username: string) => void
  onSwitchToLogin: () => void
}

export default function SignupForm({ onSignup, onSwitchToLogin }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const passwordRequirements = [
    { text: "최소 8자 이상", met: formData.password.length >= 8 },
    { text: "대문자 포함", met: /[A-Z]/.test(formData.password) },
    { text: "소문자 포함", met: /[a-z]/.test(formData.password) },
    { text: "숫자 포함", met: /\d/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && isPasswordValid && doPasswordsMatch && agreeToTerms) {
      onSignup(formData.name)
    }
  }

  const isFormValid = formData.name && formData.email && isPasswordValid && doPasswordsMatch && agreeToTerms

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">계정 만들기</CardTitle>
          <CardDescription>새 계정을 만들어 채팅을 시작하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="space-y-1 text-xs">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 ${req.met ? "text-green-600" : "text-red-500"}`}
                    >
                      {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div
                  className={`flex items-center space-x-2 text-xs ${doPasswordsMatch ? "text-green-600" : "text-red-500"}`}
                >
                  {doPasswordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  <span>{doPasswordsMatch ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                <span>이용약관</span>과 <span>개인정보처리방침</span>에 동의합니다
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={!isFormValid}>
              계정 만들기
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Button variant="link" className="p-0 h-auto font-normal" onClick={onSwitchToLogin}>
              로그인
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
