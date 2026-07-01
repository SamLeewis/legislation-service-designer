'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';

const WorkshopPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [facilitatorName, setFacilitatorName] = useState('');
  const [notes, setNotes] = useState('');

  if (!analysis) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Geen actieve analyse.</p>
        </div>
      </Layout>
    );
  }

  const workshopTopics = [
    {
      topic: 'Juridische interpretatie',
      description: 'Hoe interpreteren we vage juridische begrippen?',
      examples: ['redelijk', 'noodzakelijk', 'bijzondere omstandigheden'],
    },
    {
      topic: 'Service design keuzes',
      description: 'Welke ontwerp kiezen we en waarom?',
      examples: ['digitaal-eerste', 'menselijk-ondersteund', 'hybride'],
    },
    {
      topic: 'Stakeholder concerns',
      description: 'Welke belangen moeten we in balans brengen?',
      examples: ['efficiency', 'accessibility', 'equality'],
    },
    {
      topic: 'Publieke waarden',
      description: 'Welke publieke waarden staan onder druk?',
      examples: ['begrijpelijkheid', 'rechtvaardigheid', 'toegankelijkheid'],
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Workshop begeleiding</h2>
          <p className="text-gray-600">
            Faciliteer een workshop met stakeholders om gezamenlijk keuzes te maken.
          </p>
        </section>

        <div className="bg-white p-8 rounded-lg border border-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facilitator naam
            </label>
            <input
              type="text"
              value={facilitatorName}
              onChange={(e) => setFacilitatorName(e.target.value)}
              placeholder="Uw naam"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Workshop notities
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vat hier de workshop notities samen..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>

          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            Opslaan
          </button>
        </div>

        <section>
          <h3 className="font-bold text-2xl text-gray-900 mb-4">Workshop discussietopics</h3>
          <div className="space-y-4">
            {workshopTopics.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg text-gray-900 mb-2">{item.topic}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.examples.map((example, jdx) => (
                    <span key={jdx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-green-900 mb-2">✓ Workshop resultaten</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• {analysis.legalElements.length} juridische elementen geanalyseerd</li>
            <li>• {analysis.interpretationPoints.length} interpretatiepunten gekwalificeerd</li>
            <li>• {analysis.serviceVariants.length} dienstverlening ontwerpen besproken</li>
            <li>• {analysis.workshopNotes.length} workshop sessies gedocumenteerd</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default WorkshopPage;
