import React from 'react';
import { Check, Eye } from 'lucide-react';
import MediaTypeIcon, { MediaPreviewIcon } from './MediaTypeIcon';
import { MediaManagerItem, getFileExtension, MediaType } from '../media';

interface MediaItemProps {
    item: MediaManagerItem;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onPreview: (item: MediaManagerItem) => void;
    view: 'grid' | 'list';
}

const MediaItem: React.FC<MediaItemProps> = ({
    item,
    isSelected,
    onSelect,
    onPreview,
    view
}) => {
    const extension = getFileExtension(item.media_name);

    // Display thumbnail for images
    const isImage = item.media_type === MediaType.Image;

    //  component to render based on view type
    if (view === 'grid') {
        return (
            <div
                className={`
                    relative group rounded-lg overflow-hidden transition-all duration-200
                    border-2 ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-transparent hover:bg-gray-50'}
                `}
                onClick={() => onSelect(item.id)}
            >
                <div className="aspect-square overflow-hidden bg-gray-100">
                    {isImage ? (
                        <img
                            src={item.media_path}
                            alt={item.media_name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/a0aec0?text=No+Preview';
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <MediaPreviewIcon
                                type={item.media_type}
                                size={48}
                                className="text-gray-400"
                            />
                        </div>
                    )}
                </div>

                {/* Overlay with actions */}
                <div className={`
                    absolute inset-0 flex items-center justify-center
                    bg-black bg-opacity-0 group-hover:bg-opacity-30
                    transition-all duration-200
                    ${isSelected ? 'bg-opacity-20' : ''}
                `}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(item);
                        }}
                        className="p-2 bg-white rounded-full text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-md">
                        <Check size={12} />
                    </div>
                )}

                {/* File info */}
                <div className="p-2">
                    <p className="text-sm font-medium truncate" title={item.media_name}>
                        {item.media_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MediaTypeIcon type={item.media_type} size={12} />
                        <span className="capitalize">{extension}</span>
                    </p>
                </div>
            </div>
        );
    } else {
        // List view
        return (
            <div
                className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}
                `}
                onClick={() => onSelect(item.id)}
            >
                <div className={`
                    w-10 h-10 mr-3 rounded overflow-hidden bg-gray-100 flex items-center justify-center
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                `}>
                    {isImage ? (
                        <img
                            src={item.media_path}
                            alt={item.media_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/a0aec0?text=Error';
                            }}
                        />
                    ) : (
                        <MediaTypeIcon
                            type={item.media_type}
                            className="text-gray-400"
                            size={20}
                        />
                    )}
                </div>

                <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate" title={item.media_name}>
                        {item.media_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                        <span className="capitalize">{extension}</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(item);
                        }}
                        className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                    >
                        <Eye size={16} />
                    </button>

                    {isSelected && (
                        <div className="text-blue-500">
                            <Check size={16} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default MediaItem;