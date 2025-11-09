import Btn from '@/components/common/Btn'
import CenterLoading from '@/components/common/CenterLoading';
import { Modal, ModalBody, ModalFooter } from '@/components/common/Modal'
import { getModuleModifierMeta, ModuleModifier } from '@/data/user'
import { UserService } from '@/services/UserService';
import { lazy, Suspense, useEffect, useState } from 'react';

import UserProfileAdvance from './UserProfileAdvance';
const LazyEditorDalog = lazy(() => import('./UserEditorDialog'));

interface Props {
    id?: number,
    modifier: ModuleModifier,
}

export default function UserProfile({ id, modifier }: Props) {
    const meta = getModuleModifierMeta(modifier);
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<any>({});

    const getDetail = async () => {
        if (!id) {
            return;
        }
        setLoading(true);
        var r = await UserService.detail(id);
        if (r.success) {
            setState(r.data);
            setLoading(false);
        }
    }

    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: id ? meta.update_title : meta.create_title,
            maxWidth: 700,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDalog id={id} modifier={modifier} onSuccess={() => {
                    Modal.close(modal_id);
                    getDetail();
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id])

    return (
        loading ? <CenterLoading className='h-[90vh] relative' /> :
            <>
                <ModalBody>
                    <UserProfileAdvance user={state?.user} subjects={state?.exam_subjects} books={state?.books} activity={state?.activity} />
                </ModalBody>
                <ModalFooter>
                    <Btn onClick={() => openEditor(id)}>Edit Details</Btn>
                </ModalFooter>
            </>
    )
}
