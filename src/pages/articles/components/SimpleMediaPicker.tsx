import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import FileDrop from "@/components/common/FileDrop";
import { MediaManagerItem, MediaType } from "@/components/common/media-manager/media";
import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import { Progress } from "@/components/ui/progress";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useSetValue } from "@/hooks/use-set-value";
import { MediaManagerCategoryService } from "@/services/MediaManagerCategoryService";
import { MediaManagerService } from "@/services/MediaManagerService";
import { useEffect, useRef, useState } from "react";
import { LuArrowRight } from "react-icons/lu";

export default function SimpleMediaPicker({ onSelect }: { onSelect: (image: string) => void }) {
    const [loading, setLoading] = useState(true);

    const [searching, setSearching] = useState(false);
    const [categories, setCategories] = useState<{
        id: number,
        name: string
    }[]>([])
    const uploadingRef = useRef(false);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        media_manager_category_id?: number,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });

    const [uploads, setUploads] = useState<{
        id: number,
        file: File,
        progress: number,
        uploading: boolean,
        uploaded: boolean
    }[]>([]);



    const load = async () => {
        setLoading(true);
        var r = await MediaManagerCategoryService.all();
        if (r.success) {
            setCategories(r.data);
            setFilter('media_manager_category_id')(r.data?.[0]?.id);
        }
        setLoading(false);
    }



    useEffect(() => {
        load();
    }, [])


    const beginUpload = async (upload_index: number) => {
        if (uploadingRef.current) return;

        const upload = uploads[upload_index];
        if (!upload || upload.uploaded || upload.uploading) return;

        uploadingRef.current = true;

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = { ...updated[upload_index], uploading: true, progress: 0 };
            return updated;
        });

        const r = await MediaManagerService.upload({
            media: upload.file,
            media_manager_category_id: filters.media_manager_category_id,
        }, (progress: number) => {
            setUploads(prev => {
                const updated = [...prev];
                updated[upload_index] = { ...updated[upload_index], progress };
                return updated;
            });
        });

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = {
                ...updated[upload_index],
                uploading: false,
                uploaded: !!r.success,
                progress: r.success ? 100 : updated[upload_index].progress
            };
            return updated;
        });

        uploadingRef.current = false;

        // check if any remaining uploads
        const latestUploads = [...uploads]; // read stale-free snapshot
        const nextIndex = latestUploads.findIndex((u, idx) => idx > upload_index && !u.uploaded && !u.uploading);

        if (nextIndex !== -1) {
            beginUpload(nextIndex);
        } else {
            // all uploads done
            setUploads([]);
            search(); // call after all uploads done
        }
    };

    useEffect(() => {
        if (!uploadingRef.current) {
            const nextIndex = uploads.findIndex(u => !u.uploaded && !u.uploading);
            if (nextIndex !== -1) beginUpload(nextIndex);
        }
    }, [uploads]);


    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await MediaManagerService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {

        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);


    if (loading) {
        return <CenterLoading className='relative h-[400px]' />
    }

    return (
        <>

            <ModalBody>
                <div className='p-3'>
                    <FileDrop
                        size='sm'
                        onChange={(files) => setUploads(ups => ([...ups, ...files.map((f, fi) => ({
                            id: new Date().getTime() + fi,
                            file: f,
                            progress: 0,
                            uploading: false,
                            uploaded: false
                        }))]))} />
                    {uploads.map((upload, upload_index) => <div key={'upload_' + upload_index} className="border rounded-lg p-1">
                        <div>{upload.file.name}</div>
                        <div className="flex flex-row items-center">
                            <Progress value={upload.progress} className="h-2 flex-1" />
                            <div className="w-6 text-xs text-center">{upload.progress}%</div>
                        </div>
                    </div>)}
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setFilter('media_manager_category_id ', 'debounce')(category.id)}
                            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md ${filters.media_manager_category_id === category.id
                                ? 'bg-primary text-white ring-4 ring-indigo-300'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            <span className="ml-2">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Image List */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-600 border-b pb-2">Static Assets ({paginated.records.length})</h3>
                    {searching && <CenterLoading className='relative h-[200px]' />}
                    {!searching && paginated.records.length == 0 && <NoRecords className='No Media Found' subtitle='Try uploading some files' />}

                    {!searching && <ul className="space-y-3">
                        {paginated.records.map((media: MediaManagerItem) => (
                            <li key={media.id} className=" cursor-pointer flex flex-col sm:flex-row items-start sm:items-center p-3 gap-3 bg-gray-50 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg duration-150">
                                {media.media_type == MediaType.Image && <div>
                                    <img src={media.media_path} width={50} />
                                </div>}
                                <div className="flex-1 min-w-0 pr-3 mb-2 sm:mb-0">
                                    <span className="text-sm font-medium text-indigo-700 truncate block">{media.media_name}</span>
                                    <span className="text-xs text-gray-500 truncate block">{media.media_path.substring(0, 40)}...</span>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <Btn variant={'outline'} size={'xs'} onClick={() => onSelect(media.media_path)}>Select <LuArrowRight /></Btn>
                                </div>
                            </li>
                        ))}
                    </ul>}


                </div>
            </ModalBody>
            <ModalFooter><Pagination paginated={paginated} onChange={setFilter('page', 'debounce')} /></ModalFooter>
        </>
    )
}


export async function pickImageUrl(): Promise<string> {
    return new Promise((resolve) => {
        const modal_id = Modal.show({
            title: 'Pick image',
            subtitle: 'Pick or upload images',
            maxWidth: 500,
            onClose: () => resolve(''),
            content: () => <SimpleMediaPicker onSelect={(image) => {
                resolve(image);
                Modal.close(modal_id);
            }} />
        })
    })
}