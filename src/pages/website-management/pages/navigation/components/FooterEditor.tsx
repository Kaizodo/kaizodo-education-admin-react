"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit, GripVertical, ExternalLink, ArrowDown } from "lucide-react"
import { getDropZoneClasses, handleDragStart, handleDragEnd, handleDragOver, handleDragLeave } from "./CommonLogic"
import { FooterEditorProps, BaseLink, FooterColumn, defaultLink } from "@/data/NavManager"

export default function FooterEditor({
    data,
    setData,
    draggedItem,
    setDraggedItem,
    dropZone,
    setDropZone,
}: FooterEditorProps) {
    const [editingFooterLink, setEditingFooterLink] = useState<{ columnId: string; link: BaseLink } | null>(null)
    const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null)

    const addFooterColumn = () => {
        const newColumn: FooterColumn = {
            id: Date.now().toString(),
            title: "New Column",
            links: [],
        }
        setData([...data, newColumn])
    }

    const updateFooterColumn = (columnId: string, updates: Partial<FooterColumn>) => {
        const updatedFooter = data.map((col) => (col.id === columnId ? { ...col, ...updates } : col))
        setData(updatedFooter)
    }

    const deleteFooterColumn = (columnId: string) => {
        setData(data.filter((col) => col.id !== columnId))
    }

    const addFooterLink = (columnId: string) => {
        const newLink: BaseLink = {
            ...defaultLink,
            id: Date.now().toString(),
        }

        const updatedFooter = data.map((col) => (col.id === columnId ? { ...col, links: [...col.links, newLink] } : col))
        setData(updatedFooter)
    }

    const updateFooterLink = (columnId: string, linkId: string, updates: Partial<BaseLink>) => {
        const updatedFooter = data.map((col) =>
            col.id === columnId
                ? {
                    ...col,
                    links: col.links.map((link) => (link.id === linkId ? { ...link, ...updates } : link)),
                }
                : col,
        )
        setData(updatedFooter)
    }

    const deleteFooterLink = (columnId: string, linkId: string) => {
        const updatedFooter = data.map((col) =>
            col.id === columnId ? { ...col, links: col.links.filter((link) => link.id !== linkId) } : col,
        )
        setData(updatedFooter)
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

        if (targetParentId) {

        }
        if (!draggedItem || draggedItem.id === targetId) return

        // Handle footer column reordering
        if (draggedItem.type === "footer-column" && targetType === "footer-column") {
            const draggedIndex = data.findIndex((col) => col.id === draggedItem.id)
            const targetIndex = data.findIndex((col) => col.id === targetId)

            if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                const newFooter = [...data]
                const [draggedColumn] = newFooter.splice(draggedIndex, 1)

                let insertIndex = targetIndex
                if (position === "after") {
                    insertIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1
                } else if (position === "before") {
                    insertIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
                }

                insertIndex = Math.max(0, Math.min(insertIndex, newFooter.length))
                newFooter.splice(insertIndex, 0, draggedColumn)
                setData(newFooter)
            }
        }

        // Handle footer link reordering within same column
        if (draggedItem.type === "footer-link" && targetType === "footer-link") {
            const sourceColumn = data.find((col) => col.links.some((link) => link.id === draggedItem.id))
            const targetColumn = data.find((col) => col.links.some((link) => link.id === targetId))

            if (sourceColumn && targetColumn && sourceColumn.id === targetColumn.id) {
                const draggedIndex = sourceColumn.links.findIndex((link) => link.id === draggedItem.id)
                const targetIndex = sourceColumn.links.findIndex((link) => link.id === targetId)

                if (draggedIndex !== -1 && targetIndex !== -1) {
                    const newLinks = [...sourceColumn.links]
                    const [draggedLink] = newLinks.splice(draggedIndex, 1)
                    const insertIndex = position === "before" ? targetIndex : targetIndex + 1
                    newLinks.splice(insertIndex, 0, draggedLink)

                    const updatedFooter = data.map((col) => (col.id === sourceColumn.id ? { ...col, links: newLinks } : col))
                    setData(updatedFooter)
                }
            }
        }

        setDraggedItem(null)
    }

    const renderFooterColumn = (column: FooterColumn) => (
        <div key={column.id} className="relative">
            <Card
                className={`w-full transition-all duration-300 transform hover:shadow-lg ${draggedItem?.id === column.id ? "opacity-50 scale-95" : ""
                    } ${getDropZoneClasses(dropZone, column.id, "inside")}`}
            >
                <CardHeader
                    className="cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "footer-column", column.id, setDraggedItem, data)}
                    onDragEnd={(e) => handleDragEnd(e, setDraggedItem, setDropZone)}
                    onDragOver={(e) => handleDragOver(e, "footer-column", column.id, draggedItem, setDropZone, "after")}
                    onDragLeave={(e) => handleDragLeave(e, setDropZone)}
                    onDrop={(e) => handleDrop(e, "footer-column", column.id, "after")}
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        <CardTitle className="flex-1">{column.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                            {column.links.length} link{column.links.length !== 1 ? "s" : ""}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setEditingColumn(column)} className="hover:bg-blue-50">
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteFooterColumn(column.id)}
                            className="hover:bg-red-50"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-1">
                    {column.links.map((link, index) => (
                        <div key={link.id} className="relative">
                            {/* Drop zone before link */}
                            <div
                                className={`h-1 transition-all duration-200 ${getDropZoneClasses(dropZone, link.id, "before")}`}
                                onDragOver={(e) => handleDragOver(e, "footer-link", link.id, draggedItem, setDropZone, "before")}
                                onDrop={(e) => handleDrop(e, "footer-link", link.id, "before")}
                            />

                            <div
                                className={`flex items-center gap-2 p-2 border rounded cursor-move transition-all duration-300 transform hover:shadow-sm hover:bg-gray-50 ${draggedItem?.id === link.id ? "opacity-50 scale-95" : ""
                                    }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, "footer-link", link.id, setDraggedItem, data, column.id)}
                                onDragEnd={(e) => handleDragEnd(e, setDraggedItem, setDropZone)}
                                onDragOver={(e) => handleDragOver(e, "footer-link", link.id, draggedItem, setDropZone, "after")}
                                onDragLeave={(e) => handleDragLeave(e, setDropZone)}
                                onDrop={(e) => handleDrop(e, "footer-link", link.id, "after")}
                            >
                                <GripVertical className="h-3 w-3 text-gray-400 hover:text-gray-600 transition-colors" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{link.title || "Untitled"}</p>
                                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                                </div>
                                {link.target === "_blank" && <ExternalLink className="h-3 w-3" />}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingFooterLink({ columnId: column.id, link })}
                                    className="hover:bg-blue-50"
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteFooterLink(column.id, link.id)}
                                    className="hover:bg-red-50"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Drop zone after link */}
                            {index === column.links.length - 1 && (
                                <div
                                    className={`h-1 transition-all duration-200 ${getDropZoneClasses(dropZone, link.id, "after")}`}
                                    onDragOver={(e) => handleDragOver(e, "footer-link", link.id, draggedItem, setDropZone, "after")}
                                    onDrop={(e) => handleDrop(e, "footer-link", link.id, "after")}
                                />
                            )}
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addFooterLink(column.id)}
                        className="w-full hover:bg-green-50 transition-colors"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Link
                    </Button>
                </CardContent>
            </Card>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Footer Navigation</h2>
                    <p className="text-sm text-gray-600 mt-1">Drag columns to reorder • Drag links within columns to sort</p>
                </div>
                <Button onClick={addFooterColumn} className="hover:bg-green-600 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                </Button>
            </div>

            <div className="space-y-4">
                {data.map((column) => (
                    <div key={column.id} className="relative">
                        {/* Drop zone before column */}
                        <div
                            className={`h-2 transition-all duration-200 ${getDropZoneClasses(dropZone, column.id, "before")}`}
                            onDragOver={(e) => handleDragOver(e, "footer-column", column.id, draggedItem, setDropZone, "before")}
                            onDrop={(e) => handleDrop(e, "footer-column", column.id, "before")}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{renderFooterColumn(column)}</div>

                        {/* Drop zone after column */}
                        <div
                            className={`h-2 transition-all duration-200 ${getDropZoneClasses(dropZone, column.id, "after")}`}
                            onDragOver={(e) => handleDragOver(e, "footer-column", column.id, draggedItem, setDropZone, "after")}
                            onDrop={(e) => handleDrop(e, "footer-column", column.id, "after")}
                        />
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        <ArrowDown className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No footer columns yet. Add your first column to get started.</p>
                    </div>
                )}
            </div>

            {/* Footer Link Edit Dialog */}
            <Dialog open={!!editingFooterLink} onOpenChange={() => setEditingFooterLink(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Footer Link</DialogTitle>
                    </DialogHeader>
                    {editingFooterLink && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="footer-title">Title</Label>
                                <Input
                                    id="footer-title"
                                    value={editingFooterLink.link.title}
                                    onChange={(e) => {
                                        const updatedLink = { ...editingFooterLink.link, title: e.target.value }
                                        setEditingFooterLink({ ...editingFooterLink, link: updatedLink })
                                        updateFooterLink(editingFooterLink.columnId, editingFooterLink.link.id, { title: e.target.value })
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="footer-url">URL</Label>
                                <Input
                                    id="footer-url"
                                    value={editingFooterLink.link.url}
                                    onChange={(e) => {
                                        const updatedLink = { ...editingFooterLink.link, url: e.target.value }
                                        setEditingFooterLink({ ...editingFooterLink, link: updatedLink })
                                        updateFooterLink(editingFooterLink.columnId, editingFooterLink.link.id, { url: e.target.value })
                                    }}
                                />
                            </div>
                            <div>
                                <Label htmlFor="footer-target">Target</Label>
                                <Select
                                    value={editingFooterLink.link.target}
                                    onValueChange={(value: any) => {
                                        const updatedLink = { ...editingFooterLink.link, target: value }
                                        setEditingFooterLink({ ...editingFooterLink, link: updatedLink })
                                        updateFooterLink(editingFooterLink.columnId, editingFooterLink.link.id, { target: value })
                                    }}
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
                            <Button onClick={() => setEditingFooterLink(null)} className="w-full">
                                Done
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Footer Column Edit Dialog */}
            <Dialog open={!!editingColumn} onOpenChange={() => setEditingColumn(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Column</DialogTitle>
                    </DialogHeader>
                    {editingColumn && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="column-title">Column Title</Label>
                                <Input
                                    id="column-title"
                                    value={editingColumn.title}
                                    onChange={(e) => {
                                        const updatedColumn = { ...editingColumn, title: e.target.value }
                                        setEditingColumn(updatedColumn)
                                        updateFooterColumn(editingColumn.id, { title: e.target.value })
                                    }}
                                />
                            </div>
                            <Button onClick={() => setEditingColumn(null)} className="w-full">
                                Done
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
