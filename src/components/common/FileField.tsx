import { Label } from '../ui/label'
import { Input } from '../ui/input'
type Props = {
    onChange: (value: FileList) => void,
    children?: string,
    accept?: string;
}
export default function FileField({ children, onChange, accept }: Props) {
    return (
        <div className='space-y-2'>
            <Label className='mb-2'>{children}</Label>
            <Input
                type={'file'}
                accept={accept} 
                onChange={(e) => {
                    if (e.target.files) {
                        onChange(e.target.files);
                    }

                }}
            />
        </div>
    )
}
