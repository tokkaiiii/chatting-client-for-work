"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import Image from "next/image"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = alt || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button variant="secondary" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-full h-[90vh]">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={alt}
              fill
              className="object-contain rounded-lg"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
