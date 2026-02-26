import { useState, type ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface TabGroupProps {
    tabs: Tab[];
    children: (activeTabId: string) => ReactNode;
    defaultTabId?: string;
}

export default function TabGroup({ tabs, children, defaultTabId }: TabGroupProps) {
    const [activeId, setActiveId] = useState(defaultTabId || tabs[0]?.id || '');

    return (
        <div>
            <div className="flex flex-wrap gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeId === tab.id}
                        className={`px-4 py-2 text-sm font-bold rounded transition-colors flex items-center gap-1.5 ${activeId === tab.id
                                ? 'bg-accent text-white'
                                : 'text-primary hover:bg-gray-100'
                            }`}
                        onClick={() => setActiveId(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-3">{children(activeId)}</div>
        </div>
    );
}
