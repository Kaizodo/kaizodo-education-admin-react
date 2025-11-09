import { Modal } from '@/components/common/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaginationType, getDefaultPaginated } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import Pagination from '@/components/common/Pagination';
import CenterLoading from '@/components/common/CenterLoading';
import BannerEditorDialog from './BannerEditorDialog';
import NoRecords from '@/components/common/NoRecords';
import { msg } from '@/lib/msg';
import { LuNewspaper } from 'react-icons/lu';
import { BannerService } from '@/services/BannerService';

export default function BannerListing() {
    const [searching, setSearching] = useState(true);
    const [response, setReponse] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState({
        page: 1,
        keyword: '',
    });
    const setFilter = useSetValue(setFilters);
    const search = async () => {
        setSearching(true);
        var r = await BannerService.search(filters);
        if (r.success) {
            setReponse(r.data);
            setSearching(false);
        }
    }

    const openEditorModal = (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Update Banner' : 'Create Banner',
            maxWidth: '1000px',
            content: () => <BannerEditorDialog id={id} onCancel={() => Modal.close(modal_id)} onSuccess={() => {
                Modal.close(modal_id);
                search();
            }} />
        });
    }

    const handleDelete = async (id: number) => {
        msg.confirm('Delete Banner?', 'Are you sure you want to delete Banner?', {
            onConfirm: async () => {
                var res = await BannerService.delete(id);
                if (res.success) {
                    msg.success("Banner has been deleted");
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
                        Banners
                    </CardTitle>
                    <Button onClick={() => openEditorModal()} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Banner
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {searching && <div className='relative h-[400px]'><CenterLoading className='absolute' /></div>}
                {!searching && <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
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
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => openEditorModal(record.id)} className="mr-2">Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>
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
