'use client';

import Sidebar from './Sidebar';
import BottomTabs from './BottomTabs';
import { useRuleSci } from '@/lib/context';
import LabMode from './LabMode';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { labMode } = useRuleSci();

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main
                className={`flex-1 flex flex-col pt-6 pb-[100px] md:pb-20 md:ml-[240px] px-6 transition-all duration-300 ${labMode ? 'focus-mode' : ''
                    }`}
            >
                <div className="max-w-[480px] md:max-w-[800px] mx-auto w-full">
                    {children}
                </div>
            </main>

            {!labMode && <BottomTabs />}
            {labMode && <LabMode />}

            {/* Legal Footer - Only on desktop or hidden in app? The prompt says centered centered centered. */}
            {/* We'll keep it simple for now as per the prompt's focus on the 5 tabs. */}
        </div>
    );
}
