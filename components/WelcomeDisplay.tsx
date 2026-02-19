import React from 'react';

export const WelcomeDisplay: React.FC = () => {
  return (
    <div className="text-center animate-fade-in w-full max-w-lg">
      <div title="AI-Vezérelt Piackutatás" className="inline-block bg-gradient-to-br from-fuchsia-600 to-sky-500 p-3 rounded-full mb-6 shadow-2xl shadow-sky-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100">
        AI-Vezérelt Piackutatás
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Nyerjen mélyebb betekintést a piacába. Adja meg a részleteket a bal oldali <span className="text-sky-400 font-semibold">Vezérlőpulton</span> az elemzés azonnali elindításához.
      </p>
    </div>
  );
};
