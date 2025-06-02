import React from 'react';
import { SearchIcon, TicketIcon, LayoutDashboardIcon } from 'lucide-react';
interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export const TabNavigation = ({
  activeTab,
  setActiveTab
}: TabNavigationProps) => {
  const tabs = [{
    id: 'search',
    label: 'Search Routes',
    icon: <SearchIcon className="h-5 w-5" />
  }, {
    id: 'book',
    label: 'Book Tickets',
    icon: <TicketIcon className="h-5 w-5" />
  }, {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon className="h-5 w-5" />
  }];
  return <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      {tabs.map(tab => <button key={tab.id} className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-white/20 text-white shadow-lg scale-105 border border-white/30' : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'}`} onClick={() => setActiveTab(tab.id)}>
          {tab.icon}
          <span className="font-medium">{tab.label}</span>
        </button>)}
    </div>;
};