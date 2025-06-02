"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const imageUrl = URL.createObjectURL(file)

  return (
    <div className="relative inline-block">
      <div className="relative w-20 h-20">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Preview"
          fill
          className="object-cover rounded-lg border"
          crossOrigin="anonymous"
        />
      </div>
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
