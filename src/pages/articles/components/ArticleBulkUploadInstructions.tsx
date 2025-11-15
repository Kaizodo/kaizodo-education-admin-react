import Btn from '@/components/common/Btn';
import Dropdown from '@/components/common/Dropdown';
import { ModalBody } from '@/components/common/Modal';
import TextField from '@/components/common/TextField';
import { ArticleType } from '@/data/article';
import { useForm } from '@/hooks/use-form';
import { msg } from '@/lib/msg';
import { ReactNode } from 'react';
import { LuCopy } from 'react-icons/lu';

export default function ArticleBulkUploadInstructions() {
    const [form, setValue] = useForm();
    const InstructionItem = ({ name, children }: { name: string, children: ReactNode }) => {
        return (<div className='flex flex-row gap-3 items-center'>
            <span className='text-blue-600 font-medium text-sm text-nowrap flex min-w-[100px]'>{name}</span>
            <div className='text-xs'>
                {children}
            </div>
        </div>);
    }

    const handleCopy = (e: React.MouseEvent) => {
        const parent = (e.currentTarget as HTMLElement).closest(".copy-block");
        if (!parent) return;
        const text = parent.textContent;
        msg.success('Props copied');
        navigator.clipboard.writeText(text);
    };

    return <>
        <ModalBody>
            <InstructionItem name='New Article'>
                <b>@article</b> will create a new article
            </InstructionItem>
            <InstructionItem name='Article Title'>
                <b>@title</b> will set the article title
            </InstructionItem>
            <InstructionItem name='Subtitle'>
                <b>@subtitle</b> will set the article subtitle
            </InstructionItem>
            <InstructionItem name='Date & Time'>
                <b>@datetime</b> will set article date and time make sure format is <b className='text-red-600'>Y-MM-DD HH:mm:ss</b>
            </InstructionItem>
            <InstructionItem name='Category'>
                <b>@category</b> will set the main category of the article
            </InstructionItem>
            <InstructionItem name='Subcategory'>
                <b>@subcategory</b> will set the subcategory of the article
            </InstructionItem>
            <InstructionItem name='Main Image'>
                <b>@image</b> will set the main image of the article
            </InstructionItem>
            <InstructionItem name='OG Title'>
                <b>@ogtitle</b> will set the Open Graph title for social media
            </InstructionItem>
            <InstructionItem name='OG Description'>
                <b>@ogdescription</b> will set the Open Graph description for social media
            </InstructionItem>
            <InstructionItem name='OG Image'>
                <b>@ogimage</b> will set the Open Graph image for social media previews
            </InstructionItem>
            <InstructionItem name='Keywords'>
                <b>@keywords</b> will set SEO keywords for the article
            </InstructionItem>
            <InstructionItem name='Focus Keyword'>
                <b>@focuskeyword</b> will set focus word of article
            </InstructionItem>
            <InstructionItem name='X Card Type'>
                <b>@xcard</b> will define the X (Twitter) card type, e.g., summary or summary_large_image
            </InstructionItem>
            <InstructionItem name='X Title'>
                <b>@xtitle</b> will set the X (Twitter) card title
            </InstructionItem>
            <InstructionItem name='X Description'>
                <b>@xdescription</b> will set the X (Twitter) card description
            </InstructionItem>
            <InstructionItem name='X Image'>
                <b>@ximage</b> will set the X (Twitter) card image
            </InstructionItem>
            <InstructionItem name='Content'>
                <b>@content</b> will set the main body content of the article
            </InstructionItem>

            <div className='bg-white border rounded-lg p-2'>
                <span className='font-medium text-xl text-green-700'>Article Propt</span>
                <div className='grid grid-cols-2 gap-3'>
                    <TextField value={form.article_count} onChange={setValue('article_count')} type='number' placeholder='Enter count'>Article Count</TextField>
                    <TextField value={form.min_words} onChange={setValue('min_words')} type='number' placeholder='Enter minimum words'>Minimum Words</TextField>
                    <Dropdown searchable={false} value={form.article_type} onChange={setValue('article_type')} placeholder='Article Type' getOptions={async () => [{ id: ArticleType.Blog, name: 'Blog' }, { id: ArticleType.News, name: 'News' }]}>Article Type</Dropdown>
                </div>
                <TextField value={form.topics} onChange={setValue('topics')} placeholder='Topics' multiline>Topics</TextField>

                <div className='copy-block relative text-xs whitespace-pre-wrap mt-4 bg-sky-50 p-1 rounded-lg  border group'>
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Btn size="xs" variant="destructive" onClick={handleCopy}>
                            <LuCopy />
                        </Btn>
                    </div>
                    <p>I have a software which takes custom markup language for creating articles , it bascially parses the plain text into object and creates articles</p>
                    <p>Here is an example</p>
                    <p>@article</p>
                    <p>@title My awesome article</p>
                    <p>@subtitle a short description about my article</p>
                    <p>@datetime 2025-10-25 10:08:03 date and time of article in momemtjs format Y-MM-DD HH:mm:dd </p>
                    <p>@category main article category</p>
                    <p>@subcategory optional subcategory of the article</p>
                    <p>@image https://example.com/article-image.jpg</p>
                    <p>@ogtitle My awesome article for social sharing</p>
                    <p>@ogdescription short and catchy description for social media</p>
                    <p>@ogimage https://example.com/og-image.jpg</p>
                    <p>@keywords ai, technology, innovation, trends, science</p>
                    <p>@focuskeyword Focus keyword for my article</p>
                    <p>@xcard summary_large_image</p>
                    <p>@xtitle My awesome article on X</p>
                    <p>@xdescription short and engaging summary for X post</p>
                    <p>@ximage https://example.com/x-image.jpg</p>
                    <p>My content starts from here its a normal markup language like </p>
                    <p># will create a large heading</p>
                    <p>## will create slitly smaller header</p>
                    <p>**will write in blod**</p>
                    <p>- list item 1</p>
                    <p>- list item 2</p>
                    <p>- list item 3</p>
                    <p>@article</p>
                    <p>@title My second article starts</p>

                    <p> After all @ tags until next @article block will be considered as content of article which will be parsed in normal markup language.</p>
                    <p>as you can see we have meta tags for seo purposes to prevent double work we can simply write @ogtitle same and it will copy @title into @ogtitle  the word "same" is fixed.</p>


                    <p>Now i want you to generate {form.article_count} {form.article_type == ArticleType.Blog ? 'blogs' : form.article_type == ArticleType.News ? 'news' : 'articles'} on following topics :-</p>
                    <p>{form.topics}</p>

                    <p>Make sure you follow the instructions properly and also you generate {form.article_type == ArticleType.Blog ? 'blogs' : form.article_type == ArticleType.News ? 'news' : 'articles'} which are engaging  and great for SEO </p>
                    <p>Make sure you write it on console mode or text editor mode so i can easly copy it and also generate all in single console instead of seprated consoles for each article.</p>
                    <p>I need detailed content make sure content is {form.min_words} words minimum.</p>
                    <p>Make sure you don't use large title in content starts with single #, since  i will render main title with custom h1 element with @title element.</p>
                </div>
            </div>
        </ModalBody>
    </>
}
