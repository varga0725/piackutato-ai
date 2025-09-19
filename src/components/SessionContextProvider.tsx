"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { showSuccess, showError } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        showError('Hiba történt a munkamenet betöltésekor.');
      }
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        showSuccess('Sikeres bejelentkezés!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        showSuccess('Sikeres kijelentkezés!');
        navigate('/login');
      } else if (event === 'USER_UPDATED') {
        showSuccess('Felhasználói adatok frissítve!');
      } else if (event === 'PASSWORD_RECOVERY') {
        showSuccess('Jelszó visszaállítási link elküldve!');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [navigate]);

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};