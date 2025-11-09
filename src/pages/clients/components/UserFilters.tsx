
import Dropdown from '@/components/common/Dropdown';
import SuggestClass from '@/components/common/suggest/SuggestClass';
import SuggestGender from '@/components/common/suggest/SuggestGender';
import SuggestSection from '@/components/common/suggest/SuggestSection';
import SuggestSession from '@/components/common/suggest/SuggestSession';

import { getDefaultUserSearchFilters, UserSearchFilters } from '@/data/user';
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useRef, useState } from 'react';

interface Props {
    filters?: UserSearchFilters;
    setFilters: (filters: UserSearchFilters) => void
}

const UserFilters = ({ filters, setFilters }: Props) => {
    const [state, setState] = useState<UserSearchFilters>({ ...getDefaultUserSearchFilters(), ...filters });
    const setValue = useSetValue(setState);
    const init = useRef<boolean>(false);

    useEffect(() => {
        if (init.current) {
            setFilters(state);
        } else {
            init.current = true;

        }

    }, [state]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SuggestClass value={state.class_id} onChange={setValue('class_id')} />
            <SuggestSection value={state.section_id} onChange={setValue('section_id')} />
            <SuggestGender value={state.gender} onChange={setValue('gender')} />
            <SuggestSession value={state.session_id} onChange={setValue('session_id')} />
            <Dropdown value={state.active} onChange={setValue('active')} placeholder={'Status'} getOptions={async () => {
                return [
                    { id: false, name: 'Inactive' },
                    { id: true, name: 'Active' }
                ];
            }} >
                Status
            </Dropdown>


        </div>
    );
};

export default UserFilters;
