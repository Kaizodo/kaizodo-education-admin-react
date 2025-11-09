import { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
import { Label } from '../ui/label'

type Props = {
    value?: any,
    onChange: (value?: any) => void,
    triggerRender?: number,
    placeholder?: string,
    children?: string,
    autofocus?: boolean,
    disabled?: boolean
    multiline?: boolean
}

export default function Richtext({ value, onChange, triggerRender, disabled, children, placeholder }: Props) {
    const { quill, quillRef } = useQuill({
        readOnly: disabled,
        placeholder,
        theme: 'snow',
        modules: {
            toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['link']],
        },
        formats: ['bold', 'italic', 'underline', 'list', 'bullet', 'link'],
    })

    useEffect(() => {
        if (quill) {
            // Only set initial content if value exists and editor is empty
            if (value && quill.root.innerHTML === '<p><br></p>') {
                quill.root.innerHTML = value
            }

            // Handle text changes
            const handleTextChange = () => {
                onChange(quill.root.innerHTML)
            }

            quill.on('text-change', handleTextChange)

            // Cleanup listener on unmount
            return () => {
                quill.off('text-change', handleTextChange)
            }
        }
    }, [quill, onChange, value])


    useEffect(() => {
        if (triggerRender && value && quill) {
            quill.root.innerHTML = value;
        }
    }, [quill, triggerRender])

    return (
        <div className="flex flex-col gap-1">
            {!!children && <Label>{children}</Label>}
            <div className='quill-wrapper bg-white '>
                <div ref={quillRef} className={`${disabled ? 'pointer-events-none opacity-60 rounded-lg' : ''}`} style={{ height: 250 }} />
            </div>
        </div>
    )
}