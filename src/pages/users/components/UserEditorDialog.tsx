
import { lazy, Suspense, useEffect, useState } from 'react';


import CenterLoading from '@/components/common/CenterLoading';
import { getUserTypeName, ModuleModifier } from '@/data/user';

import { ModalBody, ModalFooter } from '@/components/common/Modal';

import { nameLetter } from '@/lib/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserPersonalDetailEditorCard from './UserPersonalDetailEditorCard';
import Btn from '@/components/common/Btn';



const LazyUserAcademicInformationCard = lazy(() => import('./UserAcademicInformationCard'));
const LazyUserTransportCard = lazy(() => import('./UserTransportCard'));
const LazyUserSubjectCard = lazy(() => import('./UserSubjectCard'));
const LazyUserClassCard = lazy(() => import('./UserClassCard'));
const LazyUserCredentialCard = lazy(() => import('./UserCredentialCard'));
const LazyUserFeeConfigurationCard = lazy(() => import('./UserFeeConfigurationCard'));
const LazyUserSalaryConfigurationCard = lazy(() => import('./UserSalaryConfigurationCard'));
const LazyUserLeaveConfigurationCard = lazy(() => import('./UserLeaveConfigurationCard'));
const LazyUserWeekOffConfigurationCard = lazy(() => import('./UserWeekOffConfigurationCard'));
const LazyUserStatutoryConfigurationCard = lazy(() => import('./UserStatutoryConfigurationCard'));
const LazyUserMedicalCard = lazy(() => import('./UserMedicalCard'));
const LazyUserAddressEditorCard = lazy(() => import('./UserAddressEditorCard'));

const LazyUserKinCard = lazy(() => import('./UserKinCard'));
const LazyUserRelationCard = lazy(() => import('./UserRelationCard'));
const LazyUserDocumentCard = lazy(() => import('./UserDocumentCard'));


interface Props {
    id?: number,
    modifier: ModuleModifier,
    providedNav?: string,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}



const UserEditorDialog = ({ id: user_id, modifier, providedNav, onSuccess, onCancel }: Props) => {
    const [id, setId] = useState(user_id);

    const [form, setForm] = useState<any>({});

    const [currentNav, setCurrentNav] = useState(providedNav ?? 'personal');





    useEffect(() => {
        setId(user_id);
    }, [user_id]);

    const navs = [
        { id: 1, name: "Personal Details", key: "personal" },
        ...((modifier == 'employee' && [
            { id: 10, name: "Subjects", key: "subjects" },
            { id: 10, name: "Classess", key: "classes" },
            { id: 11, name: "Monthly Salary", key: "salary" },
            { id: 12, name: "Leave Quota", key: "leave" },
            { id: 13, name: "WeekOff Plan", key: "weekoff" },
            { id: 14, name: "Bank & Statutory Details", key: "statutory" },
        ]) || []),
        ...((modifier == 'student' && [
            { id: 3, name: "Academic Information", key: "academic" },

        ]) || []),
        ...((modifier == 'student' && !!id && [
            { id: 5, name: "Parents", key: "parents" },
            { id: 2, name: "Transport", key: "transport" },
            { id: 2, name: "Fee Configuration", key: "fee" },
            { id: 6, name: "Emergency Contacts", key: "emergency" },
            { id: 8, name: "Medical Information", key: "medical" },
        ]) || []),
        { id: 4, name: "Address Information", key: "address" },
        ...((!!id && [
            { id: 7, name: "Documents", key: "documents" },
            { id: 9, name: "Login Information", key: "login" },
        ]) || []),

    ].filter(Boolean);

    return (
        <>
            <ModalBody className='p-0'>
                <div className="flex flex-row ">
                    <div className="w-[180px] border-r bg-white">
                        <ul className="flex flex-col m-0">
                            {!!id && <li className="flex items-center gap-3 p-3">
                                <Avatar>
                                    <AvatarImage src={form?.image} />
                                    <AvatarFallback>{nameLetter(form?.first_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-800">{form?.first_name} {form?.last_name}</span>
                                    <span className="text-xs text-gray-500">{getUserTypeName(form?.user_type)}</span>
                                </div>
                            </li>}
                            {navs.map((nav) => nav ? (
                                <li
                                    key={nav.key}
                                    onClick={() => setCurrentNav(nav.key)}
                                    className={` border-b text-xs p-3 cursor-pointer hover:bg-gray-100 ${currentNav === nav.key ? "bg-white font-semibold border-l-4 border-primary border-t" : ""}`}
                                >
                                    {nav.name}
                                </li>
                            ) : null)}
                        </ul>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {currentNav === "personal" && <UserPersonalDetailEditorCard id={id} modifier={modifier} onUpdate={setForm} onSuccess={onSuccess} />}
                        {!!id && ['admin', 'employee'].includes(modifier) && <>
                            {currentNav === "salary" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserSalaryConfigurationCard id={id} /></Suspense>}
                            {currentNav === "leave" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserLeaveConfigurationCard id={id} /></Suspense>}
                            {currentNav === "weekoff" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserWeekOffConfigurationCard id={id} /></Suspense>}
                            {currentNav === "statutory" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserStatutoryConfigurationCard id={id} /></Suspense>}
                            {currentNav === "subjects" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserSubjectCard id={id} /></Suspense>}
                            {currentNav === "classes" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserClassCard id={id} /></Suspense>}
                        </>}

                        {!!id && modifier == 'student' && <>
                            {currentNav === "transport" && !!id && modifier == 'student' && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserTransportCard id={id} /></Suspense>}
                            {currentNav === "academic" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserAcademicInformationCard id={id} /></Suspense>}
                            {currentNav === "parents" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserRelationCard id={id} user_type={form.user_type} /></Suspense>}
                            {currentNav === "emergency" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserKinCard id={id} /></Suspense>}
                            {currentNav === "medical" && modifier == "student" && !!id && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserMedicalCard id={id} /></Suspense>}
                            {currentNav === "fee" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserFeeConfigurationCard id={id} /></Suspense>}

                        </>}
                        {!!id && <>
                            {currentNav === "address" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserAddressEditorCard id={id} /></Suspense>}
                            {currentNav === "documents" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserDocumentCard id={id} /></Suspense>}
                            {currentNav === "login" && <Suspense fallback={<CenterLoading className='relative h-[400px]' />}><LazyUserCredentialCard id={id} /></Suspense>}
                        </>}



                    </div>
                </div>

            </ModalBody>
            <ModalFooter><Btn size={'sm'} variant={'outline'} onClick={onCancel}>Close</Btn></ModalFooter>

        </>

    );
};

export default UserEditorDialog;
