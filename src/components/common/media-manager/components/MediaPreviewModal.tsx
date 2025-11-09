import React, { useEffect, useRef } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { MediaPreviewIcon } from './MediaTypeIcon';
import { MediaManagerItem, getFileExtension, MediaType } from '../media';

interface MediaPreviewModalProps {
    item: MediaManagerItem | null;
    onClose: () => void;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ item, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        // Lock body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    if (!item) return null;

    const extension = getFileExtension(item.media_name);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-medium truncate" title={item.media_name}>
                        {item.media_name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={item.media_path}
                            download={item.media_name}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="Download"
                        >
                            <Download size={20} />
                        </a>
                        <a
                            href={item.media_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="Open in new tab"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-grow overflow-auto p-4 flex items-center justify-center">
                    {item.media_type === MediaType.Image ? (
                        <img
                            src={item.media_path}
                            alt={item.media_name}
                            className="max-w-full max-h-[70vh] object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e2e8f0/a0aec0?text=Image+Not+Available';
                            }}
                        />
                    ) : item.media_type === MediaType.Video ? (
                        <video
                            src={item.media_path}
                            controls
                            className="max-w-full max-h-[70vh]"
                            onError={() => {
                                // Handle video error
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : item.media_type === MediaType.Audio ? (
                        <div className="w-full max-w-md p-8 bg-gray-50 rounded-xl">
                            <div className="flex flex-col items-center mb-4">
                                <MediaPreviewIcon type={MediaType.Audio} size={64} className="text-gray-400 mb-4" />
                                <p className="text-center font-medium">{item.media_name}</p>
                            </div>
                            <audio
                                src={item.media_path}
                                controls
                                className="w-full"
                                onError={() => {
                                    // Handle audio error
                                }}
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-gray-50 rounded-xl">
                            <MediaPreviewIcon type={item.media_type} size={80} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">{item.media_name}</p>
                            <p className="text-sm text-gray-500 mb-4">
                                {extension.toUpperCase()} Document
                            </p>
                            <a
                                href={item.media_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Open Document
                            </a>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50 text-sm text-gray-500">
                    Original filename: {item.media_name}
                </div>
            </div>
        </div>
    );
};

export default MediaPreviewModal;