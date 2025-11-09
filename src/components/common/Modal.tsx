import React, { ComponentType, ReactNode, isValidElement, useEffect, useState, useContext, createContext } from 'react';
import { createPortal } from 'react-dom';
import { useSyncExternalStore } from 'react';
import { FaTimes } from 'react-icons/fa';
import Btn from '@/components/common/Btn';
import { cn } from '@/lib/utils';

let modals: Record<string, ModalProps> = {};
let listeners = new Set<() => void>();
let modalsRef = modals;

const generateId = (): string => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

type ModalProps = {
    title?: string,
    subtitle?: string,
    maxWidth?: string | number,
    onClose?: (data?: any) => void,
    header?: false | ReactNode | ComponentType<any>,
    content: ReactNode | ComponentType<any>
};

// Create context for modal instance
interface ModalContextType {
    modal_id: string;
    update: (props: Partial<ModalProps>) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

const Modal = {
    show: (props: ModalProps): string => {
        document.body.style.overflow = 'hidden';
        const id = generateId();
        modals = { ...modals, [id]: props };
        if (modals !== modalsRef) {
            modalsRef = modals;
            notifyListeners();
        }
        return id;
    },
    update: (id: string, props: Partial<ModalProps>): void => {
        if (modals[id]) {
            modals = { ...modals, [id]: { ...modals[id], ...props } };
            if (modals !== modalsRef) {
                modalsRef = modals;
                notifyListeners();
            }
        }
    },
    close: (id: string, data: any = undefined): void => {
        document.body.style.overflow = '';
        if (modals[id]) {
            const { [id]: _, ...rest } = modals;
            modals = rest;
            if (_.onClose) {
                _.onClose(data);
            }
            if (modals !== modalsRef) {
                modalsRef = modals;
                notifyListeners();
            }
        }
    },
    closeAll: (data: any = undefined) => {
        document.body.style.overflow = '';
        if (Object.keys(modals).length > 0) {
            Object.values(modals).forEach(m => {
                if (m.onClose) {
                    m.onClose(data);
                }
            });
            modals = {};
            modalsRef = {};
            notifyListeners();
        }
    },
    subscribe: (callback: () => void): () => void => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },
    getModals: (): Record<string, ModalProps> => modalsRef,
};

const notifyListeners = (): void => {
    listeners.forEach((callback) => callback());
};

// Hook to access modal instance
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalContainer');
    }
    return context;
};

export const ModalFooter = ({ children, className, ...props }: React.ComponentProps<"div">) => {
    return (<div {...props} className={cn('flex flex-row justify-end w-full border-t p-3', className)}>{children}</div>);
};

export const ModalBody = ({ children, className, ...props }: React.ComponentProps<"div">) => {
    return <div {...props} className={cn('max-h-[84vh] w-full overflow-auto p-3 flex flex-col gap-3 min-h-0', className)}>{children}</div>;
};

const ModalContainer: React.FC = () => {
    const modals: Record<string, ModalProps> = useSyncExternalStore(
        Modal.subscribe,
        () => Modal.getModals(),
        () => ({})
    );

    const [visibleModals, setVisibleModals] = useState<string[]>([]);

    useEffect(() => {
        const ids = Object.keys(modals);
        setVisibleModals((prev) =>
            [...new Set([...prev, ...ids])].filter((id) => ids.includes(id))
        );
    }, [modals]);

    return createPortal(
        <>
            {Object.entries(modals).map(([id, props]) => (
                <div
                    key={id}
                    className={`service-modal pointer-events-auto fixed max-w-screen max-h-screen top-0 left-0 inset-0 z-[53] flex items-center justify-center transition-opacity duration-300 ${visibleModals.includes(id) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div
                        className="absolute inset-0 bg-black opacity-50 transition-opacity duration-300 px-3 z-[51]"
                        onClick={() => Modal.close(id)}
                    />
                    <div
                        style={{
                            maxWidth: props?.maxWidth || Math.min(window.innerWidth - 20, 400)
                        }}
                        className={cn(`flex flex-col bg-primary-foreground rounded-lg shadow-lg w-full relative z-[52] transition-transform duration-300 ${visibleModals.includes(id) ? 'scale-100' : 'scale-95'}`)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ModalContext.Provider value={{ modal_id: id, update: (props) => Modal.update(id, props) }}>
                            {isValidElement(props.header) ? (
                                props.header
                            ) : typeof props.header === 'function' ? (
                                React.createElement(props.header as ComponentType<any>)
                            ) : typeof props.header === 'boolean' ? undefined : (
                                <div className='flex flex-row items-center justify-between w-full border-b p-3'>
                                    <div className='flex flex-col'>
                                        <span className='font-bold text-md'>{props.title}</span>
                                        <span className='text-sm text-muted-foreground'>{props.subtitle}</span>
                                    </div>
                                    <Btn
                                        type='button'
                                        variant={'ghost'}
                                        onClick={() => Modal.close(id)}
                                    ><FaTimes /></Btn>
                                </div>
                            )}
                            {isValidElement(props.content) ? (
                                props.content
                            ) : typeof props.content === 'function' ? (
                                React.createElement(props.content as ComponentType<any>)
                            ) : undefined}
                        </ModalContext.Provider>
                    </div>
                </div>
            ))}
        </>,
        document.body
    );
};

export { Modal, ModalContainer };