import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#ef4444', fontFamily: 'sans-serif', backgroundColor: '#1e293b', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center' }}>Hiba történt az alkalmazás betöltésekor.</h1>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '16px' }}>{this.state.error?.message}</p>
              <pre style={{ fontSize: '12px', overflow: 'auto', color: '#fca5a5', whiteSpace: 'pre-wrap', maxHeight: '300px' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: '24px', width: '100%', padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s' }}
            >
              Oldal újratöltése
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);