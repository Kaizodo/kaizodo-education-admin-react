import React from 'react';
import { ChevronRight, Folder } from 'lucide-react';
import { MediaManagerItemCategory } from '../media';

interface MediaManagerBreadcrumbProps {
    folders: MediaManagerItemCategory[];
    currentPath: MediaManagerItemCategory[];
    onNavigate: (folderId: number | null) => void;
}

const MediaManagerBreadcrumb: React.FC<MediaManagerBreadcrumbProps> = ({ currentPath, onNavigate }) => {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto pb-2">
            <button
                onClick={() => onNavigate(null)}
                className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
            >
                <Folder size={16} className="mr-1" />
                Root
            </button>

            {currentPath.map((folder) => (
                <React.Fragment key={folder.id}>
                    <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    <button
                        onClick={() => onNavigate(folder.id)}
                        className="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap"
                    >
                        <Folder size={16} className="mr-1" />
                        {folder.name}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};

export default MediaManagerBreadcrumb;