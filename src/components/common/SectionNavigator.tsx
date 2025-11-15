import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef, useCallback, createContext, useContext, ReactNode, forwardRef } from 'react';
import { IconType } from 'react-icons/lib';

interface NavMenuItem {
    id: string;
    title: string;
    subtitle: string;
    icon: IconType;
}

interface SectionRegistryContextType {
    registerSection: (id: string, ref: HTMLDivElement | null) => void;
}

const SectionRegistryContext = createContext<SectionRegistryContextType | undefined>(undefined);

const useSectionRegistry = () => {
    const context = useContext(SectionRegistryContext);
    if (!context) throw new Error('InnerSection must be used within a SectionNavigator');
    return context;
};

interface NavSectionProps {
    id: string;
    title: string;
    subtitle?: string;
    icon?: IconType;
    children: ReactNode;
    className?: string;
}

export const NavigatorSection: React.FC<NavSectionProps> = forwardRef(({ id, title, subtitle, icon: Icon, children, className }) => {
    const { registerSection } = useSectionRegistry();
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        registerSection(id, sectionRef.current);
    }, [id, registerSection]);

    return (
        <section id={id} ref={sectionRef} className="bg-white border min-h-[500px] rounded-lg">
            <div className='flex flex-row p-3 border-b items-center gap-3'>
                {Icon && <Icon className='h-10 w-10 p-1 border rounded-sm' />}
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <span className='text-sm text-gray-500'>{subtitle}</span>
                </div>
            </div>
            <div className={cn("p-6 space-y-3", className)}>
                {children}
            </div>
        </section>
    );
});

const SECTION_OFFSET_PX = 100;

interface SectionNavigatorProps {
    menuItems: NavMenuItem[];
    children: ReactNode;
}

export default function SectionNavigator({ menuItems, children }: SectionNavigatorProps) {
    const [activeSectionId, setActiveSectionId] = useState(menuItems[0]?.id || '');
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const registerSection = useCallback((id: string, ref: HTMLDivElement | null) => {
        sectionRefs.current = { ...sectionRefs.current, [id]: ref };
    }, []);

    const handleScroll = useCallback(() => {
        const content = contentRef.current;
        if (!content) return;

        const scrollTop = content.scrollTop;
        let currentId = menuItems[0].id;

        for (const item of menuItems) {
            const el = sectionRefs.current[item.id];
            if (!el) continue;

            const top = el.offsetTop - scrollTop;

            if (top <= SECTION_OFFSET_PX) currentId = item.id;
        }

        if (currentId !== activeSectionId) setActiveSectionId(currentId);
    }, [activeSectionId, menuItems]);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        setTimeout(handleScroll, 0);
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToSection = (id: string) => {
        const element = sectionRefs.current[id];
        const content = contentRef.current;
        if (!element || !content) return;

        const target = element.offsetTop - SECTION_OFFSET_PX;
        content.scrollTo({ top: target < 0 ? 0 : target, behavior: 'smooth' });
        setActiveSectionId(id);
    };

    if (!menuItems.length) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">Error: Navigation items array is empty.</div>;

    return (
        <div className="flex flex-col md:flex-row gap-6 overflow-hidden" style={{ height: window.innerHeight - 120 }}>
            <nav className="w-full md:w-72 bg-gray-50 p-3 flex-shrink-0 overflow-y-auto rounded-lg border">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = item.id === activeSectionId;
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className={`w-full text-left py-3 px-3 rounded-sm transition-all duration-200 flex items-start space-x-3
                                    ${isActive ? 'bg-indigo-600 text-white shadow-lg font-semibold scale-[1.02]' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                                >
                                    <div className='w-8 h-8 border rounded-sm flex items-center justify-center text-xl'><Icon /></div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">{item.title}</span>
                                        <span className={`text-xs ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>{item.subtitle}</span>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div ref={contentRef} className="flex-grow overflow-y-auto custom-scroll space-y-6 pe-6 relative" style={{ height: '100%' }}>
                <div className="sticky top-0 h-3 z-40 -mb-3 bg-gradient-to-b from-[#f3f4f6] to-transparent"></div>

                <SectionRegistryContext.Provider value={{ registerSection }}>
                    {children}
                    <div className='h-[500px]'></div>
                </SectionRegistryContext.Provider>
            </div>
        </div>
    );
}
