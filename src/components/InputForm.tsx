import React from 'react';
import type { AnalysisType } from '../../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ProductIcon } from './icons/ProductIcon';
import { SearchIcon } from './icons/SearchIcon';
import { LinkIcon } from './icons/LinkIcon';

interface InputFormProps {
  productDescription: string;
  setProductDescription: (description: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  geographicalFocus: string;
  setGeographicalFocus: (focus: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  analysisType: AnalysisType;
  setAnalysisType: (type: AnalysisType) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
}

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode }> = ({ label, id, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
            <input
                id={id}
                {...props}
                className={`w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
            {label}
        </label>
        <textarea
            id={id}
            {...props}
            className="w-full p-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 text-foreground placeholder:text-muted-foreground resize-none"
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

  const isFormIncomplete = () => {
    if (analysisType === 'product' && !productDescription.trim()) return true;
    if (analysisType === 'topic' && !keywords.trim()) return true;
    if (analysisType === 'website' && !websiteUrl.trim()) return true;
    return false;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 flex-shrink-0 bg-primary/10 text-primary flex items-center justify-center rounded-lg">
          <ProductIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-card-foreground">Piackutatás</h2>
          <p className="text-sm text-muted-foreground">Adja meg a részleteket</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Elemzés típusa</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setAnalysisType('product')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                analysisType === 'product' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Termék/Szolgáltatás
            </button>
            <button
              type="button"
              onClick={() => setAnalysisType('topic')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                analysisType === 'topic' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Téma/Kulcsszó
            </button>
            <button
              type="button"
              onClick={() => setAnalysisType('website')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                analysisType === 'website' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              Weboldal
            </button>
          </div>
        </div>

        {analysisType === 'product' && (
          <>
            <TextareaField
              id="productDescription"
              rows={4}
              label="Termék vagy szolgáltatás leírása"
              placeholder="Pl.: 'Kézműves vegán szappanok, melyek természetes összetevőkből készülnek, és környezetbarát csomagolásban kaphatók.'"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={isLoading}
              required
            />
            <InputField
              id="industry"
              label="Iparág (opcionális)"
              placeholder="Pl.: 'Kozmetikumok', 'Fenntartható termékek'"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={isLoading}
            />
          </>
        )}

        {analysisType === 'topic' && (
          <TextareaField
            id="keywords"
            rows={4}
            label="Kulcsszavak vagy téma"
            placeholder="Pl.: 'Fenntartható életmód', 'AI a marketingben', 'Egészséges táplálkozás trendek'"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={isLoading}
            required
          />
        )}

        {analysisType === 'website' && (
          <InputField
            id="websiteUrl"
            label="Weboldal URL"
            type="url"
            placeholder="Pl.: 'https://www.pelda.hu'"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={isLoading}
            required
            icon={<LinkIcon className="w-5 h-5" />}
          />
        )}

        <InputField
          id="geographicalFocus"
          label="Földrajzi fókusz"
          placeholder="Pl.: 'Magyarország', 'Budapest', 'Európa'"
          value={geographicalFocus}
          onChange={(e) => setGeographicalFocus(e.target.value)}
          disabled={isLoading}
          required
          icon={<SearchIcon className="w-5 h-5" />}
        />

        <button
          type="submit"
          disabled={isLoading || isFormIncomplete()}
          className="mt-4 w-full flex items-center justify-center font-semibold bg-primary text-primary-foreground py-2.5 px-6 rounded-lg transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner message="Elemzés indítása..." /> : 'Elemzés indítása'}
        </button>
      </form>
    </div>
  );
};