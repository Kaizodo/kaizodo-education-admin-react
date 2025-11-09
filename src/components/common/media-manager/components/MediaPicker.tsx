import React, { useState, useCallback, useMemo } from 'react';
import {
    Search,
    Grid,
    List,
    Filter,
    X,
    Check,
    UploadCloud,
    Trash2,
    FolderPlus
} from 'lucide-react';
import MediaItem from './MediaItem';
import MediaPreviewModal from './MediaPreviewModal';
import Breadcrumb from './MediaManagerBreadcrumb';
import FolderGrid from './FolderGrid';
import Pagination from './MediaManagerPagination';
import { MediaManagerItem, MediaManagerItemCategory, MediaType, mediaTypeToString } from '../media';
import { sampleFolders } from '@/data/sampleMedia';
import { useMediaSelection } from '../hooks/useMediaSelection';

interface MediaPickerProps {
    items: MediaManagerItem[];
    onSelectMedia?: (selectedItems: MediaManagerItem[]) => void;
    onDeleteMedia?: (itemIds: number[]) => void;
    onUploadMedia?: (files: FileList) => void;
    maxSelection?: number;
    initialSelectedIds?: number[];
    itemsPerPage?: number;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
    items = [],
    onSelectMedia,
    onDeleteMedia,
    onUploadMedia,
    maxSelection = Infinity,
    itemsPerPage = 20
}) => {
    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<MediaType>(MediaType.All);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewItem, setPreviewItem] = useState<MediaManagerItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [currentFolder, setCurrentFolder] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Selection management
    const {
        selectedItems,
        toggleSelection,
        clearSelection,
        isSelected,
        selectedCount
    } = useMediaSelection();

    // Get current folder path
    const getCurrentPath = useCallback((media_manager_category_id: number | null): MediaManagerItemCategory[] => {
        const path: MediaManagerItemCategory[] = [];
        let current = media_manager_category_id;

        while (current !== null) {
            const folder = sampleFolders.find(f => f.id === current);
            if (folder) {
                path.unshift(folder);
                current = folder.media_manager_category_id;
            } else {
                break;
            }
        }

        return path;
    }, []);

    // Get folders for current level
    const currentFolders = useMemo(() => {
        return sampleFolders.filter(folder => folder.media_manager_category_id === currentFolder);
    }, [currentFolder]);

    // Filter and search items
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Apply folder filter
            const folderMatch = item.media_manager_category_id === currentFolder;

            // Apply type filter
            const typeMatch = activeFilter === MediaType.All || item.media_type === activeFilter;

            // Apply search filter
            const searchMatch = searchTerm === '' ||
                item.media_name.toLowerCase().includes(searchTerm.toLowerCase());

            return folderMatch && typeMatch && searchMatch;
        });
    }, [items, currentFolder, activeFilter, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle selection
    const handleSelect = useCallback((id: number) => {
        if (selectedItems.has(id)) {
            toggleSelection(id);
        } else {
            if (selectedItems.size < maxSelection) {
                toggleSelection(id);
            } else {
                alert(`You can only select up to ${maxSelection} items`);
            }
        }
    }, [selectedItems, toggleSelection, maxSelection]);

    // Get selected media items
    const selectedMediaItems = useMemo(() => {
        return items.filter(item => selectedItems.has(item.id));
    }, [items, selectedItems]);

    // Handle apply selection
    const handleApplySelection = useCallback(() => {
        onSelectMedia?.(selectedMediaItems);
    }, [onSelectMedia, selectedMediaItems]);

    // Handle delete
    const handleDelete = useCallback(() => {
        if (selectedItems.size > 0) {
            const confirmed = window.confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`);
            if (confirmed) {
                onDeleteMedia?.(Array.from(selectedItems));
                clearSelection();
            }
        }
    }, [selectedItems, onDeleteMedia, clearSelection]);

    // Handle file drop
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUploadMedia?.(e.dataTransfer.files);
        }
    }, [onUploadMedia]);

    // Handle file upload
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onUploadMedia?.(e.target.files);
        }
    }, [onUploadMedia]);

    // Handle folder navigation
    const handleFolderNavigation = useCallback((folderId: number | null) => {
        setCurrentFolder(folderId);
        setCurrentPage(1); // Reset pagination when changing folders
    }, []);

    // Filter options
    const filterOptions = [
        { type: MediaType.All, label: 'All' },
        { type: MediaType.Image, label: 'Images' },
        { type: MediaType.Video, label: 'Videos' },
        { type: MediaType.Document, label: 'Documents' },
        { type: MediaType.Audio, label: 'Audio' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-lg font-semibold">Media Manager</h2>

                    {/* Search */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search media..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* View toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 self-end sm:self-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="mt-3">
                    <Breadcrumb
                        folders={sampleFolders}
                        currentPath={getCurrentPath(currentFolder)}
                        onNavigate={handleFolderNavigation}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
                    <Filter size={18} className="text-gray-400 flex-shrink-0" />
                    {filterOptions.map(option => (
                        <button
                            key={option.type}
                            onClick={() => setActiveFilter(option.type)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${activeFilter === option.type
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Media grid with drag & drop zone */}
            <div
                className={`flex-grow overflow-auto p-4 ${isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                    }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90 z-10 pointer-events-none">
                        <div className="text-center">
                            <UploadCloud size={48} className="mx-auto text-blue-500 mb-2" />
                            <p className="text-lg font-medium text-blue-700">Drop files to upload</p>
                        </div>
                    </div>
                )}

                {/* Folders */}
                <FolderGrid
                    folders={currentFolders}
                    onNavigate={handleFolderNavigation}
                    view={viewMode}
                />

                {paginatedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            {activeFilter === MediaType.All ? (
                                <UploadCloud size={48} />
                            ) : (
                                <div className="text-gray-400">
                                    No {mediaTypeToString(activeFilter).toLowerCase()} files found
                                </div>
                            )}
                        </div>
                        <p className="text-lg mb-1">No media items found</p>
                        <p className="text-sm text-gray-400 mb-4">
                            {searchTerm ? 'Try a different search keyword' : 'Upload some files to get started'}
                        </p>

                        {onUploadMedia && (
                            <div className="flex gap-2">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        multiple
                                        onChange={handleFileUpload}
                                    />
                                    <div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                                        <UploadCloud size={18} className="mr-2" />
                                        Upload Files
                                    </div>
                                </label>
                                <button
                                    onClick={() => {
                                        const name = prompt('Enter folder name:');
                                        if (name) {
                                            // Handle folder creation
                                            console.log('Create folder:', name);
                                        }
                                    }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                >
                                    <FolderPlus size={18} className="mr-2" />
                                    New Folder
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                        : 'space-y-2'
                    }>
                        {paginatedItems.map(item => (
                            <MediaItem
                                key={item.id}
                                item={item}
                                isSelected={isSelected(item.id)}
                                onSelect={handleSelect}
                                onPreview={setPreviewItem}
                                view={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 p-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {selectedCount > 0 ? (
                            <>
                                <span className="text-sm font-medium">
                                    {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={clearSelection}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Clear
                                </button>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500">
                                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* File upload button */}
                        {onUploadMedia && (
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    onChange={handleFileUpload}
                                />
                                <div className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm flex items-center">
                                    <UploadCloud size={16} className="mr-2" />
                                    Upload
                                </div>
                            </label>
                        )}

                        {/* Delete button */}
                        {onDeleteMedia && selectedCount > 0 && (
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm flex items-center"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                            </button>
                        )}

                        {/* Select/Apply button */}
                        {onSelectMedia && (
                            <button
                                onClick={handleApplySelection}
                                disabled={selectedCount === 0}
                                className={`px-4 py-1.5 rounded text-white text-sm flex items-center ${selectedCount === 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                <Check size={16} className="mr-2" />
                                Apply Selection
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview modal */}
            {previewItem && (
                <MediaPreviewModal
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                />
            )}
        </div>
    );
};

export default MediaPicker;