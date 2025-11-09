import { FaPlus } from 'react-icons/fa6';
import Btn from '../Btn';
import Dropdown from '../Dropdown';
import { Modal, ModalBody, ModalFooter } from '../Modal';
import TextField from '../TextField';
import { useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import SuggestCountry from './SuggestCountry';
import SuggestState from './SuggestState';
import { CityService } from '@/services/CityService';
import { SuggestProp } from './Suggest';

type SuggestCityProps = SuggestProp & {
  state_id?: number;
};

export default function SuggestCity({
  children = 'City',
  value,
  selected,
  onChange,
  placeholder = 'Select city',
  onSelect,
  includedValues,
  state_id,
  disabled
}: SuggestCityProps) {
  return (
    <Dropdown
      disabled={disabled}
      searchable={true}
      selected={selected}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      includedValues={includedValues}
      onSelect={onSelect}
      getOptions={async ({ page, keyword }) => {
        const r = await CityService.search({
          page,
          keyword,
          state_id,

        });
        if (r.success) {
          return r.data.records;
        }
        return [];
      }}
      footer={(updateOptions) => {
        return (
          <Btn
            size={'xs'}
            onClick={() => {
              const modal_id = Modal.show({
                title: 'Add City',
                content: () => {
                  const [form, setForm] = useState<any>({
                    state_id, // ✅ Pre-fill state_id in modal if passed
                  });
                  const setValue = useSetValue(setForm);
                  const [saving, setSaving] = useState(false);

                  const save = async () => {
                    setSaving(true);
                    const r = await CityService.create(form);
                    if (r.success) {
                      Modal.close(modal_id);
                      updateOptions(r.data); // ✅ Update dropdown with new city
                    }
                    setSaving(false);
                  };

                  return (
                    <>
                      <ModalBody>
                        <SuggestCountry
                          value={form.country_id}
                          onChange={setValue('country_id')}
                        />
                        <SuggestState
                          value={form.state_id}
                          onChange={setValue('state_id')}
                        />
                        <TextField
                          value={form.name}
                          onChange={setValue('name')}
                        >
                          Name
                        </TextField>
                      </ModalBody>
                      <ModalFooter>
                        <Btn onClick={save} loading={saving}>
                          Save
                        </Btn>
                      </ModalFooter>
                    </>
                  );
                },
              });
            }}
          >
            <FaPlus /> Add New
          </Btn>
        );
      }}
    >
      {children}
    </Dropdown>
  );
}
