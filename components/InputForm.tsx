import React from 'react';
import type { AnalysisType } from '../types';

interface InputFormProps {
  productDescription: string;
  setProductDescription: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  geographicalFocus: string;
  setGeographicalFocus: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  analysisType: AnalysisType;
  setAnalysisType: (value: AnalysisType) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (value: string) => void;
}

interface FieldProps {
    label: string;
    id: string;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & FieldProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1.5">
            {label}
        </label>
        <input
            id={id}
            {...props}
            className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground text-sm"
        />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1.5">
            {label}
        </label>
        <textarea
            id={id}
            {...props}
            className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground resize-none text-sm"
        />
    </div>
);

export const InputForm: React.FC<InputFormProps> = ({ 
    productDescription, 
    setProductDescription, 
    industry,
    setIndustry,
    geographicalFocus,
    setGeographicalFocus,
    onAnalyze, 
    isLoading,
    analysisType,
    setAnalysisType,
    keywords,
    setKeywords,
    websiteUrl,
    setWebsiteUrl,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };
    
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full">
        <div className="mb-6">
            <h2 className="text-xl font-bold text-card-foreground">Elemzés indítása</h2>
            <p className="text-sm text-muted-foreground mt-1">Adja meg a részleteket</p>
        </div>

        <div className="bg-background border border-border p-1 rounded-lg flex space-x-1 mb-6">
            <button
                type="button"
                onClick={() => setAnalysisType('product')}
                disabled={isLoading}
                className={`w-1/3 px-3 py-1.5 text-sm font-semibold transition-colors duration-200 rounded-md ${analysisType === 'product' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Termék
            </button>
            <button
                type="button"
                onClick={() => setAnalysisType('topic')}
                disabled={isLoading}
                className={`w-1/3 px-3 py-1.5 text-sm font-semibold transition-colors duration-200 rounded-md ${analysisType === 'topic' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Téma
            </button>
            <button
                type="button"
                onClick={() => setAnalysisType('website')}
                disabled={isLoading}
                className={`w-1/3 px-3 py-1.5 text-sm font-semibold transition-colors duration-200 rounded-md ${analysisType === 'website' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                Weboldal
            </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {analysisType === 'product' ? (
            <>
                <TextareaField
                    id="product-description"
                    rows={5}
                    label="Termék vagy szolgáltatás"
                    placeholder="Pl.: 'környezetbarát tisztítószereket árusító webshop...'"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <InputField
                    type="text"
                    id="industry"
                    label="Iparág (opcionális)"
                    placeholder="Pl.: 'e-kereskedelem'"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={isLoading}
                />
                <InputField
                    type="text"
                    id="geo-focus"
                    label="Földrajzi fókusz"
                    placeholder="Pl.: 'Magyarország'"
                    value={geographicalFocus}
                    onChange={(e) => setGeographicalFocus(e.target.value)}
                    disabled={isLoading}
                />
            </>
        ) : analysisType === 'topic' ? (
            <>
                <TextareaField
                    id="keywords"
                    rows={5}
                    label="Kulcsszavak vagy téma"
                    placeholder="Pl.: 'fenntartható divat Magyarországon'"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    disabled={isLoading}
                    required
                />
                 <InputField
                    type="text"
                    id="geo-focus-topic"
                    label="Földrajzi fókusz"
                    placeholder="Pl.: 'Budapest'"
                    value={geographicalFocus}
                    onChange={(e) => setGeographicalFocus(e.target.value)}
                    disabled={isLoading}
                />
            </>
        ) : (
             <>
                <InputField
                    type="url"
                    id="website-url"
                    label="Weboldal URL"
                    placeholder="https://peldaweboldal.hu"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    disabled={isLoading}
                    required
                />
                 <InputField
                    type="text"
                    id="geo-focus-website"
                    label="Földrajzi fókusz (opcionális)"
                    placeholder="Pl.: 'Magyarország'"
                    value={geographicalFocus}
                    onChange={(e) => setGeographicalFocus(e.target.value)}
                    disabled={isLoading}
                />
            </>
        )}

        <button
          type="submit"
          disabled={
            isLoading ||
            (analysisType === 'product' ? !productDescription.trim() : 
             analysisType === 'topic' ? !keywords.trim() : 
             !websiteUrl.trim())
          }
          className="mt-4 w-full flex items-center justify-center font-semibold bg-primary text-primary-foreground py-3 px-6 rounded-lg transition-all duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary text-base"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Elemzés...
            </>
          ) : (
            'Elemzés indítása'
          )}
        </button>
      </form>
