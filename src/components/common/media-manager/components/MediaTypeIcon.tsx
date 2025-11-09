import React from 'react';
import {
    Image,
    FileVideo,
    FileText,
    FileAudio,
    File,
    Music,
    Video,
    BookOpen,
    FileImage
} from 'lucide-react';
import { MediaType } from '../media';

interface MediaTypeIconProps {
    type: MediaType;
    className?: string;
    size?: number;
}

const MediaTypeIcon: React.FC<MediaTypeIconProps> = ({
    type,
    className = '',
    size = 24
}) => {
    switch (type) {
        case MediaType.Image:
            return <FileImage size={size} className={className} />;
        case MediaType.Video:
            return <FileVideo size={size} className={className} />;
        case MediaType.Document:
            return <FileText size={size} className={className} />;
        case MediaType.Audio:
            return <FileAudio size={size} className={className} />;
        default:
            return <File size={size} className={className} />;
    }
};

export const MediaPreviewIcon: React.FC<MediaTypeIconProps> = ({
    type,
    className = '',
    size = 48
}) => {
    switch (type) {
        case MediaType.Image:
            return <Image size={size} className={className} />;
        case MediaType.Video:
            return <Video size={size} className={className} />;
        case MediaType.Document:
            return <BookOpen size={size} className={className} />;
        case MediaType.Audio:
            return <Music size={size} className={className} />;
        default:
            return <File size={size} className={className} />;
    }
};

export default MediaTypeIcon;