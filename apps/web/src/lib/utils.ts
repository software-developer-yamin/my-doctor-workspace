import { API } from "@/config/api"
import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["3xs", "micro", "body-sm", "body"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  const trimmedPath = path.trim()

  if (trimmedPath.startsWith("http")) {
    // Backend upload URLs stored as absolute in DB — convert to relative so Next.js proxy handles them.
    // External CDN URLs (unsplash, sasthyaseba, etc.) are returned as-is.
    try {
      const url = new URL(trimmedPath)
      if (url.pathname.startsWith("/uploads/")) return url.pathname
    } catch {}
    return trimmedPath
  }

  const cleanPath = trimmedPath.startsWith("/") ? trimmedPath.substring(1) : trimmedPath
  const baseUrl = API.ASSETS_URL?.endsWith("/") ? API.ASSETS_URL : `${API.ASSETS_URL}/`

  return `${baseUrl}${cleanPath}`
}
