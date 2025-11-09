import CenterLoading from '@/components/common/CenterLoading';
import { ModalBody } from '@/components/common/Modal';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';
import { TeamService } from '@/services/TeamService';
import { useEffect, useState } from 'react';
import TeamTicketSupportEditor from './TeamTicketSupportEditor';

interface Props {
    id: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}
export default function TeamWorkDialog({ id, onSuccess, onCancel }: Props) {
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<any>();




    const load = async () => {
        setLoading(true);
        var r = await TeamService.detail(id);

        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }

    useEffect(() => {
        load();
    }, [id])


    if (loading) {
        return <CenterLoading className='relative h-[400px]' />
    }

    return (
        <>
            <ModalBody>
                <Tabs defaultValue="ticket" className="w-full">
                    <TabsList>
                        <TabsTrigger value="ticket">Ticket Support</TabsTrigger>
                        <TabsTrigger value="lead">Lead Management</TabsTrigger>
                        <TabsTrigger value="sales">Sales Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ticket">
                        <TeamTicketSupportEditor id={id} />
                    </TabsContent>

                    <TabsContent value="lead">
                        <div className="p-4">Lead Management Content</div>
                    </TabsContent>

                    <TabsContent value="sales">
                        <div className="p-4">Lead Management Content</div>
                    </TabsContent>
                </Tabs>
            </ModalBody>

        </>
    )
}
