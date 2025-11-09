import React from 'react';

type Props = {
    size?: number; // dot diameter in px
    label?: string;
    color?: string; // CSS color for the dot (defaults to red)
    className?: string;
};

export default function LiveBadge({ size = 10, label, color = '#ef4444', className = '' }: Props) {
    const dotStyle: React.CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        boxShadow: `0 0 ${Math.max(6, size / 1.5)}px ${color}`,
    };

    return (
        <div className={`inline-flex items-center gap-2 ${className}`} aria-live="polite">
            <span className="relative inline-flex items-center justify-center">
                {/* outer pulse */}
                <span
                    className="absolute rounded-full opacity-70 animate-ping"
                    style={{ ...dotStyle, width: `${size * 2}px`, height: `${size * 2}px`, backgroundColor: color }}
                    aria-hidden
                />

                {/* center dot */}
                <span
                    className="relative rounded-full"
                    style={dotStyle}
                    aria-hidden
                />
            </span>

            {!!label && (
                <span className="text-xs font-semibold uppercase" style={{ color }}>
                    {label}
                </span>
            )}
        </div>
    );
}
