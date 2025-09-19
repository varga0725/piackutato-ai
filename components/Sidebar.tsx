import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { ThemeToggle } from './ThemeToggle';
import type { ActiveView, Theme } from '../App';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { useSession } from '../src/components/SessionContextProvider'; // Kijavítva
import { supabase } from '../src/integrations/supabase/client'; // Kijavítva
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../src/utils/toast'; // Kijavítva
import { ArrowRightOnRectangleIcon } from './icons/ArrowRightOnRectangleIcon';
import { UserIcon } from './icons/UserIcon';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const NavItem: React.FC<{
  view: ActiveView;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, theme, setTheme }) => {
  const { session, user } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Hiba történt a kijelentkezés során: ' + error.message);
    } else {
      showSuccess('Sikeresen kijelentkezett!');
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8">
            <LogoIcon />
        </div>
        <h1 className="text-lg font-bold text-foreground">Piackutató AI</h1>
      </div>

      <nav className="flex-grow space-y-2">
        <NavItem
          view="marketResearch"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<BarChartIcon className="w-5 h-5" />}
          label="Piackutatás"
        />
        <NavItem
          view="analysisHistory"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<BookmarkIcon className="w-5 h-5" />}
          label="Elemzések"
        />
        <NavItem
          view="ideaMentor"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
          label="Ötlet Mentor"
        />
         <NavItem
          view="marketingStrategy"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<MegaphoneIcon className="w-5 h-5" />}
          label="Marketing Stratégia"
        />
        <NavItem
          view="contentGenerator"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<DocumentTextIcon className="w-5 h-5" />}
          label="Tartalomgenerátor"
        />
        <NavItem
          view="calendar"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<CalendarIcon className="w-5 h-5" />}
          label="Naptár"
        />
      </nav>

      <div className="mt-auto space-y-4">
        {session ? (
          <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground truncate">{user?.email || 'Felhasználó'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Kijelentkezés"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            Bejelentkezés
          </button>
        )}
        <div className="flex items-center justify-between p-2 bg-background rounded-lg border border-border">
          <p className="text-sm font-semibold text-muted-foreground">Téma</p>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
         <p className="text-center text-xs text-muted-foreground mt-4">Powered by Gemini AI</p>
      </div>
    </aside>
  );
};