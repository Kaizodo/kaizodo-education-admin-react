import { useState, useMemo, useEffect, useRef } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import FileDrop from '@/components/common/FileDrop';
import { useDebounce } from '@/hooks/use-debounce';
import { useSetValue } from '@/hooks/use-set-value';
import { MediaManagerService } from '@/services/MediaManagerService';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { Progress } from '@/components/ui/progress';
import { MediaManagerItem, MediaType } from '@/components/common/media-manager/media';
import { copyToClipboard } from '@/lib/utils';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { FeatureCardService } from '@/services/FeatureCardService';
import { useForm } from '@/hooks/use-form';



interface ContentBlock {
    title: string;
    subtitle: string;
    image: string;
    content: string;
}

const parseMarkdownAndRender = (markdownText: string): string => {
    if (!markdownText) return '';
    const lines = markdownText.split('\n');
    const blocksArray: ContentBlock[] = [];
    let currentBlock: ContentBlock | null = null;

    // --- STEP 1: PARSING MARKDOWN TO JAVASCRIPT OBJECT ARRAY ---
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check for directives
        if (trimmedLine.startsWith('@block')) {
            // Start a new block
            if (currentBlock) {
                currentBlock.content = mockMarkdownToHtml(currentBlock.content);
            }
            currentBlock = { title: '', subtitle: '', image: '', content: '' };
            blocksArray.push(currentBlock);
        } else if (!currentBlock) {
            // Ignore content if no block has been started yet
            continue;
        } else if (trimmedLine.startsWith('@title')) {
            currentBlock.title = trimmedLine.substring('@title'.length).trim();
        } else if (trimmedLine.startsWith('@subtitle')) {
            currentBlock.subtitle = trimmedLine.substring('@subtitle'.length).trim();
        } else if (trimmedLine.startsWith('@image')) {
            currentBlock.image = trimmedLine.substring('@image'.length).trim();
        } else {
            // Rich Content for the current block
            // Append content, maintaining line breaks
            currentBlock.content += (currentBlock.content ? '\n' : '') + line;
        }
    }

    // --- STEP 2: RENDERING OBJECT ARRAY BACK TO HTML PREVIEW ---

    // Handle empty content block array
    if (blocksArray.length === 0) {
        return '<div class="p-6 text-xl text-center text-gray-500 bg-gray-200 rounded-lg m-4">Start defining your structured content blocks using "@block"</div>';
    }

    const htmlBlocks = blocksArray.map((block, index) => {




        // Determine image order (alternating layout for visual appeal)
        const isImageFirst = index % 2 === 0;
        const imageOrderClass = isImageFirst ? 'lg:order-1' : 'lg:order-2';
        const contentOrderClass = isImageFirst ? 'lg:order-2' : 'lg:order-1';

        return `
      <div class="bg-white p-6 rounded-xl shadow-2xl mb-8 transition-all duration-300 hover:shadow-3xl border border-indigo-50">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <!-- Image Column -->
          <div class="order-1 ${imageOrderClass}">
            <img 
              src="${block.image}" 
              alt="${block.title} image" 
              class="w-full h-auto"
              onerror="this.onerror=null; this.src='https://placehold.co/400x300/ef4444/white?text=Image+Load+Failed';"
            />
          </div>

          <!-- Text Content Column -->
          <div class="order-2 ${contentOrderClass} space-y-3">
            <p class="text-sm font-bold tracking-widest uppercase text-indigo-600">${block.subtitle}</p>
            <h3 class="text-3xl font-extrabold text-gray-900 leading-tight">${block.title}</h3>
            
            <!-- Rich Text Content -->
            <div class="text-gray-700 text-base space-y-3 pt-2 prose max-w-none">
              ${block.content}
            </div>
          </div>
        </div>
      </div>
    `;
    }).join('');

    return `<div class="p-4">${htmlBlocks}</div>`;
};



// --- Utility Functions (Simulating external libraries for security and rendering) ---

/**
 * Mocks the 'marked' library functionality.
 * @param markdownText - The markdown string to render.
 * @returns HTML string.
 */
const mockMarkdownToHtml = (markdownText: string): string => {
    if (!markdownText) return '';
    let html = markdownText.replace(/\n\n/g, '</p><p>'); // Simple paragraphs
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg shadow-md max-w-full h-auto mt-4 mb-4"/>'); // Images
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>'); // Bold
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    html = html.replace(/^(#+)\s*(.*)/gm, (_, hashes, content) => { // Headers
        const level = hashes.length > 6 ? 6 : hashes.length;
        let sizeClass = level === 1 ? 'text-2xl' : level === 2 ? 'text-xl' : 'text-lg';
        return `<h${level} class="mt-6 mb-3 ${sizeClass} font-extrabold text-gray-800 border-b pb-1">${content}</h${level}>`;
    });
    // Handle list items (simple simulation)
    html = html.replace(/^- (.*)/gm, (_, content) => {
        return `<li class="ml-4 list-disc">${content}</li>`;
    });

    return `<div class="prose max-w-none text-gray-800">${html}</div>`;
};

/**
 * Mocks DOMPurify.sanitize for security.
 * @param html - The HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
const mockSanitize = (html: string): string => {
    // In a real app: return DOMPurify.sanitize(html);
    return html;
};

// --- Main App Component ---

export default function FeatureCardContentEditor({ id }: { id: number }) {
    const [form, setValue, setForm] = useForm();
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

    const [saving, setSaving] = useState(false);


    const save = async () => {
        setSaving(true);
        var r = await FeatureCardService.saveContent(form);
        if (r.success) {
            msg.success('Details saved');
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await FeatureCardService.loadContent(id);
        if (r.success) {
            setForm(r.data.record);
            setCategories(r.data.media_manager_categories);
            setFilter('media_manager_category_id')(r.data?.media_manager_categories?.[0]?.id);
            setLoading(false);
        }

    }

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


    useEffect(() => {
        load();
    }, [])





    // Markdown Rendering
    const renderedHtml = useMemo(() => {
        const rawHtml = parseMarkdownAndRender(form.content);
        return mockSanitize(rawHtml);
    }, [form]);


    if (loading) {
        return <CenterLoading className='relative h-[400px]' />
    }

    return (
        <>
            <ModalBody className='p-0'>
                <div className="flex flex-col h-full min-h-0 antialiased bg-gray-50 font-sans">


                    {/* Three Column Layout for Desktop, Stacked for Mobile */}
                    <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4">

                        {/* Column 1: Markdown Editor */}
                        <div className=" flex flex-col border-r border-gray-300 bg-white md:max-h-full h-[33vh] md:h-full shadow-inner">
                            <h2 className="p-4 text-xl font-bold text-gray-700 border-b border-gray-200 bg-gray-50">1. Source (Markdown)</h2>
                            <textarea
                                className="flex-1 p-5 text-base font-mono resize-none focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition duration-200 text-gray-800 leading-relaxed"
                                value={form.content}
                                onChange={(e) => setValue('content')(e.target.value)}
                                placeholder="Start writing your Markdown content here..."
                                spellCheck="false"
                            />
                        </div>

                        {/* Column 2: Live Preview */}
                        <div className="col-span-2 flex flex-col border-r border-gray-300 bg-gray-100 overflow-y-auto md:max-h-full h-[33vh] md:h-full">
                            <h2 className="p-4 text-xl font-bold text-gray-700 border-b border-gray-200 bg-gray-50">2. Preview (Rendered HTML)</h2>

                            <div
                                className="p-5 flex-1 text-base overflow-y-auto leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: renderedHtml }}
                            />
                        </div>

                        {/* Column 3: Image Asset Manager */}
                        <div className="flex flex-col bg-white overflow-y-auto md:max-h-full h-[34vh] md:h-full shadow-inner">
                            <h2 className="p-4 text-xl font-bold text-gray-700 border-b border-gray-200 bg-gray-50">3. Asset Manager</h2>
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
                                        <li key={media.id} className="flex flex-col sm:flex-row items-start sm:items-center p-3 gap-3 bg-gray-50 rounded-lg shadow-md border border-gray-200 transition hover:shadow-lg duration-150">
                                            {media.media_type == MediaType.Image && <div>
                                                <img src={media.media_path} width={50} />
                                            </div>}
                                            <div className="flex-1 min-w-0 pr-3 mb-2 sm:mb-0">
                                                <span className="text-sm font-medium text-indigo-700 truncate block">{media.media_name}</span>
                                                <span className="text-xs text-gray-500 truncate block">{media.media_path.substring(0, 40)}...</span>
                                            </div>
                                            <div className="flex space-x-2 flex-shrink-0">
                                                <button
                                                    onClick={() => {
                                                        copyToClipboard(media.media_path);
                                                        msg.success('Url copied');
                                                    }}
                                                    title="Copy Markdown Link (Mock)"
                                                    className="p-2 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-300 transition duration-150 shadow-sm"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { }}
                                                    title="Delete Asset (Mock)"
                                                    className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-300 transition duration-150 shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>}

                                <Pagination paginated={paginated} onChange={setFilter('page', 'debounce')} />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter><Btn loading={saving} onClick={save} size={'sm'}>Save Details</Btn></ModalFooter>
        </>
    );
};

