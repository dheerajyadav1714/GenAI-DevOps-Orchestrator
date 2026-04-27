"use client";
import React, { useState } from 'react';

export default function EtherealSidebar({ activeView, setActiveView, isDark, onToggleSettings, onNewChat }) {
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    { id: 'DASHBOARD', icon: 'monitoring', label: 'Dashboard' },
    { id: 'HUB', icon: 'smart_toy', label: 'Agent Hub' },
    { id: 'ACTIVITY', icon: 'timeline', label: 'Activity' },
    { id: 'CHAT', icon: 'forum', label: 'Focused Chat' },
  ];

  return (
    <aside className="fixed bottom-0 md:top-0 left-0 w-full md:w-20 h-20 md:h-full z-[60] border-t md:border-t-0 md:border-r border-outline-variant/30 transition-all duration-300 flex flex-row md:flex-col items-center justify-between md:justify-start px-6 md:px-0 md:py-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[20px_0_40px_rgba(0,0,0,0.05)] bg-surface-container-lowest/90 backdrop-blur-3xl">
      {/* Brand Icon — DevOps infinity loop style */}
      <div className={`hidden md:flex w-11 h-11 rounded-xl items-center justify-center mb-4 transition-all duration-500
        ${isDark ? 'bg-gradient-to-br from-primary to-primary-container shadow-[0_0_20px_rgba(56,189,248,0.4)]' : 'bg-primary shadow-lg'}
      `}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4.5 7V17L12 22L19.5 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-on-primary"/>
          <path d="M8 10C8 10 9.5 8 12 8C14.5 8 16 10 16 10C16 10 14.5 12 12 12C9.5 12 8 10 8 10Z" fill="currentColor" className="text-on-primary"/>
          <path d="M8 14C8 14 9.5 12 12 12C14.5 12 16 14 16 14C16 14 14.5 16 12 16C9.5 16 8 14 8 14Z" fill="currentColor" opacity="0.5" className="text-on-primary"/>
          <circle cx="12" cy="11" r="1.5" fill="currentColor" className="text-primary" opacity="0.8"/>
        </svg>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-row md:flex-col gap-2 md:gap-6 items-center flex-1 md:flex-none justify-center md:mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            aria-label={item.label}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group relative
              ${activeView === item.id 
                ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-lg scale-110'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'
              }
            `}
          >
            <span 
              className="material-symbols-outlined text-[24px]" 
              style={{ fontVariationSettings: activeView === item.id ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            
            {/* Tooltip — only on hover, not for active */}
            {activeView !== item.id && (
              <div className="absolute left-16 px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-outline-variant/30 z-[70]">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-row md:flex-col gap-3 items-center md:mb-4 relative md:mt-auto">
        {/* Settings Button */}
        <button 
          onClick={onToggleSettings}
          className="hidden md:flex w-10 h-10 items-center justify-center rounded-full transition-all duration-200 text-on-surface-variant hover:text-primary hover:bg-on-surface/5 group relative"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-300">settings</span>
          <div className="absolute left-14 px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-outline-variant/30 z-[70]">
            Settings
          </div>
        </button>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 p-0.5 border-outline-variant/50 shadow-[0_0_10px_rgba(142,213,255,0.1)] hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
            title="Profile"
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aether" 
              alt="Profile" 
              className="w-full h-full rounded-full bg-surface-container"
            />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-[65]" onClick={() => setShowProfile(false)} />
              <div className="absolute bottom-[120%] right-0 md:left-14 md:bottom-0 w-56 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[70] overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aether" 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/30"
                    />
                    <div>
                      <div className="text-sm font-bold text-on-surface">SRE Admin</div>
                      <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">ui_user</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => { setShowProfile(false); onNewChat?.(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_comment</span>
                    New Chat Session
                  </button>
                  <button 
                    onClick={() => { setShowProfile(false); onToggleSettings(); }}
                    className="md:hidden w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                  </button>
                  <button 
                    onClick={() => setShowProfile(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    About D.A.M.I
                  </button>
                </div>
                <div className="px-4 py-3 bg-surface-container border-t border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-mono text-[9px] text-on-surface-variant tracking-widest uppercase">D.A.M.I Engine v2.5</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
