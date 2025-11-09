import { Modal } from '@/components/common/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaginationType, getDefaultPaginated } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/common/Pagination';
import CenterLoading from '@/components/common/CenterLoading';
import ArticleEditorDialog from './ArticleEditorDialog';
import NoRecords from '@/components/common/NoRecords';
import { msg } from '@/lib/msg';
import { ArticleService } from '@/services/ArticleService';
import { LuNewspaper } from 'react-icons/lu';
import moment from 'moment';
import { SeoBtn } from '@/components/common/seo-manager/SeoManager';
import { Seo } from '@/data/Seo';
import { ArticleType } from '@/data/article';

export default function ArticleListing({ article_type }: { article_type: ArticleType }) {

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
        keyword: '',
    });
    const setFilter = useSetValue(setFilters);
    const search = async () => {
        setSearching(true);
        var r = await ArticleService.search({ ...filters, article_type });
        if (r.success) {
            setReponse(r.data);
            setSearching(false);
        }
    }

    const openEditorModal = (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Update ' + name : 'Create ' + name,
            maxWidth: '1000px',
            content: () => <ArticleEditorDialog article_type={article_type} id={id} onCancel={() => Modal.close(modal_id)} onSuccess={() => {
                Modal.close(modal_id);
                search();
            }} />
        });
    }

    const handleDelete = async (id: number) => {
        msg.confirm('Delete ' + name + ' ?', 'Are you sure you want to delete ' + name + ' ?', {
            onConfirm: async () => {
                var res = await ArticleService.delete(id);
                if (res.success) {
                    msg.success(name + " has been deleted");
                    search();
                } else {
                    msg.warning(res.messages.message);
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
                        <LuNewspaper className="h-5 w-5 mr-2" />
                        {title}
                    </CardTitle>
                    <Button onClick={() => openEditorModal()} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create {name}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                {searching && <div className='relative h-[400px]'><CenterLoading className='absolute' /></div>}
                {!searching && <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Publish</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {response.records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell className="font-medium">
                                    {!!record.image && <img src={record.image} className='border rounded-sm' style={{
                                        height: 50
                                    }} />}
                                </TableCell>
                                <TableCell className="font-medium">{record.name}</TableCell>
                                <TableCell>{record.description}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col items-center">
                                        <div className="text-base font-semibold text-black">{record.article_datetime ? moment(record.article_datetime).format('DD MMM, YYYY') : ""}</div>
                                        <div className="text-sm text-gray-500">{record.article_datetime ? moment(record.article_datetime).format('LT') : ""}</div>
                                    </div>
                                </TableCell>

                                <TableCell>{record.category_name}</TableCell>
                                <TableCell>
                                    <Badge variant={record.status ? 'default' : 'secondary'}>
                                        {record.publish ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-row flex-wrap gap-2'>
                                        <SeoBtn id={record.id} type={Seo.ArticleDetail} title={record.name} description={record.description} />
                                        <Button variant="outline" size="sm" onClick={() => openEditorModal(record.id)} className="mr-2">Edit</Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>
                                    </div>
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
