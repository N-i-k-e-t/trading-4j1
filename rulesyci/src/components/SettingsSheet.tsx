'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    LogOut, 
    User, 
    Bell, 
    Moon, 
    ChevronRight, 
    ShieldCheck, 
    HelpCircle 
} from 'lucide-react';
import { useRuleSci } from '@/lib/context';

export default function SettingsSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { logout, user } = useRuleSci();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{ y: '100%' }} 
                        animate={{ y: 0 }} 
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[201] max-h-[85vh] overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+20px)] shadow-[0_-8px_40px_rgba(0,0,0,0.1)]"
                    >
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4" />
                        
                        <div className="px-6 py-2">
                            <header className="flex items-center justify-between mb-8">
                                <h3 className="text-[20px] font-black text-[#1a1a2e]">Settings</h3>
                                <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <X size={20} />
                                </button>
                            </header>

                            {/* User Profile Info */}
                            <div className="bg-gray-50 rounded-[28px] p-6 mb-8 flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#1a1a2e] flex items-center justify-center text-xl font-black text-white shadow-lg">
                                    {user?.name?.substring(0, 2).toUpperCase() || 'TR'}
                                </div>
                                <div>
                                    <h4 className="text-[18px] font-black text-[#1a1a2e]">{user?.name || 'Trader'}</h4>
                                    <p className="text-[12px] font-bold text-gray-400 tracking-wide">{user?.email || 'trader@rulesci.app'}</p>
                                    <div className="mt-2 inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {user?.isPro ? 'Pro Member' : 'Trial Active'}
                                    </div>
                                </div>
                            </div>

                            {/* Settings Groups */}
                            <div className="flex flex-col gap-6 mb-12">
                                <section>
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Account & Security</h5>
                                    <div className="flex flex-col gap-2">
                                        <SettingItem icon={<User size={18}/>} label="Personal Information" />
                                        <SettingItem icon={<ShieldCheck size={18}/>} label="Security & Password" />
                                    </div>
                                </section>

                                <section>
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferences</h5>
                                    <div className="flex flex-col gap-2">
                                        <SettingItem icon={<Bell size={18}/>} label="Notifications" />
                                        <SettingItem icon={<Moon size={18}/>} label="Theme" value="Light" />
                                    </div>
                                </section>

                                <section>
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Support</h5>
                                    <div className="flex flex-col gap-2">
                                        <SettingItem icon={<HelpCircle size={18}/>} label="Help Center" />
                                    </div>
                                </section>
                            </div>

                            <button 
                                onClick={logout}
                                className="w-full h-16 bg-red-50 text-red-600 rounded-[24px] flex items-center justify-center gap-3 text-[15px] font-black uppercase tracking-widest active:scale-[0.98] transition-all"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function SettingItem({ icon, label, value }: { icon: any, label: string, value?: string }) {
    return (
        <button className="w-full h-14 bg-white border border-gray-100/50 flex items-center justify-between px-5 rounded-2xl active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 text-[#1a1a2e]">
                <div className="text-gray-400">{icon}</div>
                <span className="text-[14px] font-bold">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className="text-[13px] font-bold text-gray-400 mr-1">{value}</span>}
                <ChevronRight size={16} className="text-gray-200" />
            </div>
        </button>
    );
}
