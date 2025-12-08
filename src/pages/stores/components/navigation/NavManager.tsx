"use client"
import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GripVertical } from "lucide-react"
import HeaderEditor from "./HeaderEditor"
import FooterEditor from "./FooterEditor"
import { DraggedItem, DropZone, NavManagerProps } from "@/data/NavManager"



export default function NavManager({ data, setData }: NavManagerProps) {
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
    const [dropZone, setDropZone] = useState<DropZone | null>(null)
    const dragPreviewRef = useRef<HTMLDivElement>(null)

    const updateHeaderData = (headerData: typeof data.header) => {
        setData({ ...data, header: headerData })
    }

    const updateFooterData = (footerData: typeof data.footer) => {
        setData({ ...data, footer: footerData })
    }

    return (
        <div className="w-full">
            {/* Hidden drag preview */}
            <div
                ref={dragPreviewRef}
                className="fixed -top-1000 left-0 bg-white border rounded-lg p-2 shadow-lg opacity-90 pointer-events-none z-50"
                style={{ transform: "translate(-1000px, -1000px)" }}
            >
                {draggedItem?.data && "title" in draggedItem.data && (
                    <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{draggedItem.data.title}</span>
                    </div>
                )}
            </div>

            <Tabs defaultValue="header" className="w-full">
                <TabsList>
                    <TabsTrigger value="header">Header Navigation</TabsTrigger>
                    <TabsTrigger value="footer">Footer Navigation</TabsTrigger>
                </TabsList>

                <TabsContent value="header">
                    <HeaderEditor
                        data={data.header}
                        setData={updateHeaderData}
                        draggedItem={draggedItem}
                        setDraggedItem={setDraggedItem}
                        dropZone={dropZone}
                        setDropZone={setDropZone}
                    />
                </TabsContent>

                <TabsContent value="footer">
                    <FooterEditor
                        data={data.footer}
                        setData={updateFooterData}
                        draggedItem={draggedItem}
                        setDraggedItem={setDraggedItem}
                        dropZone={dropZone}
                        setDropZone={setDropZone}
                    />
                </TabsContent>
            </Tabs>

            <style>{`
        .dragging {
          opacity: 0.5;
          transform: scale(0.95);
          transition: all 0.2s ease;
        }
        
        @keyframes dropZonePulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .drop-zone-active {
          animation: dropZonePulse 1s infinite;
        }
      `}</style>
        </div>
    )
}
