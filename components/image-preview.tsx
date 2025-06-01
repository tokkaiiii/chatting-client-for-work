"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const imageUrl = URL.createObjectURL(file)

  return (
    <div className="relative inline-block">
      <img
        src={imageUrl || "/placeholder.svg"}
        alt="Preview"
        className="w-20 h-20 object-cover rounded-lg border"
        crossOrigin="anonymous"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
