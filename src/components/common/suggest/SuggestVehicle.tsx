import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { VehicleService } from '@/services/VehicleService';


const LazyVehicleEditorDialog = lazy(() => import('@/pages/vehicles/components/VehicleEditorDialog'));


export default function SuggestVehicle({ children = 'Vehicle', value, onChange, selected, placeholder = 'Select vehicle', onSelect, includedValues }: SuggestProp & {
    user_type?: UserType
}) {
    return (
        <Dropdown
            searchable={true}
            selected={selected}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            includedValues={includedValues}
            onSelect={onSelect}
            footer={(updateOptions) => {
                return (<Btn size={'xs'} onClick={() => {
                    const modal_id = Modal.show({
                        title: 'Add Vehicle',
                        maxWidth: 700,
                        content: () => <Suspense fallback={<CenterLoading className='h-[200px] relative' />}><LazyVehicleEditorDialog onSuccess={(data) => {
                            updateOptions(data);
                            Modal.close(modal_id);

                        }} onCancel={() => {
                            Modal.close(modal_id);
                        }} /></Suspense>
                    })
                }}><FaPlus />Add New</Btn>);
            }}
            getOptions={async ({ page, keyword }) => {
                var r = await VehicleService.search({
                    page, keyword
                });
                if (r.success) {
                    return r.data.records.map((record: any) => ({
                        id: record.id,
                        name: `${record.vehicle_number}`
                    }));
                }

                return [];
            }} >
            {children}
        </Dropdown>
    )
}
