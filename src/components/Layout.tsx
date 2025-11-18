import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  onSettingsClick?: () => void;
  onHistoryClick?: () => void;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  showBottomNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  onSettingsClick,
  onHistoryClick,
  leftButton,
  rightButton,
  showBottomNav = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar
        title={title}
        onSettingsClick={onSettingsClick}
        onHistoryClick={onHistoryClick}
        leftButton={leftButton}
        rightButton={rightButton}
      />

      <main className={`pt-14 px-safe ${showBottomNav ? 'pb-28 sm:pb-32' : 'pb-6 sm:pb-8'}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {children}
        </div>
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  );
};
