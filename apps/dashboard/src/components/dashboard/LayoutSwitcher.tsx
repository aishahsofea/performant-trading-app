"use client";

import { useState } from 'react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { LayoutGrid, Settings, Plus, Trash2, Edit2 } from 'lucide-react';

export const LayoutSwitcher = () => {
  const {
    layouts,
    preferences,
    isLoading,
    switchLayout,
    deleteLayout,
    saveLayout
  } = useDashboardLayout();

  const [isOpen, setIsOpen] = useState(false);
  const [showNewLayoutForm, setShowNewLayoutForm] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <LayoutGrid className="w-4 h-4 animate-pulse" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const currentLayoutName = layouts.find(l => l.id === preferences?.currentLayoutId)?.name || 'Default';

  const handleSaveNewLayout = async () => {
    if (!newLayoutName.trim()) return;

    // For demo purposes, create a basic layout
    const basicLayout = {
      widgets: [
        { id: 'performance-chart', type: 'performance-chart' as const, x: 0, y: 0, w: 8, h: 4 },
        { id: 'portfolio-summary', type: 'portfolio-summary' as const, x: 8, y: 0, w: 4, h: 4 },
      ],
      gridSettings: {
        columns: 12,
        rowHeight: 60,
        margin: [10, 10] as [number, number],
        containerPadding: [10, 10] as [number, number],
        breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480 },
        cols: { lg: 12, md: 10, sm: 6, xs: 4 }
      },
      metadata: {
        name: newLayoutName,
        description: 'Custom layout',
        category: 'custom' as const,
        tags: []
      }
    };

    const success = await saveLayout({
      name: newLayoutName,
      layout: basicLayout,
      isDefault: layouts.length === 0
    });

    if (success) {
      setNewLayoutName('');
      setShowNewLayoutForm(false);
    }
  };

  return (
    <div className="relative">
      {/* Current Layout Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        <LayoutGrid className="w-4 h-4" />
        <span>{currentLayoutName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
              Saved Layouts
            </div>
            
            {/* Layout List */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  className="flex items-center justify-between group"
                >
                  <button
                    onClick={() => switchLayout(layout.id)}
                    className={`flex-1 text-left px-2 py-1.5 text-sm rounded hover:bg-gray-700 transition-colors ${
                      layout.id === preferences?.currentLayoutId
                        ? 'text-purple-400 bg-purple-900/20'
                        : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{layout.name}</span>
                      {layout.isDefault && (
                        <span className="text-xs text-gray-500 bg-gray-700 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </button>
                  
                  {/* Actions */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                      className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete layout "${layout.name}"?`)) {
                          deleteLayout(layout.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              
              {layouts.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  No saved layouts
                </div>
              )}
            </div>

            {/* New Layout Form */}
            {showNewLayoutForm ? (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Layout name"
                    value={newLayoutName}
                    onChange={(e) => setNewLayoutName(e.target.value)}
                    className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveNewLayout();
                      if (e.key === 'Escape') {
                        setShowNewLayoutForm(false);
                        setNewLayoutName('');
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveNewLayout}
                      disabled={!newLayoutName.trim()}
                      className="flex-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 text-white rounded transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowNewLayoutForm(false);
                        setNewLayoutName('');
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <button
                  onClick={() => setShowNewLayoutForm(true)}
                  className="flex items-center space-x-2 w-full px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Current Layout</span>
                </button>
              </div>
            )}

            {/* Settings Link */}
            <div className="mt-3 pt-3 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Navigate to dashboard settings
                }}
                className="flex items-center space-x-2 w-full px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};