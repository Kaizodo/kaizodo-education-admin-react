import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import TextField from '@/components/common/TextField';
import { useForm } from '@/hooks/use-form';
import { SetValueType } from '@/hooks/use-set-value';
import { msg } from '@/lib/msg';
import { copyToClipboard, delay, isJson } from '@/lib/utils';
import { LuCopy } from 'react-icons/lu';
import { generateQuestionPrompt } from './generateQuestionPrompt';


export default function AiQuestionGenerator({ state, setStateValue }: { state: any, setStateValue: SetValueType }) {
    const [form, setValue] = useForm<any>({});
    return (<>
        <ModalBody>
            <TextField value={form.json} onChange={setValue('json')} rows={6} multiline placeholder='Enter output json'>Generated JSON</TextField>
        </ModalBody>
        <ModalFooter className='justify-between'>
            <Btn
                variant={'outline'}
                onClick={() => {

                    copyToClipboard(generateQuestionPrompt(state));
                    msg.success('Propt copied')
                }}><LuCopy /> Copy Propt</Btn>
            <Btn asyncClick={async () => {
                if (isJson(form.json)) {
                    var questions = JSON.parse(form.json);
                    state.questions.map(async (sq: any, sq_i: number) => {
                        var question = questions[sq_i];
                        if (question) {
                            setStateValue(`questions[id:${sq.id}]`)(question);
                            await delay(5);
                        }
                    })


                }
            }}>Set Questions</Btn></ModalFooter>
    </>);
}
