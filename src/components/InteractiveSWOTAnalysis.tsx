import React, { useState } from 'react';
import { type SWOTAnalysis, type ImpactLevel, type SWOTPoint, type Competitor } from '../../types';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ImpactLevelIcon } from './icons/ImpactLevelIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { SWOTVisualizer } from './SWOTVisualizer';
import { Theme } from '../../App';
import { LinkIcon } from './icons/LinkIcon';

type QuadrantKey = keyof SWOTAnalysis;

const ImpactIndicator: React.FC<{ impact: ImpactLevel }> = ({ impact }) => {
  const styles: Record<ImpactLevel, { text: string; className: string }> = {
    HIGH: { text: 'Nagy', className: 'bg-red-500/10 text-red-500' },
    MEDIUM: { text: 'Közepes', className: 'bg-amber-500/10 text-amber-500' },
    LOW: { text: 'Alacsony', className: 'bg-sky-500/10 text-sky-500' },
  };
  
  const style = styles[impact] || styles.LOW;

  return (
    <span 
      className={`ml-2 flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${style.className}`}
      title={`${style.text} hatású`}
    >
      <ImpactLevelIcon level={impact} className="w-3.5 h-3.5" />
      {style.text}
    </span>
  );
};

const ImpactSelector: React.FC<{ selected: ImpactLevel; onSelect: (level: ImpactLevel) => void }> = ({ selected, onSelect }) => {
    const levels: ImpactLevel[] = ['LOW', 'MEDIUM', 'HIGH'];
    return (
        <div className="flex items-center gap-2">
            {levels.map(level => (
                <button
                    key={level}
                    type="button"
                    onClick={() => onSelect(level)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                        selected === level
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-border'
                    }`}
                >
                    {level === 'LOW' ? 'Alacsony' : level === 'MEDIUM' ? 'Közepes' : 'Nagy'}
                </button>
            ))}
        </div>
    );
};

interface SWOTPointFormProps {
    point?: SWOTPoint;
    onSave: (point: SWOTPoint) => void;
    onCancel: () => void;
    competitors: Competitor[];
}

const SWOTPointForm: React.FC<SWOTPointFormProps> = ({ point, onSave, onCancel, competitors }) => {
    const [text, setText] = useState(point?.text || '');
    const [impact, setImpact] = useState<ImpactLevel>(point?.impact || 'MEDIUM');
    const [relatedCompetitor, setRelatedCompetitor] = useState(point?.relatedCompetitor || '');

    const handleSave = () => {
        if (text.trim()) {
            onSave({
                text: text.trim(),
                impact,
                relatedCompetitor: relatedCompetitor || undefined
            });
        }
    };

    return (
        <div className="p-3 bg-muted/50 rounded-lg border border-border animate-fade-in-up space-y-3" style={{ animationDuration: '0.3s' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Írja le a tényezőt..."
                className="w-full p-2 bg-background border border-border rounded-md text-sm resize-none focus:ring-2 focus:ring-primary"
                rows={3}
                autoFocus
            />
            <div>
                <label htmlFor={`competitor-select-${point?.text || 'new'}`} className="block text-xs font-medium text-muted-foreground mb-1">
                    Versenytárs kapcsolása (opcionális)
                </label>
                <select
                    id={`competitor-select-${point?.text || 'new'}`}
                    value={relatedCompetitor}
                    onChange={(e) => setRelatedCompetitor(e.target.value)}
                    className="w-full p-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-primary"
                >
                    <option value="">Nincs</option>
                    {competitors.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex items-center justify-between">
                <ImpactSelector selected={impact} onSelect={setImpact} />
                <div className="flex items-center gap-2">
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-muted"><XMarkIcon className="w-5 h-5" /></button>
                    <button onClick={handleSave} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"><CheckIcon className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
};


const CompetitorPopover: React.FC<{ quadrantKey: QuadrantKey; competitor: Competitor }> = ({ quadrantKey, competitor }) => {
    const isPositiveQuadrant = quadrantKey === 'strengths' || quadrantKey === 'opportunities';
    const pointsToShow = isPositiveQuadrant ? competitor.weaknesses : competitor.strengths;
    const title = isPositiveQuadrant ? "Kapcsolódó gyengeségek" : "Kapcsolódó erősségek";

    if (!pointsToShow || pointsToShow.length === 0) {
        return null;
    }

    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-card border border-border text-left text-sm text-foreground rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <h5 className="font-bold text-primary mb-2">{competitor.name}</h5>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</h6>
            <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                {pointsToShow.slice(0, 3).map((p, i) => <li key={i}>{p.text}</li>)}
            </ul>
        </div>
    );
};


interface QuadrantProps {
    title: string;
    items: SWOTPoint[];
    icon: React.ReactNode;
    colorClass: string;
    quadrantKey: QuadrantKey;
    competitors: Competitor[];
    onAdd: (quadrant: QuadrantKey) => void;
    onEdit: (quadrant: QuadrantKey, index: number) => void;
    onDelete: (quadrant: QuadrantKey, index: number) => void;
    editingInfo: { quadrant: QuadrantKey; index: number } | null;
    addingInfo: QuadrantKey | null;
    onSave: (quadrant: QuadrantKey, point: SWOTPoint, index?: number) => void;
    onCancel: () => void;
}

const Quadrant: React.FC<QuadrantProps> = ({ title, items, icon, colorClass, quadrantKey, competitors, onAdd, onEdit, onDelete, editingInfo, addingInfo, onSave, onCancel }) => (
  <div className={`rounded-xl p-4 h-full flex flex-col border border-border bg-card`}>
    <h4 className={`flex items-center text-lg font-bold mb-3 ${colorClass}`}>
      {icon}
      {title}
    </h4>
    <div className="divide-y divide-border flex-grow">
        {items.map((item, index) => {
            const competitor = item.relatedCompetitor ? competitors.find(c => c.name === item.relatedCompetitor) : undefined;
            return editingInfo?.quadrant === quadrantKey && editingInfo.index === index ? (
                <div key={index} className="py-2">
                    <SWOTPointForm
                        point={item}
                        onSave={(point) => onSave(quadrantKey, point, index)}
                        onCancel={onCancel}
                        competitors={competitors}
                    />
                </div>
            ) : (
                <div key={index} className="group flex justify-between items-start py-3 text-sm">
                    <div className="relative flex items-start gap-2 pr-2">
                        <p className="text-foreground leading-relaxed">{item.text}</p>
                         {competitor && (
                            <>
                                <span title={`Kapcsolódik: ${competitor.name}`} className="cursor-pointer">
                                    <LinkIcon className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                                </span>
                                <CompetitorPopover quadrantKey={quadrantKey} competitor={competitor} />
                            </>
                        )}
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <ImpactIndicator impact={item.impact} />
                        <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(quadrantKey, index)} className="p-1.5 rounded-full hover:bg-muted"><PencilIcon className="w-4 h-4 text-muted-foreground" /></button>
                            <button onClick={() => onDelete(quadrantKey, index)} className="p-1.5 rounded-full hover:bg-muted"><TrashIcon className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
    {addingInfo === quadrantKey ? (
        <div className="py-2 mt-2">
            <SWOTPointForm onSave={(point) => onSave(quadrantKey, point)} onCancel={onCancel} competitors={competitors} />
        </div>
    ) : (
        <button onClick={() => onAdd(quadrantKey)} className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2 border-2 border-dashed border-border hover:border-primary/50 rounded-lg">
            <PlusIcon className="w-4 h-4" /> Új pont hozzáadása
        </button>
    )}
  </div>
);


interface InteractiveSWOTAnalysisProps {
  initialSwot: SWOTAnalysis;
  theme: Theme;
  competitors: Competitor[];
}


export const InteractiveSWOTAnalysis: React.FC<InteractiveSWOTAnalysisProps> = ({ initialSwot, theme, competitors }) => {
  const [swotData, setSwotData] = useState<SWOTAnalysis>(initialSwot);
  const [editingInfo, setEditingInfo] = useState<{ quadrant: QuadrantKey; index: number } | null>(null);
  const [addingInfo, setAddingInfo] = useState<QuadrantKey | null>(null);

  const handleAdd = (quadrant: QuadrantKey) => {
    setAddingInfo(quadrant);
    setEditingInfo(null);
  };

  const handleEdit = (quadrant: QuadrantKey, index: number) => {
    setEditingInfo({ quadrant, index });
    setAddingInfo(null);
  };
  
  const handleCancel = () => {
    setEditingInfo(null);
    setAddingInfo(null);
  };

  const handleDelete = (quadrant: QuadrantKey, index: number) => {
    setSwotData(prev => ({
        ...prev,
        [quadrant]: prev[quadrant].filter((_, i) => i !== index),
    }));
  };

  const handleSave = (quadrant: QuadrantKey, point: SWOTPoint, index?: number) => {
    setSwotData(prev => {
        const newQuadrantData = [...prev[quadrant]];
        if (index !== undefined) {
            newQuadrantData[index] = point; // Edit
        } else {
            newQuadrantData.push(point); // Add
        }
        return { ...prev, [quadrant]: newQuadrantData };
    });
    handleCancel();
  };


  return (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Stratégiai Összkép</h3>
            <div className="bg-card rounded-xl border border-border p-4">
                 <SWOTVisualizer swot={swotData} theme={theme} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Quadrant
            title="Erősségek"
            items={swotData.strengths}
            icon={<ThumbsUpIcon className="w-5 h-5 mr-2" />}
            colorClass="text-emerald-600 dark:text-emerald-400"
            quadrantKey="strengths"
            competitors={competitors}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} onCancel={handleCancel}
            editingInfo={editingInfo} addingInfo={addingInfo}
          />
          <Quadrant
            title="Gyengeségek"
            items={swotData.weaknesses}
            icon={<ThumbsDownIcon className="w-5 h-5 mr-2" />}
            colorClass="text-red-600 dark:text-red-400"
            quadrantKey="weaknesses"
            competitors={competitors}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} onCancel={handleCancel}
            editingInfo={editingInfo} addingInfo={addingInfo}
          />
          <Quadrant
            title="Lehetőségek"
            items={swotData.opportunities}
            icon={<SparklesIcon className="w-5 h-5 mr-2" />}
            colorClass="text-emerald-600 dark:text-emerald-400"
            quadrantKey="opportunities"
            competitors={competitors}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} onCancel={handleCancel}
            editingInfo={editingInfo} addingInfo={addingInfo}
          />
          <Quadrant
            title="Veszélyek"
            items={swotData.threats}
            icon={<WarningIcon className="w-5 h-5 mr-2" />}
            colorClass="text-red-600 dark:text-red-400"
            quadrantKey="threats"
            competitors={competitors}
            onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSave} onCancel={handleCancel}
            editingInfo={editingInfo} addingInfo={addingInfo}
          />
        </div>
    </div>
  );
};