import { useState, useEffect, useCallback } from 'react';
import {
    Eye, Camera, CheckCircle2, AlertTriangle,
    BarChart3, User, Home, Settings, X, Scan,
    Activity, FileText, ChevronRight, ArrowLeft
} from 'lucide-react';

type Screen = 'home' | 'scan' | 'processing' | 'results';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/* ─── Simulated Results Data ─── */
const diagnosisData = {
    severity: 'Moderada',
    confidence: 94.7,
    findings: [
        { name: 'Microaneurismas', count: 3, severity: 'moderate' },
        { name: 'Hemorragias', count: 1, severity: 'mild' },
        { name: 'Exudados duros', count: 2, severity: 'moderate' },
    ],
    recommendation: 'Referir a especialista para evaluación detallada en los próximos 30 días.',
};

/* ─── Processing Animation Dots ─── */
function ProcessingDots() {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const id = setInterval(() => setDots(d => (d.length >= 3 ? '' : d + '.')), 400);
        return () => clearInterval(id);
    }, []);
    return <span>{dots}</span>;
}

/* ─── Animated Progress Ring ─── */
function ProgressRing({ progress, size = 80 }: { progress: number; size?: number }) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="#1e293b" strokeWidth={strokeWidth}
            />
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ccff" />
                    <stop offset="100%" stopColor="#0066ff" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* ─── HOME Screen ─── */
function HomeScreen({ onScan }: { onScan: () => void }) {
    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-4 py-2 text-[10px] text-white/60">
                <span>9:41</span>
                <div className="flex gap-1 items-center">
                    <Activity className="w-3 h-3" />
                    <div className="w-5 h-2.5 border border-white/40 rounded-[2px] relative">
                        <div className="absolute inset-[1px] right-[40%] bg-green-400 rounded-[1px]" />
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="px-4 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">RetiScan</div>
                        <div className="text-[10px] text-cyan-400">Pro • Conectado</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 px-4 mb-4">
                {[
                    { label: 'Hoy', value: '12', icon: Scan },
                    { label: 'Pendientes', value: '3', icon: FileText },
                    { label: 'Precisión', value: '94.7%', icon: BarChart3 },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
                        <stat.icon className="w-3.5 h-3.5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-sm font-bold">{stat.value}</div>
                        <div className="text-[9px] text-white/50">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Analyses */}
            <div className="px-4 mb-3">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Últimos Análisis</div>
                {[
                    { name: 'María García', time: 'Hace 2h', status: 'Normal', color: 'text-green-400' },
                    { name: 'Carlos López', time: 'Hace 4h', status: 'Moderada', color: 'text-orange-400' },
                ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between py-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-white/60" />
                            </div>
                            <div>
                                <div className="text-xs font-medium">{item.name}</div>
                                <div className="text-[10px] text-white/40">{item.time}</div>
                            </div>
                        </div>
                        <div className={`text-[10px] font-semibold ${item.color}`}>{item.status}</div>
                    </div>
                ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Scan Button */}
            <div className="px-4 pb-4">
                <button
                    onClick={onScan}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-[0.97] transition-all"
                >
                    <Camera className="w-4 h-4" />
                    Nuevo Análisis
                </button>
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-around items-center py-2 border-t border-white/10 bg-white/5">
                {[
                    { icon: Home, label: 'Inicio', active: true },
                    { icon: FileText, label: 'Historial', active: false },
                    { icon: BarChart3, label: 'Reportes', active: false },
                    { icon: Settings, label: 'Ajustes', active: false },
                ].map((tab) => (
                    <div key={tab.label} className={`flex flex-col items-center gap-0.5 ${tab.active ? 'text-cyan-400' : 'text-white/30'}`}>
                        <tab.icon className="w-4 h-4" />
                        <span className="text-[8px]">{tab.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── SCAN Screen ─── */
function ScanScreen({ onCapture, onBack }: { onCapture: () => void; onBack: () => void }) {
    const [flash, setFlash] = useState(false);

    const handleCapture = () => {
        setFlash(true);
        setTimeout(() => {
            setFlash(false);
            onCapture();
        }, 300);
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            {/* Flash overlay */}
            {flash && (
                <div className="absolute inset-0 bg-white z-50 animate-pulse" />
            )}

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 relative z-10">
                <button onClick={onBack} className="p-1">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold">Capturar Imagen</span>
                <div className="w-5" />
            </div>

            {/* Viewfinder */}
            <div className="flex-1 relative mx-4 my-2 rounded-2xl overflow-hidden">
                {/* Simulated retina image background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-red-900 to-orange-950 flex items-center justify-center">
                    {/* Eye simulation */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-800 via-red-600 to-orange-700 shadow-inner flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-600 via-yellow-600 to-orange-500 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-gray-900 shadow-lg flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white/60 rounded-full" />
                                </div>
                            </div>
                            {/* Blood vessels */}
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                                <div
                                    key={angle}
                                    className="absolute w-[1px] h-12 bg-red-400/40 origin-bottom"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        bottom: '50%',
                                        left: '50%',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scanning grid overlay */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-cyan-400/20" />
                    ))}
                </div>

                {/* Scanning line animation */}
                <div
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{
                        animation: 'scanLine 2s ease-in-out infinite',
                        top: '0',
                    }}
                />
                <style>{`
          @keyframes scanLine {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}</style>

                {/* Corner brackets */}
                {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} w-6 h-6`}
                        style={{
                            borderColor: '#00ccff',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            ...(i === 0 ? { borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' } : {}),
                            ...(i === 1 ? { borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' } : {}),
                            ...(i === 2 ? { borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' } : {}),
                            ...(i === 3 ? { borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' } : {}),
                        }}
                    />
                ))}
            </div>

            {/* Instructions */}
            <div className="text-center py-2">
                <div className="text-xs text-white/60">Centra el fondo de ojo en el visor</div>
                <div className="text-[10px] text-cyan-400 mt-1">Enfoque automático activo</div>
            </div>

            {/* Capture button */}
            <div className="flex justify-center pb-6 pt-2">
                <button
                    onClick={handleCapture}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-cyan-100 transition-colors">
                        <Camera className="w-6 h-6 text-slate-900" />
                    </div>
                </button>
            </div>
        </div>
    );
}

/* ─── PROCESSING Screen ─── */
function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState(0);

    const stages = [
        'Cargando imagen',
        'Pre-procesando retina',
        'Detectando microaneurismas',
        'Analizando hemorragias',
        'Evaluando exudados',
        'Clasificando severidad',
        'Generando reporte',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                const next = p + 4; // Faster increment
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 300); // Faster transition to results
                    return 100;
                }
                setStage(Math.min(Math.floor(next / (100 / stages.length)), stages.length - 1));
                return next;
            });
        }, 60); // Faster interval
        return () => clearInterval(interval);
    }, [onComplete, stages.length]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white items-center justify-center px-6">
            {/* Ring */}
            <div className="relative mb-6">
                <ProgressRing progress={progress} size={100} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{progress}%</span>
                </div>
            </div>

            {/* Stage */}
            <div className="text-center mb-8">
                <div className="text-sm font-semibold mb-1">
                    Procesando<ProcessingDots />
                </div>
                <div className="text-xs text-cyan-400 h-4">
                    {stages[stage]}
                </div>
            </div>

            {/* Neural Network Animation */}
            <div className="w-full max-w-[200px] h-20 relative">
                {/* Nodes */}
                {[
                    { x: 10, y: 40 }, { x: 50, y: 15 }, { x: 50, y: 65 },
                    { x: 100, y: 25 }, { x: 100, y: 55 },
                    { x: 150, y: 40 }, { x: 190, y: 40 },
                ].map((node, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                        style={{
                            left: node.x,
                            top: node.y,
                            animation: `pulse 1.5s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                            boxShadow: '0 0 8px rgba(0, 204, 255, 0.6)',
                        }}
                    />
                ))}
                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                    {[
                        [16, 46, 56, 21], [16, 46, 56, 71],
                        [56, 21, 106, 31], [56, 21, 106, 61],
                        [56, 71, 106, 31], [56, 71, 106, 61],
                        [106, 31, 156, 46], [106, 61, 156, 46],
                        [156, 46, 196, 46],
                    ].map(([x1, y1, x2, y2], i) => (
                        <line
                            key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="#00ccff" strokeWidth="1" opacity="0.3"
                            strokeDasharray="4 2"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="6" to="0" dur="1s"
                                repeatCount="indefinite"
                            />
                        </line>
                    ))}
                </svg>
            </div>

            <div className="text-[10px] text-white/30 mt-6">Motor de IA v3.2 — TensorFlow</div>
        </div>
    );
}

/* ─── RESULTS Screen ─── */
function ResultsScreen({ onReset }: { onReset: () => void }) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowDetails(true), 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold">Resultado del Análisis</span>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>

            <div className="flex-1 overflow-auto px-4 pb-4 space-y-3">
                {/* Severity Card */}
                <div
                    className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 text-center"
                    style={{
                        opacity: showDetails ? 1 : 0,
                        transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-400">Retinopatía {diagnosisData.severity}</div>
                    <div className="text-xs text-white/60 mt-1">
                        Confianza: <span className="text-cyan-400 font-semibold">{diagnosisData.confidence}%</span>
                    </div>
                </div>

                {/* Findings */}
                <div
                    style={{
                        opacity: showDetails ? 1 : 0,
                        transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                    }}
                >
                    <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Hallazgos</div>
                    {diagnosisData.findings.map((finding) => (
                        <div
                            key={finding.name}
                            className="flex items-center justify-between py-2 border-b border-white/5"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${finding.severity === 'mild' ? 'bg-yellow-400' : 'bg-orange-400'
                                    }`} />
                                <span className="text-xs">{finding.name}</span>
                            </div>
                            <span className="text-xs font-semibold text-white/70">{finding.count} detectados</span>
                        </div>
                    ))}
                </div>

                {/* Heatmap preview */}
                <div
                    style={{
                        opacity: showDetails ? 1 : 0,
                        transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                    }}
                >
                    <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">Mapa de Calor</div>
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-950 via-red-900 to-orange-950 h-28 flex items-center justify-center">
                        {/* Simulated heatmap spots */}
                        <div className="absolute w-6 h-6 bg-red-500/60 rounded-full blur-md" style={{ top: '30%', left: '35%' }} />
                        <div className="absolute w-4 h-4 bg-yellow-500/50 rounded-full blur-sm" style={{ top: '55%', left: '60%' }} />
                        <div className="absolute w-5 h-5 bg-orange-500/50 rounded-full blur-md" style={{ top: '40%', left: '55%' }} />
                        <div className="w-16 h-16 rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-cyan-400/60" />
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div
                    className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3"
                    style={{
                        opacity: showDetails ? 1 : 0,
                        transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                    }}
                >
                    <div className="text-[10px] font-semibold text-cyan-400 mb-1">Recomendación Clínica</div>
                    <div className="text-[11px] text-white/70 leading-relaxed">{diagnosisData.recommendation}</div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 space-y-2">
                <button className="w-full py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
                    <FileText className="w-3.5 h-3.5" />
                    Descargar PDF
                </button>
                <button
                    onClick={onReset}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                >
                    <Camera className="w-3.5 h-3.5" />
                    Nuevo Análisis
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════
   ██  MAIN DEMO MODAL COMPONENT  ██
   ═══════════════════════════════════ */
export function DemoModal({ isOpen, onClose }: DemoModalProps) {
    const [screen, setScreen] = useState<Screen>('home');
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback((next: Screen) => {
        setTransitioning(true);
        setTimeout(() => {
            setScreen(next);
            setTransitioning(false);
        }, 300);
    }, []);

    const reset = useCallback(() => {
        goTo('home');
    }, [goTo]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setScreen('home');
            setTransitioning(false);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
                animation: 'fadeIn 0.3s ease',
            }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Content container */}
            <div
                className="relative z-10 flex flex-col lg:flex-row items-center gap-8"
                style={{ animation: 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Left info */}
                <div className="text-white text-center lg:text-left max-w-sm">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                        Prueba RetiScan
                    </h3>
                    <p className="text-white/70 mb-4 text-sm leading-relaxed">
                        Explora la interfaz interactiva. Toca los botones del teléfono para
                        simular un análisis completo de retinopatía diabética.
                    </p>
                    <div className="flex flex-col gap-2 text-xs text-white/50">
                        <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-cyan-400" />
                            <span>Toca <strong className="text-white/80">Nuevo Análisis</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-cyan-400" />
                            <span>Captura la imagen retinal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-cyan-400" />
                            <span>Observa el procesamiento de IA</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-cyan-400" />
                            <span>Revisa los resultados del diagnóstico</span>
                        </div>
                    </div>
                </div>

                {/* Phone frame */}
                <div className="relative">
                    {/* Glow behind phone */}
                    <div className="absolute -inset-6 bg-cyan-500/10 rounded-[3rem] blur-2xl" />

                    {/* Phone body */}
                    <div className="relative w-[280px] h-[560px] bg-slate-950 rounded-[2.5rem] border-[6px] border-slate-700 shadow-2xl shadow-black/50 overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-b-2xl z-30" />

                        {/* Screen content with transition */}
                        <div
                            className="w-full h-full"
                            style={{
                                opacity: transitioning ? 0 : 1,
                                transform: transitioning ? 'scale(0.95)' : 'scale(1)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {screen === 'home' && <HomeScreen onScan={() => goTo('scan')} />}
                            {screen === 'scan' && (
                                <ScanScreen
                                    onCapture={() => goTo('processing')}
                                    onBack={() => goTo('home')}
                                />
                            )}
                            {screen === 'processing' && (
                                <ProcessingScreen onComplete={() => goTo('results')} />
                            )}
                            {screen === 'results' && <ResultsScreen onReset={reset} />}
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-30" />
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 lg:-top-4 lg:-right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all hover:rotate-90 duration-300"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8) translateY(40px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    );
}
