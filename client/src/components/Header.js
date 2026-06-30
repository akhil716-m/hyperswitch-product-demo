import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { demoModeState, debugCredentialsState } from '../utils/atoms';
import { Menu, X } from 'lucide-react';
import juspayLogo from '../assets/juspay-logo.png';
import DebugCredentialsModal from './DebugCredentialsModal';

const ComingSoonTooltip = ({ children }) => (
  <div className="group relative">
    {children}
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
      Coming Soon
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
    </div>
  </div>
);

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const [demoMode, setDemoMode] = useRecoilState(demoModeState);
  const [debugCredentials, setDebugCredentials] = useRecoilState(debugCredentialsState);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  const handleModeChange = (mode) => {
    if (mode === 'debug') {
      if (!debugCredentials) {
        setShowCredentialsModal(true);
      } else {
        setDemoMode('debug');
        localStorage.setItem('hyperswitch_demo_mode', 'debug');
        window.location.reload();
      }
    } else {
      setDemoMode('demo');
      localStorage.setItem('hyperswitch_demo_mode', 'demo');
      window.location.reload();
    }
  };

  const handleCredentialsSave = (credentials) => {
    setDebugCredentials(credentials);
    localStorage.setItem('hyperswitch_debug_credentials', JSON.stringify(credentials));
    setDemoMode('debug');
    localStorage.setItem('hyperswitch_demo_mode', 'debug');
    setShowCredentialsModal(false);
    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors lg:hidden"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <img
              src={juspayLogo}
              alt="Juspay"
              className="h-8 w-auto object-contain"
              style={{ maxWidth: '120px' }}
            />
            <div className="w-px h-6 bg-gray-700 mx-1"></div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#5e6ad2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">H</span>
            </div>
            <h1 className="text-base sm:text-xl font-semibold text-white truncate">
              <span className="sm:hidden">Hyperswitch</span>
              <span className="hidden sm:inline">Hyperswitch Demo</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {demoMode === 'debug' && (
            <button
              onClick={() => setShowCredentialsModal(true)}
              className="hidden sm:block px-3 py-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Edit Credentials
            </button>
          )}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => handleModeChange('demo')}
              className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                demoMode === 'demo'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Demo
            </button>
            <ComingSoonTooltip>
              <button
                disabled
                className="px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-gray-500 cursor-not-allowed"
              >
                Debug
              </button>
            </ComingSoonTooltip>
          </div>
        </div>
      </header>

      {showCredentialsModal && (
        <DebugCredentialsModal
          initialCredentials={debugCredentials}
          onSave={handleCredentialsSave}
          onCancel={() => setShowCredentialsModal(false)}
        />
      )}
    </>
  );
};

export default Header;