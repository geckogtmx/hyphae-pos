
import React, { useState, useEffect, useCallback } from 'react';
import { OrderProvider } from './context/OrderContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useMenuData } from './hooks/useMenuData';
import { useIdleTimer } from './hooks/useIdleTimer';
import OrderRail from './components/OrderRail';
import Stage from './components/Stage';
import ControlBar from './components/ControlBar';
import CapacityWidget from './components/CapacityWidget';
import SettingsScreen from './components/SettingsScreen';
import HistoryModal from './components/HistoryModal';
import LoyaltyUpgradeModal from './components/LoyaltyUpgradeModal';
import Screensaver from './components/Screensaver';
import { Menu, X, ClipboardList, History, Users, AlertCircle, Settings, ChevronRight, Sun, Moon, CloudSun } from 'lucide-react';

const AppContent = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { concepts } = useMenuData();
    const [activeConceptId, setActiveConceptId] = useState('codebs_concept');

    const [layoutRatio, setLayoutRatio] = useState(0.33);
    const [isSwapped, setIsSwapped] = useState(false);

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [showToast] = useState(false);
    const [viewMode, setViewMode] = useState<'POS' | 'SETTINGS'>('POS');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Weather Toggle State
    const [showWeather, setShowWeather] = useState(false);

    // Screensaver State (5 minutes = 300000ms)
    const { isIdle, triggerIdle, wake } = useIdleTimer(300000);

    const activeConcept = concepts.find(c => c.id === activeConceptId);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Rotate Clock/Weather every 10 seconds
    useEffect(() => {
        const weatherTimer = setInterval(() => {
            setShowWeather(prev => !prev);
        }, 10000);
        return () => clearInterval(weatherTimer);
    }, []);

    const handleSettingsClick = () => {
        setViewMode('SETTINGS');
        setActiveModal(null);
    };

    const closeSettings = () => {
        setViewMode('POS');
    };

    // Manual trigger handler that stops propagation to avoid waking the app immediately
    const handleManualScreensaver = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        triggerIdle();
    };

    // Stable handler to prevent infinite loops in Stage useEffect
    const handleLayoutChange = useCallback((ratio: number) => {
        setLayoutRatio(prev => (prev === ratio ? prev : ratio));
    }, []);

    return (
        <div className="h-screen w-screen bg-zinc-100 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 font-sans selection:bg-lime-500/30 selection:text-white flex flex-col relative transition-colors duration-300">

            {/* --- SCREENSAVER --- */}
            {isIdle && <Screensaver onWake={wake} />}

            {/* --- LOYALTY UPGRADE MODAL --- */}
            <LoyaltyUpgradeModal />

            {/* --- SETTINGS SCREEN OVERLAY --- */}
            {viewMode === 'SETTINGS' && (
                <SettingsScreen onClose={closeSettings} activeConceptId={activeConceptId} />
            )}

            {/* --- GLOBAL HEADER (Desktop) --- */}
            {!isMobile && (
                <header className="h-auto min-h-[3.5rem] bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 z-50 transition-colors duration-300 relative pt-[env(safe-area-inset-top)]">

                    {/* LEFT: LOGO */}
                    <div
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleManualScreensaver}
                        title="Click to Activate Screensaver"
                    >
                        <button className="h-8 w-8 bg-lime-400 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_10px_rgba(132,204,22,0.3)] hover:scale-105 transition-transform">
                            <span className="font-mono font-bold text-zinc-950 text-lg">H</span>
                        </button>
                        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 mr-8">HYPHAE<span className="text-lime-600 dark:text-lime-400">.POS</span></span>
                    </div>

                    {/* RIGHT: WIDGET & ICONS */}
                    <div className="flex items-center h-full py-1">
                        <div className="h-full flex items-center justify-end w-[180px] overflow-hidden mr-6">
                            <div
                                className="w-full h-full flex items-center justify-end cursor-pointer relative"
                                onClick={() => setShowWeather(!showWeather)}
                            >
                                {/* CLOCK */}
                                <div className={`absolute right-0 flex items-center justify-end transition-all duration-[2000ms] ease-in-out transform ${showWeather ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'}`}>
                                    <span className="font-mono text-xl font-bold text-zinc-600 dark:text-zinc-300 tracking-widest">
                                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* WEATHER */}
                                <div className={`absolute right-0 flex items-center justify-end space-x-3 transition-all duration-[2000ms] ease-in-out transform ${showWeather ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
                                    <CloudSun size={20} className="text-zinc-500 dark:text-zinc-400" />
                                    <div className="flex flex-col leading-none text-right">
                                        <span className="font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300">72°F</span>
                                        <span className="text-[9px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Partly Cloudy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ICON GROUP WITH EVEN SPACING */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="h-9 w-16 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-lime-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                onClick={() => setActiveModal('Active Register')}
                                className="h-9 w-16 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                title="Active Register"
                            >
                                <ClipboardList size={18} />
                            </button>
                            <button
                                onClick={() => setActiveModal('Order History')}
                                className="h-9 w-16 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                title="Order History"
                            >
                                <History size={18} />
                            </button>
                            <button
                                onClick={() => setActiveModal('Customers')}
                                className="h-9 w-16 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                title="Customers"
                            >
                                <Users size={18} />
                            </button>

                            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

                            <button
                                onClick={() => setActiveModal('SettingsMenu')}
                                className={`h-9 w-9 flex items-center justify-center rounded-xl transition-colors ${activeModal === 'SettingsMenu' ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                                title="Settings"
                            >
                                <Settings size={18} />
                            </button>
                        </div>

                        <div className="ml-4 pl-4 border-l border-zinc-200 dark:border-zinc-800 flex items-center h-full gap-4">
                            <div className="flex flex-col justify-center items-end">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase leading-none mb-1">Active Modality</span>
                                <span className="text-sm font-bold text-lime-600 dark:text-lime-400 leading-none">{activeConcept?.name || 'Loading...'}</span>
                            </div>
                            <div className="scale-75 origin-right">
                                <CapacityWidget current={28} max={50} className="w-32 py-1 px-2" />
                            </div>
                        </div>
                    </div>
                </header>
            )}

            {/* --- MOBILE HEADER --- */}
            {isMobile && (
                <div className="h-auto min-h-[3.5rem] bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0 z-50 pt-[env(safe-area-inset-top)]">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-lime-600 dark:text-lime-400"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">HYPHAE<span className="text-lime-600 dark:text-lime-400">.POS</span></span>
                    <button onClick={toggleTheme} className="text-zinc-500 dark:text-zinc-400">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            )}

            {/* --- MAIN CONTENT LAYOUT --- */}
            <div className="flex-1 flex overflow-hidden relative">

                {!isMobile ? (
                    <div className="flex w-full h-full p-2 gap-2">

                        {/* COLUMN 1: Order Rail */}
                        <div
                            style={{
                                flex: `${layoutRatio} 1 0%`,
                                order: isSwapped ? 3 : 1
                            }}
                            className={`h-full bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-950 transition-all duration-300 ease-in-out overflow-hidden relative rounded-2xl border border-zinc-200 dark:border-zinc-800 ${layoutRatio < 0.05 ? 'w-0 border-none opacity-0 !flex-none' : 'opacity-100'}`}
                        >
                            <div className="w-full h-full min-w-[250px]">
                                <OrderRail onLayoutChange={handleLayoutChange} />
                            </div>
                        </div>

                        {/* CONTROL BAR */}
                        <div style={{ order: 2 }} className="h-full z-40 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <ControlBar
                                currentRatio={layoutRatio}
                                onRatioChange={handleLayoutChange}
                                isSwapped={isSwapped}
                                onSwap={() => setIsSwapped(!isSwapped)}
                            />
                        </div>

                        {/* COLUMN 2: Stage */}
                        <div
                            style={{
                                flex: `${1 - layoutRatio} 1 0%`,
                                order: isSwapped ? 1 : 3
                            }}
                            className={`h-full min-w-0 bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-950 relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out ${layoutRatio > 0.95 ? 'w-0 border-none opacity-0 !flex-none' : 'opacity-100'}`}
                        >
                            <Stage activeConceptId={activeConceptId} onLayoutChange={handleLayoutChange} />
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 relative w-full h-full">
                        <div className={`
                    fixed inset-y-0 left-0 z-40 w-[85%] bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800
                    transform transition-transform duration-300 ease-in-out shadow-2xl
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                            <OrderRail onLayoutChange={() => setIsMobileMenuOpen(false)} />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {isMobileMenuOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                        )}
                        <Stage activeConceptId={activeConceptId} />
                    </div>
                )}
            </div>

            {/* --- TOAST NOTIFICATION --- */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 dark:bg-zinc-900 border border-lime-400/50 text-lime-400 px-6 py-3 rounded-xl shadow-2xl z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300 font-mono text-sm">
                    Settings module is locked.
                </div>
            )}

            {/* --- MODAL OVERLAY --- */}
            {activeModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                        onClick={() => setActiveModal(null)}
                    />

                    {activeModal === 'Order History' && (
                        <HistoryModal onClose={() => setActiveModal(null)} />
                    )}

                    {activeModal === 'SettingsMenu' && (
                        <div className="relative bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl shadow-2xl w-64 animate-in zoom-in-95 duration-100">
                            <div className="flex flex-col space-y-1">
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors flex justify-between items-center group rounded-lg"
                                >
                                    <span>Settings</span>
                                    <Settings size={14} className="text-zinc-400 group-hover:text-lime-600 dark:group-hover:text-lime-400" />
                                </button>
                                <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
                                <button
                                    onClick={() => setActiveModal('ModalitySelector')}
                                    className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors flex justify-between items-center group rounded-lg"
                                >
                                    <span>Modality</span>
                                    <div className="flex items-center text-xs text-zinc-500">
                                        <span className="mr-2">{activeConcept?.name}</span>
                                        <ChevronRight size={14} className="group-hover:text-lime-600 dark:group-hover:text-lime-400" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeModal === 'ModalitySelector' && (
                        <div className="relative bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-2xl w-full max-w-sm text-center animate-in zoom-in-95 duration-100">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-2">Select Modality</h3>
                            <div className="flex flex-col space-y-2">
                                {concepts.map(concept => (
                                    <button
                                        key={concept.id}
                                        onClick={() => {
                                            setActiveConceptId(concept.id);
                                            setActiveModal(null);
                                        }}
                                        className={`
                                        w-full py-4 px-6 text-left border rounded-xl transition-all
                                        flex items-center justify-between
                                        ${activeConceptId === concept.id
                                                ? 'bg-lime-50 dark:bg-lime-900/20 border-lime-500 dark:border-lime-400 text-lime-700 dark:text-lime-400'
                                                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500'}
                                    `}
                                    >
                                        <span className="font-bold text-lg">{concept.name}</span>
                                        {activeConceptId === concept.id && <div className="w-2 h-2 bg-lime-500 dark:bg-lime-400 rounded-full shadow-[0_0_8px_rgba(132,204,22,0.8)]" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveModal('SettingsMenu')}
                                className="mt-6 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 underline"
                            >
                                Back to Settings
                            </button>
                        </div>
                    )}

                    {['Active Register', 'Customers'].includes(activeModal || '') && (
                        <div className="relative bg-zinc-50 dark:bg-zinc-900 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all scale-100">
                            <div className="mx-auto w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-lime-600 dark:text-lime-400">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{activeModal}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                                This feature is currently under development. The module will be available in the next sprint release.
                            </p>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="w-full py-3 bg-lime-500 hover:bg-lime-400 text-zinc-950 font-bold uppercase tracking-wider rounded-xl transition-colors"
                            >
                                Close Console
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

const App = () => (
    <ThemeProvider>
        <OrderProvider>
            <AppContent />
        </OrderProvider>
    </ThemeProvider>
);

export default App;
