import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ParticleBackground } from './components/Layout/ParticleBackground';
import { TabNavigation } from './components/Tabs/TabNavigation';
import { SearchRoutes } from './components/Pages/SearchRoutes';
import { BookTickets } from './components/Pages/BookTickets';
import { Dashboard } from './components/Pages/Dashboard';
export function App() {
  const [activeTab, setActiveTab] = useState('search');
  return <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
              {activeTab === 'search' && <SearchRoutes />}
              {activeTab === 'book' && <BookTickets />}
              {activeTab === 'dashboard' && <Dashboard />}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>;
}