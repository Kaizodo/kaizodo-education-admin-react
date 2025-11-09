import React from 'react';
import { Calendar } from 'lucide-react';
import { OrderState, Phase, PhaseStep } from '../OrderDetail';
import { LuClock } from 'react-icons/lu';
import { getColorShade } from '@/lib/utils';



// Helper function to map status to Tailwind colors
// const getStatusColor = (status: any) => {
//     switch (status) {
//         case 'completed':
//             return 'text-green-600 bg-green-100 border-green-400';
//         case 'in-progress':
//             return 'text-yellow-600 bg-yellow-100 border-yellow-400';
//         case 'pending':
//         default:
//             return 'text-gray-500 bg-gray-100 border-gray-300';
//     }
// };

const PhaseStep = ({ phase }: { phase: Phase }) => {
    const dotCenterOffset = '22px';
    const gapBetweenItems = '1.5rem';

    return (
        <>
            {!phase.is_active && <div className='flex flex-col justify-center items-center py-6 bg-red-50 border-red-400 border rounded-lg mt-6'>
                <span className='text-sm font-medium'>Not Required</span>
                <span className='text-xs italic'>Project have no requirenments for {phase.name} </span>
            </div>}
            {!!phase.is_active && <div className="relative px-4 py-4">
                {phase.steps.map((step, index) => {
                    // const colorClasses = getStatusColor(event.status);
                    const colorClasses = '';
                    const isFirst = index === 0;
                    const isLast = index === phase.steps.length - 1;
                    var status = 'in-progress';
                    return (
                        // mb-6 provides the vertical spacing between items.
                        <div key={step.id} className="mb-6 flex items-stretch">

                            {/* 1. Timeline Track & Dot Container (Fixed w-12 gutter for spacing) */}
                            <div className="relative w-12 flex-shrink-0">

                                {/* Line Segment (Track) */}
                                <div
                                    className={`absolute left-1/2 w-1 bg-gray-200 transform -translate-x-1/2`}
                                    style={{
                                        // 1. Clipping top: If first, start line 22px down (below the center of the first dot).
                                        top: isFirst ? dotCenterOffset : '0',

                                        // 2. Extending bottom: If not last, line height must extend into the mb-6 space (1.5rem)
                                        // If last, clip height at 22px.
                                        height: isLast
                                            ? dotCenterOffset
                                            : isFirst
                                                ? `calc(100% + ${gapBetweenItems} - ${dotCenterOffset})`
                                                : `calc(100% + ${gapBetweenItems})`,
                                    }}
                                />

                                {/* Timeline Dot/Icon - z-20 to ensure it is above the line */}
                                <div
                                    className={`absolute left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-lg border-4 z-20 
                  ${colorClasses}`}
                                    style={{ top: '0' }}
                                >
                                    <LuClock />
                                </div>
                            </div>

                            {/* 2. Content Card (Starts after the w-12 container, providing clean separation) */}
                            <div className={`flex-1 mt-1 p-3 rounded-xl shadow-sm transition-all duration-300 bg-white border border-gray-200 hover:shadow-md`}>
                                {/* mt-1 aligns the card slightly better with the center of the dot */}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-sm text-gray-800">{step.name}</h3>
                                    <span className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full whitespace-nowrap
                    ${status === 'completed' ? 'bg-green-50 text-green-700' :
                                            status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' :
                                                'bg-gray-50 text-gray-700'}`}
                                    >
                                        Pending
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                                <p className="text-[0.65rem] text-gray-400 mt-2 flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Due:
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>}
        </>

    );
};


const PhaseHeader = ({ phase }: { phase: Phase }) => {

    const backgroundColor = phase.color;
    const color = getColorShade(backgroundColor, 'dark');
    const borderColor = getColorShade(backgroundColor, 'light');
    return (
        <div className="relative flex flex-col items-start flex-1 min-w-full px-1">
            <div
                className={`relative z-10 w-full p-2 rounded-xl shadow-lg border   transition-all duration-300 transform`}
                style={{
                    backgroundColor,
                    borderColor,
                    color
                }}
            >
                <div className="flex items-center space-x-3">

                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-lg font-bold truncate">{phase.name}</h3>
                        <p className="text-xs font-medium opacity-90">
                            {phase.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OrderPhase({ state }: { state: OrderState, setState: React.Dispatch<React.SetStateAction<OrderState | undefined>> }) {
    return (
        <div className="flex overflow-x-auto p-4 space-x-8 pb-8 custom-scrollbar bg-sky-50 rounded-lg mt-3   border border-sky-300 max-w-7xl">

            {state.phases.map((phase) => (
                <div
                    key={phase.id}
                    className="min-w-[320px] max-w-sm flex-shrink-0"
                >
                    <PhaseHeader phase={phase} />

                    <PhaseStep phase={phase} />
                </div>
            ))}
        </div>
    );
};

