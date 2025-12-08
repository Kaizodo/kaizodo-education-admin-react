"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit, GripVertical, ExternalLink, ArrowDown } from "lucide-react"
import {
  findHeaderLink,
  removeHeaderLink,
  insertHeaderLink,
  updateNestedLink,
  getDropZoneClasses,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
} from "./CommonLogic"
import { HeaderEditorProps, HeaderLink, defaultHeaderLink } from "@/data/NavManager"
import NoRecords from "@/components/common/NoRecords"
import Btn from "@/components/common/Btn"

export default function HeaderEditor({
  data,
  setData,
  draggedItem,
  setDraggedItem,
  dropZone,
  setDropZone,
}: HeaderEditorProps) {
  const [editingLink, setEditingLink] = useState<HeaderLink | null>(null)

  const addHeaderLink = (parentId?: string) => {
    const newLink: HeaderLink = {
      ...defaultHeaderLink,
      id: Date.now().toString(),
    }

    if (parentId) {
      const updatedHeader = data.map((link) =>
        updateNestedLink(link, parentId, (parent) => ({
          ...parent,
          children: [...(parent.children || []), newLink],
        })),
      )
      setData(updatedHeader)
    } else {
      setData([...data, newLink])
    }
  }

  const updateHeaderLink = (updatedLink: HeaderLink) => {
    const updateInArray = (links: HeaderLink[]): HeaderLink[] => {
      return links.map((link) => {
        if (link.id === updatedLink.id) {
          return updatedLink
        }
        if (link.children) {
          return { ...link, children: updateInArray(link.children) }
        }
        return link
      })
    }

    setData(updateInArray(data))
    setEditingLink(null)
  }

  const deleteHeaderLink = (linkId: string) => {
    setData(removeHeaderLink(data, linkId))
  }

  const handleDrop = (
    e: React.DragEvent,
    targetType: string,
    targetId: string,
    position: "before" | "after" | "inside" = "after",
    targetParentId?: string,
  ) => {
    e.preventDefault()
    setDropZone(null)

    if (targetParentId) { }

    if (!draggedItem || draggedItem.id === targetId) return

    // Handle header link complex reordering
    if (draggedItem.type === "header" && targetType === "header") {
      const draggedLink = findHeaderLink(data, draggedItem.id)
      if (!draggedLink) return

      // Remove from current position
      let newHeader = removeHeaderLink(data, draggedItem.id)

      // Insert at new position
      newHeader = insertHeaderLink(newHeader, draggedLink, targetId, position)

      setData(newHeader)
    }

    setDraggedItem(null)
  }

  const renderHeaderLink = (link: HeaderLink, depth = 0, parentId?: string) => (
    <div key={link.id} className="relative">
      {/* Drop zone before */}
      <div
        className={`h-2 transition-all duration-200 ${getDropZoneClasses(dropZone, link.id, "before")}`}
        onDragOver={(e) => handleDragOver(e, "header", link.id, draggedItem, setDropZone, "before", parentId)}
        onDrop={(e) => handleDrop(e, "header", link.id, "before", parentId)}
      />

      <div
        className={`border rounded-lg p-3 bg-white transition-all duration-300 transform hover:shadow-md ${draggedItem?.id === link.id ? "opacity-50 scale-95" : ""
          } ${getDropZoneClasses(dropZone, link.id, "inside")}`}
      >
        <div
          className="flex items-center gap-2 cursor-move"
          draggable
          onDragStart={(e) => handleDragStart(e, "header", link.id, setDraggedItem, data, parentId)}
          onDragEnd={(e) => handleDragEnd(e, setDraggedItem, setDropZone)}
          onDragOver={(e) => handleDragOver(e, "header", link.id, draggedItem, setDropZone, "inside", parentId)}
          onDragLeave={(e) => handleDragLeave(e, setDropZone)}
          onDrop={(e) => handleDrop(e, "header", link.id, "inside", parentId)}
        >
          <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{link.title || "Untitled"}</span>
              <Badge variant="outline" className="text-xs">
                {link.type}
              </Badge>
              {link.target === "_blank" && <ExternalLink className="h-3 w-3" />}
              {link.children && link.children.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {link.children.length} child{link.children.length !== 1 ? "ren" : ""}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{link.url}</p>
          </div>
          <div className="flex gap-1">
            {link.type !== "simple" && (
              <Button size="sm" variant="outline" onClick={() => addHeaderLink(link.id)} className="hover:bg-green-50">
                <Plus className="h-3 w-3" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setEditingLink(link)} className="hover:bg-blue-50">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => deleteHeaderLink(link.id)} className="hover:bg-red-50">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {link.children && link.children.length > 0 && (
          <div className="ml-6 mt-3 space-y-1 border-l-2 border-gray-200 pl-3 relative">
            <div className="absolute -left-2 top-0 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
              <ArrowDown className="h-2 w-2 text-gray-500" />
            </div>
            {link.children.map((child) => renderHeaderLink(child, depth + 1, link.id))}
          </div>
        )}
      </div>

      {/* Drop zone after */}
      <div
        className={`h-2 transition-all duration-200 ${getDropZoneClasses(dropZone, link.id, "after")}`}
        onDragOver={(e) => handleDragOver(e, "header", link.id, draggedItem, setDropZone, "after", parentId)}
        onDrop={(e) => handleDrop(e, "header", link.id, "after", parentId)}
      />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Header Navigation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Drag items to reorder • Drop inside items to nest • Drop between items to reposition
          </p>
        </div>
        <Btn onClick={() => addHeaderLink()}><Plus className="h-4 w-4 mr-2" />
          Add Link</Btn>
      </div>

      <div className="space-y-1">
        {data.map((link) => renderHeaderLink(link))}
        {data.length === 0 && (
          <NoRecords title="No Header Links Yet" subtitle="Try adding some header links" action={<Btn onClick={() => addHeaderLink()}><Plus className="h-4 w-4 mr-2" />Add Link</Btn>} />
        )}
      </div>

      {/* Header Link Edit Dialog */}
      <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Header Link</DialogTitle>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="target">Target</Label>
                <Select
                  value={editingLink.target}
                  onValueChange={(value: any) => setEditingLink({ ...editingLink, target: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Tab</SelectItem>
                    <SelectItem value="_blank">New Tab</SelectItem>
                    <SelectItem value="_parent">Parent Frame (Only Iframes)</SelectItem>
                    <SelectItem value="_top">Top Frame (Only Iframes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={editingLink.type}
                  onValueChange={(value: any) => setEditingLink({ ...editingLink, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple Link</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="mega">Mega Menu</SelectItem>
                    <SelectItem value="nested">Nested Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editingLink.type === "mega" && (
                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Select
                    value={editingLink.columns?.toString()}
                    onValueChange={(value) => setEditingLink({ ...editingLink, columns: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => updateHeaderLink(editingLink)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingLink(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
