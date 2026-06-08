interface RetiScanLogoProps {
    size?: number;
    className?: string;
    /** Main color for eye outline, brackets, and text */
    color?: string;
    /** Color for the inner iris ring */
    irisColor?: string;
    /** Color for the dark pupil */
    pupilColor?: string;
    /** Color for the highlight dot in the pupil */
    highlightColor?: string;
    /** Whether to animate the scanning brackets */
    animateScan?: boolean;
    /** Whether to animate the iris/pupil pulse */
    animatePulse?: boolean;
}

export function RetiScanLogo({
    size = 120,
    className = '',
    color = '#6366f1',
    irisColor = '#3b4f7a',
    pupilColor = '#2d3748',
    highlightColor = '#ffffff',
    animateScan = false,
    animatePulse = false,
}: RetiScanLogoProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 220"
            width={size}
            height={size * 1.1}
            className={className}
            fill="none"
        >
            {/* Animation definitions */}
            {animateScan && (
                <defs>
                    <style>{`
            @keyframes scanPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
            @keyframes scanMove {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(-3px, -3px); }
              75% { transform: translate(3px, 3px); }
            }
            .scan-bracket { animation: scanPulse 2s ease-in-out infinite; }
            .scan-tl { animation: scanMove 3s ease-in-out infinite; }
            .scan-tr { animation: scanMove 3s ease-in-out infinite 0.5s; }
            .scan-bl { animation: scanMove 3s ease-in-out infinite 1s; }
            .scan-br { animation: scanMove 3s ease-in-out infinite 1.5s; }
          `}</style>
                </defs>
            )}
            {animatePulse && (
                <defs>
                    <style>{`
            @keyframes irisPulse {
              0%, 100% { transform: scale(1); transform-origin: 100px 95px; }
              50% { transform: scale(1.05); transform-origin: 100px 95px; }
            }
            @keyframes pupilPulse {
              0%, 100% { transform: scale(1); transform-origin: 100px 95px; }
              50% { transform: scale(0.9); transform-origin: 100px 95px; }
            }
            @keyframes highlightGlow {
              0%, 100% { opacity: 1; r: 6; }
              50% { opacity: 0.7; r: 8; }
            }
            .iris-animate { animation: irisPulse 2s ease-in-out infinite; }
            .pupil-animate { animation: pupilPulse 2s ease-in-out infinite; }
            .highlight-animate { animation: highlightGlow 2s ease-in-out infinite; }
          `}</style>
                </defs>
            )}

            {/* ===== SCANNER BRACKETS ===== */}
            {/* Top-left bracket */}
            <g className={animateScan ? 'scan-bracket scan-tl' : ''}>
                <path d="M 15 10 L 15 35" stroke={color} strokeWidth="10" strokeLinecap="square" />
                <path d="M 15 10 L 45 10" stroke={color} strokeWidth="10" strokeLinecap="square" />
            </g>

            {/* Top-right bracket */}
            <g className={animateScan ? 'scan-bracket scan-tr' : ''}>
                <path d="M 185 10 L 185 35" stroke={color} strokeWidth="10" strokeLinecap="square" />
                <path d="M 185 10 L 155 10" stroke={color} strokeWidth="10" strokeLinecap="square" />
            </g>

            {/* Bottom-left bracket */}
            <g className={animateScan ? 'scan-bracket scan-bl' : ''}>
                <path d="M 15 180 L 15 155" stroke={color} strokeWidth="10" strokeLinecap="square" />
                <path d="M 15 180 L 45 180" stroke={color} strokeWidth="10" strokeLinecap="square" />
            </g>

            {/* Bottom-right bracket */}
            <g className={animateScan ? 'scan-bracket scan-br' : ''}>
                <path d="M 185 180 L 185 155" stroke={color} strokeWidth="10" strokeLinecap="square" />
                <path d="M 185 180 L 155 180" stroke={color} strokeWidth="10" strokeLinecap="square" />
            </g>

            {/* ===== EYE SHAPE (diamond-like outline) ===== */}
            <path
                d="M 100 40 C 140 40, 170 65, 185 95 C 170 125, 140 150, 100 150 C 60 150, 30 125, 15 95 C 30 65, 60 40, 100 40 Z"
                stroke={color}
                strokeWidth="9"
                fill="none"
            />

            {/* ===== OUTER IRIS RING ===== */}
            <circle
                cx="100"
                cy="95"
                r="42"
                stroke={color}
                strokeWidth="6"
                fill="none"
                className={animatePulse ? 'iris-animate' : ''}
            />

            {/* ===== INNER IRIS / PUPIL ===== */}
            {/* Dark pupil base */}
            <circle
                cx="100"
                cy="95"
                r="28"
                fill={pupilColor}
                className={animatePulse ? 'pupil-animate' : ''}
            />

            {/* Inner iris gradient circle */}
            <circle
                cx="100"
                cy="95"
                r="22"
                fill={irisColor}
                opacity="0.8"
                className={animatePulse ? 'pupil-animate' : ''}
            />

            {/* Highlight dot */}
            <circle
                cx="112"
                cy="83"
                r="6"
                fill={highlightColor}
                className={animatePulse ? 'highlight-animate' : ''}
            />

            {/* ===== RETISCAN TEXT ===== */}
            <text
                x="100"
                y="210"
                textAnchor="middle"
                fontFamily="'Inter', 'Segoe UI', sans-serif"
                fontWeight="700"
                fontSize="22"
                letterSpacing="8"
                fill={color}
            >
                RETISCAN
            </text>
        </svg>
    );
}
