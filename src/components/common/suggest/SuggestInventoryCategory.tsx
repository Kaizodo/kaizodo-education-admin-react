import { UserType } from '@/data/user';
import Dropdown from '../Dropdown';
import { FaPlus } from 'react-icons/fa6';
import { SuggestProp } from './Suggest';
import { lazy, Suspense } from 'react';
import Btn from '../Btn';
import CenterLoading from '../CenterLoading';
import { Modal } from '../Modal';
import { InventoryCategoryService } from '@/services/InventoryCategoryService';

const LazyEditorDialog = lazy(() => import('@/pages/inventory/components/ItemCategoryEditorDailog'));

type SuggestInventoryCategoryProps = SuggestProp & {
  user_type?: UserType;
  is_book?: boolean;
};

export default function SuggestInventoryCategory({
  children = 'Inventory Category',
  value,
  onChange,
  selected,
  placeholder = 'Select inventory category',
  onSelect,
  includedValues,
  is_book,
}: SuggestInventoryCategoryProps) {
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
        return (
          <Btn
            size={'xs'}
            onClick={() => {
              const modal_id = Modal.show({
                title: 'Add Inventory Category',
                maxWidth: 700,
                content: () => (
                  <Suspense fallback={<CenterLoading className="h-[200px] relative" />}>
                    <LazyEditorDialog
                      onSuccess={(data) => {
                        updateOptions(data);
                        Modal.close(modal_id);
                      }}
                      onCancel={() => {
                        Modal.close(modal_id);
                      }}
                    />
                  </Suspense>
                ),
              });
            }}
          >
            <FaPlus />
            Add New
          </Btn>
        );
      }}
      getOptions={async ({ page, keyword }) => {
        const r = await InventoryCategoryService.search({
          page,
          keyword,
          is_book, 
        });

        if (r.success) {
          return r.data.records;
        }

        return [];
      }}
    >
      {children}
    </Dropdown>
  );
}
