'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { useRouter } from 'next/navigation';
import { InterpretationPoint } from '@/types';
import { identifyInterpretationPoints } from '@/services/legalElementParser';

const InterpretationPoints: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [interpretationPoints, setInterpretationPoints] = useState<InterpretationPoint[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!analysis || analysis.legalElements.length === 0) {
      router.push('/legal-elements');
      return;
    }

    const points: InterpretationPoint[] = [];
    analysis.legalSources.forEach(source => {
      const sourcePoints = identifyInterpretationPoints(analysis.legalElements, source.id);
      points.push(...sourcePoints);
    });

    setInterpretationPoints(points);
  }, [analysis, router]);

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
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interpretatiepunten</h2>
          <p className="text-gray-600">
            {interpretationPoints.length} punten waar juridische interpretatie nodig is voordat diensten kunnen worden ontworpen.
          </p>
        </section>

        <div className="space-y-4">
          {interpretationPoints.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700">✓ Geen interpretatiepunten geïdentificeerd</p>
            </div>
          ) : (
            interpretationPoints.map(point => (
              <div key={point.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">{point.question}</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Vage begrippen:</p>
                    <div className="flex flex-wrap gap-2">
                      {point.vagueTerms.map(term => (
                        <span
                          key={term}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Mogelijke interpretaties:</p>
                    <ul className="space-y-1">
                      {point.suggestedInterpretations.map((interp, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {interp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Gevolgen voor diensten:</p>
                    <ul className="space-y-1">
                      {point.consequences.map((consequence, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          • {consequence}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-900"><strong>DMN impact:</strong> {point.dmnImpact}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/service-variants')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Volgende: Dienstverlening varianten →
          </button>
          <button
            onClick={() => router.push('/legal-elements')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Terug
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default InterpretationPoints;
