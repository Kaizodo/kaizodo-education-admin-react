import { MediaManagerItem, MediaManagerItemCategory, MediaManagerOptions, MediaType, mediaTypeToString } from "@/components/common/media-manager/media"
import { useCallback, useEffect, useState } from "react";
import { Check, Filter, FolderPlus, Grid, List, Search, Trash2, UploadCloud, X } from "lucide-react";
import React from "react";
import { useMediaSelection } from "./hooks/useMediaSelection";
import FolderGrid from "./components/FolderGrid";
import MediaItem from "./components/MediaItem";
import MediaManagerPagination from "./components/MediaManagerPagination";
import MediaPreviewModal from "./components/MediaPreviewModal";
import MediaManagerBreadcrumb from "./components/MediaManagerBreadcrumb";
import { Modal, ModalBody, ModalFooter } from "../Modal";
import TextField from "../TextField";
import Btn from "../Btn";
import { MediaManagerService } from "@/services/MediaManagerService";
import { useSetValue } from "@/hooks/use-set-value";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import CenterLoading from "../CenterLoading";
import { msg } from "@/lib/msg";
import { Progress } from "@/components/ui/progress";
import { useCropper } from "@/hooks/use-cropper";
import { pickFileVirtually } from "@/lib/utils";







type MediaManagerComponentProps = {
    options: MediaManagerOptions,
    callback: (media: MediaManagerItem[]) => void,
    onClose?: () => void
}

type Uploads = {
    file?: File,
    url?: string,
    media_path: string,
    media_name: string,
    media_size: number,
    media_type: MediaType,
    id: number,
    uploading?: boolean,
    uploaded?: boolean,
    deleting?: boolean,
    progress?: number
}

export default function MediaManagerComponent({
    options,
    callback,
    onClose
}: MediaManagerComponentProps) {
    const { openCropperUrl } = useCropper();
    const [paginated, setPaginated] = useState<PaginationType<MediaManagerItem>>(getDefaultPaginated());
    const [folders, setFolders] = useState<MediaManagerItemCategory[]>([]);
    const [uploads, setUploads] = useState<Uploads[]>([])
    const [filters, setFilters] = useState<any>({
        debounce: true,
        page: 1,
        per_page: 20,
        keyword: "",
        media_type: MediaType.All,
        media_manager_category_id: undefined
    });
    const setFilter = useSetValue(setFilters);
    const [searching, setSearching] = useState(true);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await MediaManagerService.ls(filters);
        if (r.success) {
            setPaginated(r.data.files);
            setFolders(prev => {
                const existingIds = new Set(prev.map(f => f.id));
                const newFolders = r.data.folders.filter((f: MediaManagerItemCategory) => !existingIds.has(f.id));
                return [...prev, ...newFolders];
            });

        }
        setSearching(false);
    }


    // Handle file upload
    const handleFileUpload = (f: FileList) => {
        const files: File[] = Array.from(f);
        const newUploads = [
            ...uploads,
            ...files.map((f, i) => ({
                file: f,
                media_name: f.name,
                id: new Date().getTime() + i,
                media_type: MediaType.Document,
                media_size: f.size,
                media_path: f.name
            }))
        ]
        setUploads(() => newUploads);
        beginUpload(filters.media_manager_category_id, newUploads);
    }

    // Handle file drop
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files: File[] = Array.from(e.dataTransfer.files || []);
            const newUploads = [
                ...uploads,
                ...files.map((f, i) => ({
                    file: f,
                    media_name: f.name,
                    id: new Date().getTime() + i,
                    media_type: MediaType.Document,
                    media_size: f.size,
                    media_path: f.name
                }))
            ]
            setUploads(() => newUploads);
            beginUpload(filters.media_manager_category_id, newUploads);
        }
    }, []);


    const beginUpload = async (media_manager_category_id: number, uploads: Uploads[]) => {
        var upload = uploads.find(f => !f.uploaded);
        if (!upload) {
            setUploads([]);
            return;
        }
        var file = upload.file;
        if (!file) {
            return;
        }
        setUploads(fs => fs.map(f => (f.id == upload?.id ? { ...f, uploading: true, uploaded: false, progress: 0 } : f)));
        var r = await MediaManagerService.upload({
            file,
            media_manager_category_id
        }, (p) => {
            setUploads(fs => fs.map(f => (f.id == upload?.id ? { ...f, progress: p } : f)));
        });
        upload.uploaded = true;
        if (r.success) {
            setPaginated(p => ({ ...p, records: [...p.records, r.data.file] }))
        }
        await beginUpload(media_manager_category_id, uploads);

    }



    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters])



    const [
        maxSelection,
    ] = useState(20);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewItem, setPreviewItem] = useState<MediaManagerItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [currentFolder, setCurrentFolder] = useState<number | null>(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selecting, setSelecting] = useState(false);
    const {
        selectedItems,
        toggleSelection,
        clearSelection,
        isSelected,
        selectedCount
    } = useMediaSelection();


    const getCurrentPath = (media_manager_category_id: number | null): MediaManagerItemCategory[] => {
        const path: MediaManagerItemCategory[] = [];
        let current = media_manager_category_id;
        while (current !== null) {
            const folder = folders.find(f => f.id === current);
            if (folder) {
                path.unshift(folder);
                current = folder.media_manager_category_id;
            } else {
                break;
            }
        }
        return path;
    };







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


    // Handle apply selection
    const handleApplySelection = async () => {
        const selectedMediaItems = paginated.records.filter(item => selectedItems.has(item.id));

        if (!options.multiple && selectedMediaItems.length > 1) {
            msg.warning('Please select only 1 media');
            return;
        }

        if (!options.multiple && selectedMediaItems.length > 0) {
            var file = selectedMediaItems[0];
            if (file.media_type == MediaType.Image && options.aspectRatio) {
                if (file.aspect_ratio !== options.aspectRatio) {
                    setSelecting(true);
                    const croppedResult = await openCropperUrl(file.media_path, {
                        format: 'file'
                    });

                    if (croppedResult instanceof File) {
                        console.log(croppedResult);
                    }
                }
            }
        }

        callback(selectedMediaItems);
    }

    // Handle delete
    const handleDelete = useCallback(() => {
        if (selectedItems.size > 0) {
            msg.confirm('Delete selected items ?', `Are you sure you want to delete ${selectedItems.size} item(s)?`, {
                onConfirm: async () => {
                    var r = await MediaManagerService.rmfile([...selectedItems]);
                    if (r.success) {
                        setPaginated(p => ({ ...p, records: p.records.filter(px => ![...selectedItems].includes(px.id)) }))
                        msg.success('Files deleted');
                        clearSelection();
                        return true;
                    } else {
                        return false;
                    }
                }
            })
        }
    }, [selectedItems, clearSelection]);





    // Handle folder navigation
    const handleFolderNavigation = useCallback((folderId: number | null) => {
        setFilter('media_manager_category_id', 'debounce')(folderId, false);
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
        <div className="bg-white max-h-[95vh] rounded-xl flex-1  shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full relative">

            {uploads.length > 0 && <div className="space-y-4 p-4 absolute w-full h-full z-[9999] bg-sky-50">
                {uploads.map((upload, idx) => (
                    <div key={idx} className="rounded-2xl shadow p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">{upload.media_name}</span>
                            {upload.uploaded ? (
                                <span className="text-green-500 text-xs">Uploaded</span>
                            ) : (
                                <span className="text-blue-500 text-xs">Uploading</span>
                            )}
                        </div>
                        <Progress value={upload.progress} className="h-2" />
                        <div className="text-xs text-right mt-1">{upload.progress}%</div>
                    </div>
                ))}
            </div>}

            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-lg font-semibold">Media Manager</h2>

                    {/* Search */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}
                            placeholder="Search media..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        {!!filters.keyword && (
                            <button
                                onClick={() => setFilter('keyword', 'debounce')('', false)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* View toggle */}
                    <div className="self-end sm:self-auto flex gap-2">
                        <div className="flex bg-gray-100 rounded-lg p-1">
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
                        {!!onClose && <Btn size={'sm'} variant={'outline'} onClick={onClose}><X /></Btn>}
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="mt-3">
                    <MediaManagerBreadcrumb
                        folders={folders}
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
                            onClick={() => setFilter('media_type', 'debounce')(option.type, false)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.media_type === option.type
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
                className={`flex-grow flex-1 overflow-auto p-4 ${isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
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

                {!!searching && <CenterLoading className='relative h-[400px]' />}

                {!searching && <FolderGrid
                    folders={folders.filter(f => f.media_manager_category_id == filters.media_manager_category_id)}
                    onNavigate={handleFolderNavigation}
                    view={viewMode}
                />}

                {paginated.records.length === 0 && !searching ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            {filters.media_type === MediaType.All ? (
                                <UploadCloud size={48} />
                            ) : (
                                <div className="text-gray-400">
                                    No {mediaTypeToString(filters.media_type).toLowerCase()} files found
                                </div>
                            )}
                        </div>
                        <p className="text-lg mb-1">No media items found</p>
                        <p className="text-sm text-gray-400 mb-4">
                            {!!filters.keyword ? 'Try a different search keyword' : 'Upload some files to get started'}
                        </p>

                        <div className="flex gap-2">

                            <Btn

                                onClick={async () => {
                                    const files = await pickFileVirtually(true);
                                    handleFileUpload(files);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <UploadCloud size={18} className="mr-2" />
                                Upload Files
                            </Btn>
                            <Btn
                                onClick={() => {
                                    const new_folder_modal_id = Modal.show({
                                        title: 'New Folder',
                                        content: () => {
                                            const [creating, setCreating] = useState(false);
                                            const [folderName, setFolderName] = useState('');
                                            return <>
                                                <ModalBody>
                                                    <TextField value={folderName} onChange={setFolderName}>Enter folder name</TextField>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Btn
                                                        loading={creating}
                                                        onClick={async () => {
                                                            if (!folderName) {
                                                                msg.warning('Folder name is required');
                                                                return;
                                                            }
                                                            setCreating(true);
                                                            var r = await MediaManagerService.mkdir({
                                                                name: folderName,
                                                                media_type: filters.media_type || MediaType.All,
                                                                media_manager_category_id: filters.media_manager_category_id
                                                            });
                                                            if (r.success) {
                                                                Modal.close(new_folder_modal_id)
                                                            }
                                                            setCreating(false);
                                                        }}>Create</Btn>
                                                </ModalFooter>
                                            </>
                                        }
                                    })

                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                            >
                                <FolderPlus size={18} className="mr-2" />
                                New Folder
                            </Btn>
                        </div>
                    </div>
                ) : (
                    !searching && <div className={viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4'
                        : 'space-y-2'
                    }>
                        {paginated.records.map(item => (
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
            {paginated.pages > 1 && <div className="border-t border-gray-200 p-4 mt-auto">
                <MediaManagerPagination
                    currentPage={currentPage}
                    totalPages={paginated.pages}
                    onPageChange={setCurrentPage}
                />
            </div>}

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
                                {paginated.total} item{paginated.total !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">

                        <Btn
                            size={'sm'}
                            onClick={async () => {
                                const files = await pickFileVirtually(true);
                                handleFileUpload(files);
                            }}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm flex items-center"
                        >
                            <UploadCloud size={16} className="mr-2" />
                            Upload
                        </Btn>

                        {/* Delete button */}
                        <Btn
                            size={'sm'}
                            onClick={handleDelete}
                            className="px-3 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm flex items-center"
                        >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                        </Btn>

                        {/* Select/Apply button */}
                        <Btn
                            size={'sm'}
                            onClick={handleApplySelection}
                            loading={selecting}
                            disabled={selectedCount === 0 || selecting}
                            className={`px-4 py-1.5 rounded text-white text-sm flex items-center ${selectedCount === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            <Check size={16} className="mr-2" />
                            Done
                        </Btn>
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
    )
}
