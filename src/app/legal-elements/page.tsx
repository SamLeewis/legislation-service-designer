'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { useRouter } from 'next/navigation';
import { LegalElement } from '@/types';
import { parseLegalElements } from '@/services/legalElementParser';

const LegalElements: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const { analysis: updatedAnalysis, setAnalysis } = useAnalysisStore();
  const [elements, setElements] = useState<LegalElement[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!analysis || analysis.legalSources.length === 0) {
      router.push('/legal-input');
      return;
    }

    const allElements = analysis.legalSources.flatMap(source =>
      parseLegalElements(source)
    );

    setElements(allElements);
    
    if (updatedAnalysis) {
      setAnalysis({
        ...updatedAnalysis,
        legalElements: allElements,
      });
    }

    setLoading(false);
  }, [analysis, setAnalysis, router, updatedAnalysis]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Juridische elementen worden geanalyseerd...</p>
        </div>
      </Layout>
    );
  }

  const elementTypes = [
    'obligation',
    'right',
    'condition',
    'time_limit',
    'evidence_requirement',
    'decision_point',
    'discretion',
  ];

  const elementLabels: Record<string, string> = {
    obligation: '🔴 Verplichting',
    right: '🟢 Recht',
    condition: '🟡 Voorwaarde',
    time_limit: '⏱️ Termijn',
    evidence_requirement: '📋 Gegevensvereiste',
    decision_point: '⚖️ Besluitpunt',
    discretion: '🎯 Discretie',
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Juridische elementen</h2>
          <p className="text-gray-600">
            {elements.length} juridische elementen geïdentificeerd in de ingevoerde tekst.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {elementTypes.map(type => {
            const count = elements.filter(e => e.type === type).length;
            return (
              <div key={type} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2">{elementLabels[type]}</div>
                <div className="text-3xl font-bold text-primary">{count}</div>
              </div>
            );
          })}
        </div>

        <section className="space-y-4">
          {elementTypes.map(type => {
            const typeElements = elements.filter(e => e.type === type);
            if (typeElements.length === 0) return null;

            return (
              <div key={type} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-4">{elementLabels[type]}</h3>
                <div className="space-y-3">
                  {typeElements.map(element => (
                    <div
                      key={element.id}
                      className="p-3 bg-gray-50 rounded border-l-4 border-primary"
                    >
                      <p className="font-semibold text-gray-900">{element.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{element.description}</p>
                      {element.vagueTerms && element.vagueTerms.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {element.vagueTerms.map(term => (
                            <span
                              key={term}
                              className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                            >
                              ⚠️ {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/interpretation-points')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Volgende: Interpretatiepunten →
          </button>
          <button
            onClick={() => router.push('/legal-input')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Terug
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LegalElements;
