import { Modal } from '@/components/common/Modal'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { LucideDelete, LucideEdit, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getDefaultPaginated, PaginationType } from '@/data/pagination'
import CenterLoading from '@/components/common/CenterLoading'
import Pagination from '@/components/common/Pagination'
import { useSetValue } from '@/hooks/use-set-value'
import { ArticleCategoryService } from '@/services/ArticleCategoryService'
import NoRecords from '@/components/common/NoRecords'
import { msg } from '@/lib/msg'
import ArticleCategoryEditorDialog from './ArticleCategoryEditorDialog'
import { ArticleType } from '@/data/article'

export default function ArticleCategoryListing({ article_type }: { article_type: ArticleType }) {

    var title = `Blogs`;
    var subtitle = `Manage blogs from this section`;
    var name = `Blog`;

    if (article_type == ArticleType.News) {
        title = 'News';
        subtitle = 'Manage news from this section';
        name = 'News';
    }



    const [searching, setSearching] = useState(true);
    const [response, setReponse] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState({
        page: 1,
        keyword: ''
    });
    const setFilter = useSetValue(setFilters);
    const search = async () => {
        setSearching(true);
        var r = await ArticleCategoryService.search({ ...filters, article_type });
        if (r.success) {
            setReponse(r.data);
            setSearching(false);
        }
    }

    const openEditorModal = (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Update Article' : 'Create Article',
            content: () => <ArticleCategoryEditorDialog article_type={article_type} id={id} onCancel={() => Modal.close(modal_id)} onSuccess={() => {
                Modal.close(modal_id);
                search();
            }} />
        });
    }

    const handleDelete = async (id: number) => {
        msg.confirm('Delete Article Category?', 'Are you sure you want to delete Article Category?', {
            onConfirm: async () => {
                var r = await ArticleCategoryService.delete(id);
                if (r.success) {
                    msg.success("Article Category has been deleted");
                    search();
                } else {
                    msg.warning(r.messages.message);
                }
            }
        })
    }

    useEffect(() => {
        search();
    }, [filters])

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        {name} Category
                    </CardTitle>
                    <Button onClick={() => openEditorModal()} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add {name}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='px-0'>
                {searching && <div className='relative h-[400px]'><CenterLoading className='absolute' /></div>}
                {!searching && <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{name} Category Name</TableHead>
                            <TableHead>Slug / Url</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.records.map((route) => (
                            <TableRow key={route.id}>
                                <TableCell className="font-medium">{route.name}</TableCell>
                                <TableCell>/{name.toLowerCase()}/{route.slug}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditorModal(route.id)}><LucideEdit />Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(route.id)}><LucideDelete />Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
                {!searching && response.records.length == 0 && <NoRecords />}
                <Pagination paginated={response} onChange={setFilter('page')} />
            </CardContent>
        </Card>
    )
}
