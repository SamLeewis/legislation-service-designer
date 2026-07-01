'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';

const TraceabilityPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());

  if (!analysis) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Geen actieve analyse.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Traceerbaarheid</h2>
          <p className="text-gray-600">
            Koppeling tussen juridische bronnen, elementen en diensten.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-primary">{analysis.legalSources.length}</div>
            <p className="text-sm text-gray-600 mt-2">Juridische bronnen</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-primary">{analysis.legalElements.length}</div>
            <p className="text-sm text-gray-600 mt-2">Juridische elementen</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-primary">
              {analysis.serviceVariants.reduce((sum, v) => sum + v.serviceElements.length, 0)}
            </div>
            <p className="text-sm text-gray-600 mt-2">Dienstelementen</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-3xl font-bold text-primary">{analysis.dmnModels.length}</div>
            <p className="text-sm text-gray-600 mt-2">DMN modellen</p>
          </div>
        </div>

        <section className="bg-white p-8 rounded-lg border border-gray-200">
          <h3 className="font-bold text-2xl text-gray-900 mb-6">Traceability Flow</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded border-l-4 border-primary">
              <p className="font-bold text-gray-900">1. Juridische Bron</p>
              <p className="text-sm text-gray-600 mt-1">Ingevoerde regelgeving/beleid</p>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.legalSources.map(s => s.title).join(', ')}
              </p>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="p-4 bg-green-50 rounded border-l-4 border-green-600">
              <p className="font-bold text-gray-900">2. Juridische Elementen</p>
              <p className="text-sm text-gray-600 mt-1">Verplichtingen, rechten, termijnen, etc.</p>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.legalElements.length} elementen geïdentificeerd
              </p>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-600">
              <p className="font-bold text-gray-900">3. Interpretatiepunten</p>
              <p className="text-sm text-gray-600 mt-1">Vage begrippen die verduidelijking nodig hebben</p>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.interpretationPoints.length} interpretatiepunten
              </p>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="p-4 bg-purple-50 rounded border-l-4 border-purple-600">
              <p className="font-bold text-gray-900">4. Dienstverlening Varianten</p>
              <p className="text-sm text-gray-600 mt-1">Digitaal-eerste, Menselijk-ondersteund, Hybride</p>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.serviceVariants.length} varianten gegenereerd
              </p>
            </div>

            <div className="text-center text-gray-400">↓</div>

            <div className="p-4 bg-pink-50 rounded border-l-4 border-pink-600">
              <p className="font-bold text-gray-900">5. DMN Model</p>
              <p className="text-sm text-gray-600 mt-1">Besluitvormingslogica voor automatisering</p>
              <p className="text-xs text-gray-500 mt-2">
                {analysis.dmnModels.length} DMN modellen
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Wat is traceerbaarheid?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Elke dienst- en DMN-element kan teruggevoerd worden naar de juridische bron. Dit zorgt voor:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Juridische legitimiteit - waarom is dit element nodig?</li>
            <li>✓ Transparantie - wat is de basis van dit besluit?</li>
            <li>✓ Validatie - kan dit juridisch gerechtvaardigd worden?</li>
            <li>✓ Handhaving - wat moet gewijzigd als de wet verandert?</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default TraceabilityPage;
