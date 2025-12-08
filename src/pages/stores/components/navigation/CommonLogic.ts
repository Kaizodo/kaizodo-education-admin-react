import { BaseLink, DraggedItem, DropZone, FooterColumn, HeaderLink } from "@/data/NavManager"
import type React from "react"

export const findHeaderLink = (links: HeaderLink[], id: string): HeaderLink | null => {
  for (const link of links) {
    if (link.id === id) return link
    if (link.children) {
      const found = findHeaderLink(link.children, id)
      if (found) return found
    }
  }
  return null
}

export const removeHeaderLink = (links: HeaderLink[], id: string): HeaderLink[] => {
  return links
    .filter((link) => link.id !== id)
    .map((link) => ({
      ...link,
      children: link.children ? removeHeaderLink(link.children, id) : undefined,
    }))
}

export const insertHeaderLink = (
  links: HeaderLink[],
  newLink: HeaderLink,
  targetId: string,
  position: "before" | "after" | "inside",
): HeaderLink[] => {
  if (position === "inside") {
    return links.map((link) => {
      if (link.id === targetId) {
        return {
          ...link,
          type: link.type === "simple" ? "dropdown" : link.type,
          children: [...(link.children || []), newLink],
        }
      }
      if (link.children) {
        return {
          ...link,
          children: insertHeaderLink(link.children, newLink, targetId, position),
        }
      }
      return link
    })
  }

  const result: HeaderLink[] = []
  for (let i = 0; i < links.length; i++) {
    const link = links[i]

    if (link.id === targetId) {
      if (position === "before") {
        result.push(newLink, link)
      } else {
        result.push(link, newLink)
      }
    } else {
      if (link.children) {
        result.push({
          ...link,
          children: insertHeaderLink(link.children, newLink, targetId, position),
        })
      } else {
        result.push(link)
      }
    }
  }
  return result
}

export const updateNestedLink = (
  link: HeaderLink,
  targetId: string,
  updater: (link: HeaderLink) => HeaderLink,
): HeaderLink => {
  if (link.id === targetId) {
    return updater(link)
  }
  if (link.children) {
    return {
      ...link,
      children: link.children.map((child) => updateNestedLink(child, targetId, updater)),
    }
  }
  return link
}

export const getDropZoneClasses = (dropZone: DropZone | null, id: string, position: "before" | "after" | "inside") => {
  if (dropZone?.id === id && dropZone?.position === position) {
    switch (position) {
      case "before":
        return "border-t-4 border-t-blue-500"
      case "after":
        return "border-b-4 border-b-blue-500"
      case "inside":
        return "bg-blue-50 border-2 border-blue-300 border-dashed"
      default:
        return ""
    }
  }
  return ""
}

export const handleDragStart = (
  e: React.DragEvent,
  type: string,
  id: string,
  setDraggedItem: (item: DraggedItem | null) => void,
  data?: HeaderLink[] | FooterColumn[],
  parentId?: string,
) => {
  let dragData: HeaderLink | BaseLink | null = null

  if (type === "header" && Array.isArray(data)) {
    dragData = findHeaderLink(data as HeaderLink[], id)
  } else if (type === "footer-link" && Array.isArray(data)) {
    const footerData = data as FooterColumn[]
    const column = footerData.find((col) => col.links.some((link) => link.id === id))
    dragData = column?.links.find((link) => link.id === id) || null
  }

  setDraggedItem({ type, id, parentId, data: dragData as any })
  e.dataTransfer.effectAllowed = "move"
  e.dataTransfer.setData("text/plain", "")

  // Add drag class for animation
  const target = e.target as HTMLElement
  target.classList.add("dragging")
}

export const handleDragEnd = (
  e: React.DragEvent,
  setDraggedItem: (item: DraggedItem | null) => void,
  setDropZone: (zone: DropZone | null) => void,
) => {
  const target = e.target as HTMLElement
  target.classList.remove("dragging")
  setDraggedItem(null)
  setDropZone(null)
}

export const handleDragOver = (
  e: React.DragEvent,
  targetType: string,
  targetId: string,
  draggedItem: DraggedItem | null,
  setDropZone: (zone: DropZone | null) => void,
  position: "before" | "after" | "inside" = "after",
  parentId?: string,
) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = "move"

  if (draggedItem && draggedItem.id !== targetId) {
    setDropZone({ type: targetType, id: targetId, position, parentId })
  }
}

export const handleDragLeave = (e: React.DragEvent, setDropZone: (zone: DropZone | null) => void) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX
  const y = e.clientY

  // Only clear drop zone if mouse is actually outside the element
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    setDropZone(null)
  }
}
