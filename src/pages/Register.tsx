"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';

const Register: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        showSuccess('Sikeres regisztráció és bejelentkezés!');
        navigate('/');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">Regisztráció</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--background))',
                  inputBorder: 'hsl(var(--border))',
                  inputFocusBorder: 'hsl(var(--primary))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabel: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--foreground))',
                  messageBackground: 'hsl(var(--muted))',
                  anchorTextColor: 'hsl(var(--primary))',
                },
              },
            },
          }}
          theme="dark"
          view="sign_up" // Alapértelmezett nézet regisztrációra állítva
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email cím',
                password_label: 'Jelszó',
                email_input_placeholder: 'Email cím',
                password_input_placeholder: 'Jelszó',
                button_label: 'Bejelentkezés',
                social_auth_typography: 'Vagy jelentkezzen be',
                link_text: 'Már van fiókja? Jelentkezzen be',
                no_account_yet: 'Nincs még fiókja?',
              },
              sign_up: {
                email_label: 'Email cím',
                password_label: 'Jelszó',
                email_input_placeholder: 'Email cím',
                password_input_placeholder: 'Jelszó',
                button_label: 'Regisztráció',
                social_auth_typography: 'Vagy regisztráljon',
                link_text: 'Nincs még fiókja? Regisztráljon',
              },
              forgotten_password: {
                email_label: 'Email cím',
                password_label: 'Jelszó',
                email_input_placeholder: 'Email cím',
                button_label: 'Jelszó visszaállítása',
                link_text: 'Elfelejtette a jelszavát?',
              },
              update_password: {
                password_label: 'Új jelszó',
                password_input_placeholder: 'Új jelszó',
                button_label: 'Jelszó frissítése',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Register;