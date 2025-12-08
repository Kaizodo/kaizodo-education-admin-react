import React, { useCallback, useRef, createContext, useContext } from 'react';

interface DrawerContextType {
    close: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    position?: 'left' | 'right';
    maxWidth?: string;
}

const SideDrawer: React.FC<DrawerProps> = ({
    open,
    onOpenChange,
    children,
    position = 'right',
    maxWidth,
}) => {
    const drawerRef = useRef<HTMLDivElement>(null);

    const closeDrawer = useCallback(() => {
        onOpenChange(false);
    }, [onOpenChange]);

    const positionClasses = position === 'right' ? 'right-0' : 'left-0';
    const openClasses = open ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full';

    return (
        <DrawerContext.Provider value={{ close: closeDrawer }}>
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300  "
                    onClick={closeDrawer}
                />
            )}

            <div
                ref={drawerRef}
                style={{ maxWidth: maxWidth || undefined }}
                className={`
                    fixed top-0 h-full w-full bg-white dark:bg-gray-800 shadow-2xl 
                    z-50 flex flex-col transform transition-transform duration-300
                    ${positionClasses} ${openClasses}
                `}
            >
                {children}
            </div>
        </DrawerContext.Provider>
    );
};

// Child trigger component
export const SideDrawerClose: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context = useContext(DrawerContext);
    if (!context) return null;

    return <div onClick={context.close}>{children}</div>;
};

export default SideDrawer;
