import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Btn from '@/components/common/Btn';
import { msg } from '@/lib/msg';
import NoRecords from '@/components/common/NoRecords';
import { useForm } from '@/hooks/use-form';
import Radio from '@/components/common/Radio';
import { ArticleType } from '@/data/article';
import { LuGlobe, LuImage, LuKey, LuLink, LuListX } from 'react-icons/lu';
import SafeHtml from '@/components/common/SafeHtml';
import { BsPatchQuestion } from 'react-icons/bs';
import { Modal } from '@/components/common/Modal';
import ArticleBulkUploadInstructions from './components/ArticleBulkUploadInstructions';
import { pickImageUrl } from './components/SimpleMediaPicker';
import { ArticleService } from '@/services/ArticleService';



interface ContentBlock {
    id: number;
    title: string;
    subtitle: string;
    category: string;
    subcategory: string;
    image: string;
    ogtitle: string;
    ogdescription: string;
    ogimage: string;
    keywords: string;
    focuskeyword: string;
    datetime: string;
    xcard: string;
    xtitle: string;
    xdescription: string;
    ximage: string;
    content: string;
    html: string;
}

const parseBlocks = (markdownText: string): ContentBlock[] => {
    if (!markdownText) return [];
    const lines = markdownText.split('\n');
    const blocksArray: ContentBlock[] = [];
    let currentBlock: ContentBlock | null = null;
    var id = 0;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check for directives
        if (trimmedLine.startsWith('@article')) {
            // Start a new block
            if (currentBlock) {
                currentBlock.html = mockMarkdownToHtml(currentBlock.content);
            }
            id = id + 1;
            currentBlock = {
                id: id,
                title: '',
                subtitle: '',
                category: '',
                subcategory: '',
                image: '',
                ogtitle: '',
                ogdescription: '',
                ogimage: '',
                keywords: '',
                datetime: '',
                focuskeyword: '',
                xcard: '',
                xtitle: '',
                xdescription: '',
                ximage: '',
                content: '',
                html: ''
            };
            blocksArray.push(currentBlock);
        } else if (!currentBlock) {
            continue;
        } else if (trimmedLine.startsWith('@category')) {
            currentBlock.category = trimmedLine.substring('@category'.length).trim();
        } else if (trimmedLine.startsWith('@subcategory')) {
            currentBlock.subcategory = trimmedLine.substring('@subcategory'.length).trim();
        } else if (trimmedLine.startsWith('@title')) {
            currentBlock.title = trimmedLine.substring('@title'.length).trim();
        } else if (trimmedLine.startsWith('@subtitle')) {
            currentBlock.subtitle = trimmedLine.substring('@subtitle'.length).trim();
        } else if (trimmedLine.startsWith('@focuskeyword')) {
            currentBlock.focuskeyword = trimmedLine.substring('@focuskeyword'.length).trim();
        } else if (trimmedLine.startsWith('@datetime')) {
            currentBlock.datetime = trimmedLine.substring('@datetime'.length).trim();
        } else if (trimmedLine.startsWith('@image')) {
            currentBlock.image = trimmedLine.substring('@image'.length).trim();
        } else if (trimmedLine.startsWith('@ogtitle')) {
            currentBlock.ogtitle = trimmedLine.substring('@ogtitle'.length).trim();
        } else if (trimmedLine.startsWith('@ogdescription')) {
            currentBlock.ogdescription = trimmedLine.substring('@ogdescription'.length).trim();
        } else if (trimmedLine.startsWith('@ogimage')) {
            currentBlock.ogimage = trimmedLine.substring('@ogimage'.length).trim();
        } else if (trimmedLine.startsWith('@keywords')) {
            currentBlock.keywords = trimmedLine.substring('@keywords'.length).trim();
        } else if (trimmedLine.startsWith('@xcard')) {
            currentBlock.xcard = trimmedLine.substring('@xcard'.length).trim();
        } else if (trimmedLine.startsWith('@xtitle')) {
            currentBlock.xtitle = trimmedLine.substring('@xtitle'.length).trim();
        } else if (trimmedLine.startsWith('@xdescription')) {
            currentBlock.xdescription = trimmedLine.substring('@xdescription'.length).trim();
        } else if (trimmedLine.startsWith('@ximage')) {
            currentBlock.ximage = trimmedLine.substring('@ximage'.length).trim();
        } else {
            currentBlock.content += (currentBlock.content ? '\n' : '') + line;
        }
    }
    if (currentBlock) {
        currentBlock.html = mockMarkdownToHtml(currentBlock.content);
    }
    return blocksArray;
};



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

const DetailItem: React.FC<{ icon: React.ReactNode, image?: boolean, label: string, value: string, fullWidth?: boolean, onClick?: () => void }> = ({ image, icon, label, value, fullWidth = false, onClick }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer flex flex-col text-xs space-y-0.5 p-2 rounded-lg bg-gray-50 border border-gray-100 transition duration-150 ease-in-out hover:bg-gray-100 ${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
    >
        <div className="flex items-center text-gray-500">
            {icon}
            <span className="font-semibold ml-1.5">{label}</span>
        </div>
        <span className="truncate text-gray-800 break-words" title={value}>{value}</span>
        {image && <div>
            <img src={value} />
        </div>}
    </div>
);

const BlockComponent = ({ block, onUpdate }: { block: ContentBlock, onUpdate: (key: string, value: string) => void }) => {
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(prev => !prev);
    };

    return (
        <div className="font-inter border border-gray-300 rounded-xl p-4 shadow-sm bg-white mb-6">

            {/* --- Header: Title, Subtitle, and Toggle Button --- */}
            <div className="flex justify-between items-start mb-4 border-b pb-3">
                <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-xs font-medium uppercase text-indigo-500 tracking-wider">
                        {block.category} / {block.subcategory}
                    </span>
                    <h3 className="text-xl font-extrabold truncate text-gray-900 mt-1" title={block.title}>
                        {block.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate mt-0.5" title={block.subtitle}>
                        {block.subtitle}
                    </p>
                </div>

                <button
                    onClick={toggleContent}
                    className="flex-shrink-0 flex items-center px-4 py-2 text-sm font-semibold rounded-full 
                                 transition duration-300 ease-in-out shadow-lg whitespace-nowrap
                                 bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105"
                    aria-expanded={showContent}
                >
                    {showContent ? (
                        <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hide Content
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            View Content
                        </>
                    )}
                </button>
            </div>

            {/* --- Metadata Section (Compact Grid) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">


                <DetailItem image={true} icon={<LuImage className="w-4 h-4" />} label="Main Image URL" value={block.image} onClick={async () => {
                    var image = await pickImageUrl();
                    onUpdate('image', image);
                }} />
                <DetailItem icon={<LuKey className="w-4 h-4" />} label="Keywords" value={block.keywords} />
                <DetailItem icon={<LuKey className="w-4 h-4" />} label="Focus Word" value={block.focuskeyword} />

                {/* Open Graph (OG) Fields */}
                <DetailItem icon={<LuGlobe className="w-4 h-4" />} label="OG Title" value={block.ogtitle} />
                <DetailItem icon={<LuGlobe className="w-4 h-4" />} label="OG Description" value={block.ogdescription} fullWidth={true} />
                <DetailItem image={true} icon={<LuGlobe className="w-4 h-4" />} label="OG Image URL" value={block.ogimage} onClick={async () => {
                    var image = await pickImageUrl();
                    onUpdate('ogimage', image);
                }} />

                {/* X (Twitter) Card Fields */}
                <DetailItem icon={<LuLink className="w-4 h-4" />} label="X Card Type" value={block.xcard} />
                <DetailItem icon={<LuLink className="w-4 h-4" />} label="X Title" value={block.xtitle} />
                <DetailItem icon={<LuLink className="w-4 h-4" />} label="X Description" value={block.xdescription} fullWidth={true} />
                <DetailItem image={true} icon={<LuLink className="w-4 h-4" />} label="X Image URL" value={block.ximage} onClick={async () => {
                    var image = await pickImageUrl();
                    onUpdate('ximage', image);
                }} />
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showContent ? 'max-h-screen opacity-100 pt-3' : 'max-h-0 opacity-0'}`}>
                <SafeHtml html={block.html} />
            </div>

        </div>
    );
};


export default function ArticleBulkUpload() {
    const [blocks, setBlocks] = useState<ContentBlock[]>([])
    const [form, setValue] = useForm({
        article_type: ArticleType.Blog
    });

    const [saving, setSaving] = useState(false);


    const save = async () => {
        msg.confirm('Confirm Bulk Create', 'This will bulk create articles', {
            onConfirm: async () => {
                var r = await ArticleService.bulkCreate({
                    article_type: form.article_type,
                    blocks: blocks.map(b => {
                        var { html, ...rest } = b;
                        return {
                            ...rest,
                            ogtitle: rest.ogtitle === 'same' ? rest.title : rest.ogtitle,
                            ogdescription: rest.ogdescription === 'same' ? rest.subtitle : rest.ogdescription,
                            ogimage: rest.ogimage === 'same' ? rest.image : rest.ogimage,
                            xtitle: rest.xtitle === 'same' ? rest.title : rest.xtitle,
                            xdescription: rest.xdescription === 'same' ? rest.subtitle : rest.xdescription,
                            ximage: rest.ximage === 'same' ? rest.image : rest.ximage,

                        };
                    })
                });
                if (r.success) {
                    msg.success('Details saved');
                }
                setSaving(false);

                return r.success;
            },
            onCancel: () => {
                setSaving(false);
            }
        })
        setSaving(true);

    }








    return (
        <div className="flex flex-col h-full min-h-0 antialiased bg-gray-50 font-sans">


            {/* Three Column Layout for Desktop, Stacked for Mobile */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">

                <div className=" flex flex-col border-r border-gray-300 bg-white md:max-h-full h-[33vh] md:h-full shadow-inner">
                    <div className='p-4 flex flex-row border-b  '>
                        <h2 className="flex-1 text-xl font-bold text-gray-700   m-0">1. Source (Markdown)</h2>
                        <Btn size={'xs'} variant={'destructive'} onClick={() => setBlocks(parseBlocks(form.content))}>Render</Btn>
                    </div>
                    <textarea
                        className="flex-1 p-5 text-base font-mono resize-none focus:outline-none focus:ring-4 focus:ring-indigo-200/50 transition duration-200 text-gray-800 leading-relaxed"
                        value={form.content}
                        onChange={(e) => setValue('content')(e.target.value)}
                        placeholder="Start writing your Markdown content here..."
                        spellCheck="false"
                    />
                </div>

                <div className=" flex flex-col border-r border-gray-300 bg-gray-100 overflow-y-auto md:max-h-full h-[33vh] md:h-full">
                    <div className='p-4 flex flex-row border-b   bg-white gap-3'>
                        <h2 className="flex-1 text-xl font-bold text-gray-700 m-0">2. Rendered Data</h2>
                        <Btn size={'xs'} variant={'outline'} onClick={() => {
                            Modal.show({
                                title: 'Instructions',
                                maxWidth: 500,
                                content: () => <ArticleBulkUploadInstructions />
                            })
                        }}><BsPatchQuestion />Instructions</Btn>
                    </div>
                    {blocks.length == 0 && <NoRecords icon={LuListX} title='No Articles Parsed' subtitle='Try adding articles according to the instructions' />}
                    <div className='flex flex-col gap-3 p-3'>
                        {blocks.map((block) => (
                            <BlockComponent
                                key={block.id}
                                block={block}
                                onUpdate={(key, value) => {
                                    setBlocks(prev =>
                                        prev.map(b => (b.id === block.id ? { ...b, [key]: value } : b))
                                    );
                                }}
                            />
                        ))}

                    </div>
                </div>


            </div>
            <div className='bg-white border-t p-2 flex flex-row items-end gap-3'>
                <Radio value={form.article_type} onChange={setValue('article_type')} options={[{ id: ArticleType.Blog, name: 'Blog' }, { id: ArticleType.News, name: 'News' }]}>
                    Article Type
                </Radio>
                <div className='ms-auto'>
                    <Btn loading={saving} onClick={save} size={'sm'} disabled={blocks.length == 0}>Bulk Create</Btn>
                </div>
            </div>
        </div>
    );
};

