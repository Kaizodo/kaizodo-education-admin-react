import React from 'react';
import { Folder } from 'lucide-react';
import { MediaManagerItemCategory } from '../media';

interface FolderGridProps {
    folders: MediaManagerItemCategory[];
    onNavigate: (folderId: number) => void;
    view: 'grid' | 'list';
}

const FolderGrid: React.FC<FolderGridProps> = ({ folders, onNavigate, view }) => {
    if (folders.length === 0) return null;

    if (view === 'grid') {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => onNavigate(folder.id)}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
                    >
                        <div className="flex items-center space-x-3">
                            <Folder
                                size={24}
                                className="text-gray-400 group-hover:text-blue-500 transition-colors"
                            />
                            <span className="font-medium truncate">{folder.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2 mb-6">
            {folders.map(folder => (
                <button
                    key={folder.id}
                    onClick={() => onNavigate(folder.id)}
                    className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                >
                    <Folder
                        size={20}
                        className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                    <span className="font-medium">{folder.name}</span>
                </button>
            ))}
        </div>
    );
};

export default FolderGrid;