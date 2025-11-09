import { Session } from '@/data/global';
import { useGlobalContext } from '@/hooks/use-global-context';
import moment from 'moment';
import { Modal } from '../common/Modal';
import { lazy, Suspense } from 'react';
import CenterLoading from '../common/CenterLoading';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
const LazySessionEditor = lazy(() => import('@/pages/sessions/components/SessionEditorDialog'));

type Props = {
    session_id?: number,
    onChange: (session: Session) => void,
    create?: boolean
}

export default function SessionSelector({ session_id, onChange, create = true }: Props) {
    const { context, setContext } = useGlobalContext();
    return (
        <div className='flex flex-row items-center flex-wrap gap-2'>
            {context.sessions.map(session => <div
                onClick={() => onChange(session)}
                key={session.id}
                className={cn(
                    `rounded-lg border p-2 bg-white cursor-pointer hover:bg-sky-50 select-none active:bg-sky-100 hover:text-primary h-[60px]`,
                    session_id == session.id && 'bg-primary text-white hover:bg-primary hover:text-white'
                )}>
                <div className='text-sm font-medium'> {session.name}</div>
                <div className='text-xs'> {moment(session.start_date).format('DD MMM, Y')} - {moment(session.end_date).format('DD MMM, Y')}</div>
            </div>)}
            {create && <div
                onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Session',
                        content: () => <Suspense fallback={<CenterLoading className='relative h-[200px]' />}>
                            <LazySessionEditor onSuccess={(t) => {
                                setContext(c => ({ ...c, sessions: [...c.sessions, t] }))
                                onChange(t);
                                Modal.close(modal_id);
                            }} onCancel={() => {
                                Modal.close(modal_id);
                            }} />
                        </Suspense>
                    })
                }}
                className={cn(
                    `rounded-lg border p-2 bg-white cursor-pointer hover:bg-sky-50 select-none active:bg-sky-100 hover:text-primary flex flex-col items-center justify-center     h-[60px]`,

                )}>
                <Plus />
                <div className='text-xs'>Add New Session</div>
            </div>}
        </div>
    )
}
