"use client";
import React from 'react';

export default function SettingsPanel({ isOpen, onClose, isDark, setIsDark }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-xl" 
        onClick={onClose} 
      />
      
      {/* Settings Card */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Settings</h2>
              <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">Preferences & Configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-on-surface/5 transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Appearance */}
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Appearance</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <div>
                  <div className="text-sm font-semibold text-on-surface">Theme</div>
                  <div className="text-[11px] text-on-surface-variant">{isDark ? 'Dark Mode' : 'Light Mode'}</div>
                </div>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-outline-variant'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${isDark ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* API Configuration */}
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">API Configuration</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-on-surface-variant mb-1">Orchestrator Endpoint</div>
                <div className="bg-surface-container-low px-3 py-2 rounded-lg text-[11px] font-mono text-on-surface border border-outline-variant/20 truncate">
                  devops-orchestrator-v2-688623456290.us-central1.run.app
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-on-surface">Auto-refresh Metrics</div>
                  <div className="text-[11px] text-on-surface-variant">Every 30 seconds</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/20">
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">About</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Version</span>
                <span className="text-xs font-mono font-bold text-on-surface">2.5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Platform</span>
                <span className="text-xs font-mono font-bold text-on-surface">GCP Cloud Run</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">AI Engine</span>
                <span className="text-xs font-mono font-bold text-primary">Gemini + ADK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Database</span>
                <span className="text-xs font-mono font-bold text-on-surface">AlloyDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
