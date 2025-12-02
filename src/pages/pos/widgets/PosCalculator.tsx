import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Btn from '@/components/widgets/Btn';
import { useState, useRef, useImperativeHandle, forwardRef, MouseEvent, TouchEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

export interface PosCalculatorRef {
    setValue: (num: number) => void;
    getValue: () => string;
    open: () => void;
    close: () => void;
}

const PosCalculator = forwardRef<PosCalculatorRef>((_, ref) => {
    const [value, setValue] = useState<string>('');
    const [mode, setMode] = useState<'add' | 'sub' | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

    const dragRef = useRef<HTMLDivElement | null>(null);
    const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
        setValue: (num: number) => {
            if (!mode) {
                setValue((prev) => prev + num);
            } else {
                const currentValue = parseFloat(value || '0');
                const newValue = mode === 'add' ? currentValue + num : currentValue - num;
                setValue(newValue.toString());
            }
        },
        getValue: () => value,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    }));

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const el = dragRef.current;
        if (!el) return;
        offset.current = {
            x: e.clientX - el.getBoundingClientRect().left,
            y: e.clientY - el.getBoundingClientRect().top,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        const el = dragRef.current;
        if (!el) return;
        const touch = e.touches[0];
        offset.current = {
            x: touch.clientX - el.getBoundingClientRect().left,
            y: touch.clientY - el.getBoundingClientRect().top,
        };
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
        setPos({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
        });
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
        const touch = e.touches[0];
        setPos({
            x: touch.clientX - offset.current.x,
            y: touch.clientY - offset.current.y,
        });
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    };

    const handleInput = (num: string) => setValue((prev) => prev + num);

    const handleMode = (op: 'add' | 'sub') => setMode(op);

    const calculate = () => {
        try {
            setValue(eval(value).toString());
            setMode(null);
        } catch {
            setValue('Error');
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    ref={dragRef}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    style={{
                        position: 'fixed',
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        zIndex: 50,
                        width: '280px',
                    }}
                >
                    <Card
                        className='gap-0 shadow-2xl'
                    >
                        <CardHeader>
                            <CardTitle className='flex flex-row items-center w-full mb-0'>
                                <span className='flex-1'>Calculator</span>
                                <Btn onClick={() => setIsOpen(false)} size={'sm'} variant={'ghost'} className='ms-auto'><FaTimes /></Btn>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl mb-2 border rounded-sm p-3">{value || '0'}</div>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, '+'].map((btn) => (
                                    <Button
                                        key={btn}
                                        onClick={() => (btn === '+' ? handleMode('add') : handleInput(btn.toString()))}
                                    >
                                        {btn}
                                    </Button>
                                ))}
                                {[4, 5, 6, '-'].map((btn) => (
                                    <Button
                                        key={btn}
                                        onClick={() => (btn === '-' ? handleMode('sub') : handleInput(btn.toString()))}
                                    >
                                        {btn}
                                    </Button>
                                ))}
                                {[7, 8, 9, '='].map((btn) => (
                                    <Button
                                        key={btn}
                                        onClick={() => (btn === '=' ? calculate() : handleInput(btn.toString()))}
                                    >
                                        {btn}
                                    </Button>
                                ))}
                                <Button onClick={() => setValue('0')}>C</Button>
                                <Button onClick={() => handleInput('0')}>0</Button>
                                <Button onClick={() => handleInput('.')}>.</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
});

export default PosCalculator;
