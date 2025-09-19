import React, { useState, useEffect } from 'react';
import { getMarketAnalysis } from './services/geminiService';
import type { AnalysisResult, AnalysisType, SavedAnalysis, MarketingStrategy, BusinessPlan, BrandIdentity, ProductNameSuggestions } from './types';
import { InputForm } from './components/InputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { IdeaMentorView } from './components/IdeaMentorView';
import { Sidebar } from './components/Sidebar';
import { LogoIcon } from './components/icons/LogoIcon';
import { MarketingStrategyView } from './components/MarketingStrategyView';
import { ContentGeneratorView } from './components/ContentGeneratorView';
import { AnalysisHistoryView } from './components/AnalysisHistoryView';
import { CalendarView } from './components/CalendarView';
import { useSession } from './components/SessionContextProvider';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess, showLoading, updateToast } from './utils/toast';

export type ActiveView = 'marketResearch' | 'ideaMentor' | 'contentGenerator' | 'marketingStrategy' | 'analysisHistory' | 'calendar';
export type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<ActiveView>('marketResearch');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  
  // State for Market Research
  const [productDescription, setProductDescription] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [geographicalFocus, setGeographicalFocus] = useState<string>('Magyarország');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [marketingStrategy, setMarketingStrategy] = useState<MarketingStrategy | null>(null);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[] | null>(null);
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [productNames, setProductNames] = useState<ProductNameSuggestions | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('product');
  const [keywords, setKeywords] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');

  // State for Saved Analyses
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/login');
    } else if (!isSessionLoading && session && window.location.pathname === '/login') {
      navigate('/'); // Redirect to home if already logged in and on login page
    }
  }, [session, isSessionLoading, navigate]);


  // Load saved analyses from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedAnalyses');
      if (saved) {
        setSavedAnalyses(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load saved analyses:", error);
      showError("Nem sikerült betölteni a mentett elemzéseket. A helyi tároló sérült lehet.");
      localStorage.removeItem('savedAnalyses');
    }
  }, []);

  // Save analyses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('savedAnalyses', JSON.stringify(savedAnalyses));
    } catch (error) {
      console.error("Failed to save analyses:", error);
      showError("Nem sikerült menteni az elemzéseket a helyi tárolóba.");
    }
  }, [savedAnalyses]);

  const handleAnalysis = async () => {
    if (analysisType === 'product') {
        if (!productDescription.trim()) {
            showError('Kérjük, adjon meg egy termék- vagy szolgáltatásleírást.');
            return;
        }
    } else if (analysisType === 'topic') {
        if (!keywords.trim()) {
            showError('Kérjük, adjon meg kulcsszavakat vagy egy témát.');
            return;
        }
    } else { // website
        if (!websiteUrl.trim()) {
            showError('Kérjük, adjon meg egy weboldal URL-t.');
            return;
        }
    }


    setIsLoadingAnalysis(true);
    setError(null);
    setAnalysisResult(null);
    setMarketingStrategy(null);
    setBusinessPlans(null);
    setBrandIdentity(null);
    setProductNames(null);
    const toastId = showLoading('Elemzés indítása...');

    try {
      let params;
      if (analysisType === 'product') {
        params = { type: 'product' as const, description: productDescription, industry, geo: geographicalFocus };
      } else if (analysisType === 'topic') {
        params = { type: 'topic' as const, keywords, geo: geographicalFocus };
      } else {
        params = { type: 'website' as const, url: websiteUrl, geo: geographicalFocus };
      }
      const result = await getMarketAnalysis(params);
      setAnalysisResult(result);
      setActiveView('marketResearch'); // Switch back to results view after analysis
      updateToast(toastId, 'success', 'Elemzés sikeresen elkészült!');
    } catch (e: any) {
      setError(e.message || 'Hiba történt az elemzés készítése közben.');
      updateToast(toastId, 'error', e.message || 'Hiba történt az elemzés készítése közben.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };
  
  const currentUserInput = React.useMemo(() => {
    switch (analysisType) {
        case 'product': return productDescription;
        case 'topic': return keywords;
        case 'website': return websiteUrl;
        default: return '';
    }
  }, [analysisType, productDescription, keywords, websiteUrl]);

  const isCurrentResultSaved = React.useMemo(() => {
    if (!analysisResult || !currentUserInput) return false;

    const stringifyStrategy = (strategy: MarketingStrategy | null | undefined): string => {
        if (strategy === null || strategy === undefined) {
            return 'null';
        }
        return JSON.stringify(strategy);
    };
    
    const currentStrategyJSON = stringifyStrategy(marketingStrategy);

    return savedAnalyses.some(a => 
        a.userInput === currentUserInput && 
        a.result.analysisText === analysisResult.analysisText &&
        stringifyStrategy(a.marketingStrategy) === currentStrategyJSON
    );
  }, [analysisResult, currentUserInput, savedAnalyses, marketingStrategy]);

  const handleSaveAnalysis = () => {
    if (!analysisResult || !currentUserInput) {
      showError('Nincs elemzés a mentéshez.');
      return;
    }
    
    if (isCurrentResultSaved) {
      showSuccess('Ez az elemzés már el van mentve!');
      return;
    }

    const projectName = window.prompt('Adja meg a projekt nevét:', currentUserInput);
    if (!projectName || !projectName.trim()) {
      showError('A projekt neve nem lehet üres.');
      return; // User cancelled or entered an empty name
    }

    const newSavedAnalysis: SavedAnalysis = {
      id: `analysis-${Date.now()}`,
      projectName: projectName.trim(),
      savedAt: new Date().toISOString(),
      result: analysisResult,
      userInput: currentUserInput,
      analysisType: analysisType,
      marketingStrategy: marketingStrategy,
    };
    setSavedAnalyses(prev => [newSavedAnalysis, ...prev]);
    showSuccess('Elemzés sikeresen elmentve!');
  };

  const handleDeleteAnalysis = (id: string) => {
    setSavedAnalyses(prev => prev.filter(a => a.id !== id));
    showSuccess('Elemzés sikeresen törölve!');
  };

  const handleViewSavedAnalysis = (analysis: SavedAnalysis) => {
    setAnalysisResult(analysis.result);
    setAnalysisType(analysis.analysisType);
    setMarketingStrategy(analysis.marketingStrategy || null);
    setBusinessPlans(null); // Reset business plans when loading a saved analysis
    setBrandIdentity(null); // Reset brand identity as well
    setProductNames(null); // Reset product names
    switch(analysis.analysisType) {
      case 'product':
        setProductDescription(analysis.userInput);
        setIndustry(''); // This info is not saved
        setKeywords('');
        setWebsiteUrl('');
        break;
      case 'topic':
        setKeywords(analysis.userInput);
        setProductDescription('');
        setIndustry('');
        setWebsiteUrl('');
        break;
      case 'website':
        setWebsiteUrl(analysis.userInput);
        setProductDescription('');
        setIndustry('');
        setKeywords('');
        break;
    }
    setActiveView('marketResearch');
    showSuccess(`"${analysis.projectName}" elemzés betöltve.`);
  };

  const renderMarketResearchView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      <div className="lg:col-span-4 xl:col-span-3 h-full">
          <div className="sticky top-6">
            <InputForm
              productDescription={productDescription}
              setProductDescription={setProductDescription}
              industry={industry}
              setIndustry={setIndustry}
              geographicalFocus={geographicalFocus}
              setGeographicalFocus={setGeographicalFocus}
              onAnalyze={handleAnalysis}
              isLoading={isLoadingAnalysis}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
              keywords={keywords}
              setKeywords={setKeywords}
              websiteUrl={websiteUrl}
              setWebsiteUrl={setWebsiteUrl}
            />
          </div>
      </div>
      <div className="lg:col-span-8 xl:col-span-9 h-full">
        {isLoadingAnalysis ? (
            <div className="flex items-center justify-center h-full rounded-2xl bg-card border border-border">
                <LoadingSpinner />
            </div>
        ) : error && !analysisResult ? (
            <div className="flex items-center justify-center h-full rounded-2xl bg-card border border-border">
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-center" role="alert">
                    <p className="font-semibold">Hiba történt</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </div>
        ) : analysisResult ? (
            <AnalysisResultDisplay 
                result={analysisResult}
                userInput={currentUserInput}
                analysisType={analysisType}
                theme={theme}
                onSave={handleSaveAnalysis}
                isSaved={isCurrentResultSaved}
                marketingStrategy={marketingStrategy}
                setMarketingStrategy={setMarketingStrategy}
                businessPlans={businessPlans}
                setBusinessPlans={setBusinessPlans}
                brandIdentity={brandIdentity}
                setBrandIdentity={setBrandIdentity}
                productNames={productNames}
                setProductNames={setProductNames}
            />
        ) : (
            <div className="flex flex-col items-center justify-center h-full rounded-2xl bg-card text-center p-8">
                <div className="w-16 h-16 p-3 mb-6 bg-background rounded-2xl border border-border flex items-center justify-center">
                    <LogoIcon />
                </div>
                <h2 className="text-3xl font-bold text-card-foreground">Piackutatás AI-val, 1 kattintásra</h2>
                <p className="mt-3 text-muted-foreground max-w-xl">
                    Használja a bal oldali vezérlőpultot egy új elemzés indításához. Adja meg termékét, szolgáltatását vagy egy témakört, és az AI elvégzi a kutatást, majd egy átfogó, vizuális irányítópulton jeleníti meg az eredményeket.
                </p>
            </div>
        )}
      </div>
    </div>
  );

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner message="Munkamenet betöltése..." />
      </div>
    );
  }

  if (!session) {
    // React Router handles the redirect to /login, so we don't render anything here
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} theme={theme} setTheme={setTheme} />
      <main className="flex-1 h-full overflow-y-auto p-6">
        {activeView === 'marketResearch' && renderMarketResearchView()}
        {activeView === 'ideaMentor' && <IdeaMentorView />}
        {activeView === 'contentGenerator' && <ContentGeneratorView analysisResult={analysisResult} userInput={currentUserInput} theme={theme} />}
        {activeView === 'marketingStrategy' && <MarketingStrategyView />}
        {activeView === 'analysisHistory' && <AnalysisHistoryView analyses={savedAnalyses} onView={handleViewSavedAnalysis} onDelete={handleDeleteAnalysis} theme={theme} />}
        {activeView === 'calendar' && <CalendarView marketingStrategy={marketingStrategy} />}
      </main>
    </div>
  );
};

export default App;