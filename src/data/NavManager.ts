export interface BaseLink {
    id: string
    title: string
    url: string
    target: "_blank" | "_self" | "_parent" | "_top"
}

export interface HeaderLink extends BaseLink {
    type: "simple" | "dropdown" | "mega" | "nested"
    children?: HeaderLink[]
    columns?: number // for mega menu
}

export interface FooterColumn {
    id: string
    title: string
    links: BaseLink[]
}

export interface NavData {
    header: HeaderLink[]
    footer: FooterColumn[]
}

export interface NavManagerProps {
    data: NavData
    setData: (data: NavData) => void
}

export interface DraggedItem {
    type: string
    id: string
    parentId?: string
    data?: HeaderLink | BaseLink
}

export interface DropZone {
    type: string
    id: string
    position: "before" | "after" | "inside"
    parentId?: string
}

export interface HeaderEditorProps {
    data: HeaderLink[]
    setData: (data: HeaderLink[]) => void
    draggedItem: DraggedItem | null
    setDraggedItem: (item: DraggedItem | null) => void
    dropZone: DropZone | null
    setDropZone: (zone: DropZone | null) => void
}

export interface FooterEditorProps {
    data: FooterColumn[]
    setData: (data: FooterColumn[]) => void
    draggedItem: DraggedItem | null
    setDraggedItem: (item: DraggedItem | null) => void
    dropZone: DropZone | null
    setDropZone: (zone: DropZone | null) => void
}

// Default values
export const defaultLink: Omit<BaseLink, "id"> = {
    title: "",
    url: "",
    target: "_self",
}

export const defaultHeaderLink: Omit<HeaderLink, "id"> = {
    ...defaultLink,
    type: "simple",
    children: [],
    columns: 1,
}
