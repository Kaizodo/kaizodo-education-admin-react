import { Modal } from "@/components/common/Modal";
import { lazy, Suspense } from "react";
import CenterLoading from "../CenterLoading";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
const LazyMediaManager = lazy(() => import("@/components/common/media-manager/MediaManager"));

export enum MediaType {
    Image = 0,
    Video,
    Document,
    Audio,
    All
}

export const mediaTypeToString = (type: MediaType): string => {
    switch (type) {
        case MediaType.Image:
            return 'Image';
        case MediaType.Video:
            return 'Video';
        case MediaType.Document:
            return 'Document';
        case MediaType.Audio:
            return 'Audio';
        case MediaType.All:
            return 'All';
        default:
            return 'Unknown';
    }
};

export class MediaManagerState {
    public static files: PaginationType<MediaManagerItem> = getDefaultPaginated();
    public static folders: MediaManagerItemCategory[] = [];
}


export const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (extension: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    return imageExtensions.includes(extension);
};

export const isVideoFile = (extension: string): boolean => {
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
    return videoExtensions.includes(extension);
};

export const isAudioFile = (extension: string): boolean => {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
    return audioExtensions.includes(extension);
};

export const isDocumentFile = (extension: string): boolean => {
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    return documentExtensions.includes(extension);
};

export type MediaManagerItem = {
    id: number,
    media_path: string,
    media_name: string,
    media_type: MediaType,
    media_manager_category_id: number,
    aspect_ratio?: number,
    width?: number,
    height?: number
}

export type MediaManagerItemCategory = {
    id: number;
    name: string;
    media_manager_category_id: number;
}


export function getDefaultMediaManagerItem(): MediaManagerItem {
    return {
        id: 0,
        media_path: '',
        media_name: '',
        media_type: MediaType.All,
        media_manager_category_id: 0,
        width: 0,
        height: 0,
        aspect_ratio: 0
    };
}

export type MediaManagerOptions = {
    multiple?: boolean,
    type: MediaType,
    aspectRatio?: number
    width?: number
    height?: number
    compress?: boolean
    quality?: number
}

export type MediaManagerImageOptions = Omit<MediaManagerOptions, 'type'>

export type MediaManagerVideoOptions = Omit<MediaManagerOptions, 'type' | 'width' | 'height' | 'compress' | 'quality'>

export type MediaManagerAudioOptions = Omit<MediaManagerOptions, 'type' | 'aspectRatio' | 'width' | 'height' | 'compress' | 'quality'>

export type MediaManagerDocumentOptions = Omit<MediaManagerOptions, 'type' | 'aspectRatio' | 'width' | 'height' | 'compress' | 'quality'>



export class MediaManager {
    public static async pickImage(options: MediaManagerImageOptions = {}): Promise<MediaManagerItem[]> {
        return this.pickMedia({ ...options, type: MediaType.Image });
    }

    public static async pickVideo(options: MediaManagerVideoOptions = {}): Promise<MediaManagerItem[]> {
        return this.pickMedia({ ...options, type: MediaType.Video });
    }

    public static async pickDocument(options: MediaManagerDocumentOptions = {}): Promise<MediaManagerItem[]> {
        return this.pickMedia({ ...options, type: MediaType.Document });
    }

    public static async pickAudio(options: MediaManagerAudioOptions = {}): Promise<MediaManagerItem[]> {
        return this.pickMedia({ ...options, type: MediaType.Audio });
    }


    public static async pickMedia(options: MediaManagerOptions): Promise<MediaManagerItem[]> {
        return new Promise((resolve) => {

            const modal_id = Modal.show({
                header: false,
                maxWidth: '90%',
                onClose: () => {
                    resolve([])
                },
                content: () => <Suspense fallback={<CenterLoading className='relative h-[200px]' />}>
                    <LazyMediaManager
                        onClose={() => {
                            resolve([]);
                            Modal.close(modal_id);
                        }}
                        options={options}
                        callback={(media) => {
                            resolve(media);
                            Modal.close(modal_id);
                        }}
                    />
                </Suspense>
            })
        });
    }

}