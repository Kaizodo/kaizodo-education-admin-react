import moment from 'moment';

import { DittoMode, openDitto } from '@/components/common/Ditto';
import TouchableField from '@/components/common/TouchableField';
import { ReactNode, useEffect, useState } from 'react';
import Btn from './Btn';
import { FaTimes } from 'react-icons/fa';

type Props = {
    value?: any,
    onChange: (value?: any) => void,
    placeholder?: string,
    can_unset?: boolean,
    children?: ReactNode,
    mode: DittoMode,
    inputFormat?: string,
    previewFormat?: string,
    outputFormat?: string,
    marginBottom?: number
}

export default function DateTimeField({ value, inputFormat, previewFormat, outputFormat, onChange, children, placeholder, mode, can_unset = true }: Props) {
    const getDefaultFormat = (format: string | undefined) => {
        if (!format) {
            switch (mode) {
                case 'date':
                    return 'Y-MM-DD';
                case 'month':
                    return 'MM';
                case 'time':
                    return 'LT';
                case 'datetime':
                    return 'YYYY-MM-DD LT';
                case 'year':
                    return 'YYYY';
                default:
                    break;
            }
        }
        return format;
    }
    const [previewDate, setPreviewDate] = useState<string>(
        moment(value, getDefaultFormat(inputFormat)).isValid() ?
            moment(value, getDefaultFormat(inputFormat)).format(getDefaultFormat(previewFormat)) :
            moment().format(getDefaultFormat(previewFormat))
    );


    const setValue = (m?: moment.Moment) => {
        if (m) {
            var dt = m.format(getDefaultFormat(outputFormat));
            setPreviewDate(m.format(getDefaultFormat(previewFormat)));
            onChange(dt);
        } else {
            onChange('');
        }
    }

    useEffect(() => {
        setPreviewDate(moment(value, getDefaultFormat(inputFormat)).isValid() ?
            moment(value, getDefaultFormat(inputFormat)).format(getDefaultFormat(previewFormat)) :
            moment().format(getDefaultFormat(previewFormat)));
    }, [value])

    return (
        <TouchableField
            label={children}
            onClick={async () => openDitto({ mode, value: value, callback: setValue })}
            placeholder={!value ? placeholder : previewDate} >
            {!!value && <div className='flex flex-row relative'>
                <span style={{ opacity: 0.5, flex: 1 }}>{!value ? placeholder : previewDate}</span>
                {!!can_unset && <Btn size={'sm'} onClick={(event) => {
                    event.stopPropagation();

                    setValue(undefined)
                }} variant={'ghost'} className='absolute right-[-10px] top-[-7px]' >
                    <FaTimes />
                </Btn>}
            </div>}
        </TouchableField>
    );
}