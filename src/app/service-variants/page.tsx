'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { useRouter } from 'next/navigation';
import { ServiceVariantDesign } from '@/types';
import { generateServiceVariants } from '@/services/serviceDesignGenerator';

const ServiceVariants: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const { setAnalysis } = useAnalysisStore();
  const [variants, setVariants] = useState<ServiceVariantDesign[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!analysis || analysis.legalSources.length === 0) {
      router.push('/legal-input');
      return;
    }

    const generatedVariants = analysis.legalSources.flatMap(source =>
      generateServiceVariants(source, analysis.legalElements)
    );

    setVariants(generatedVariants);

    if (analysis) {
      setAnalysis({
        ...analysis,
        serviceVariants: generatedVariants,
      });
    }
  }, [analysis, setAnalysis, router]);

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Dienstverlening varianten</h2>
          <p className="text-gray-600">
            Drie mogelijke diensten op basis van de regelgeving. Kies een variant om details te zien.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map(variant => (
            <div
              key={variant.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                selectedVariant === variant.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              <h3 className="font-bold text-lg text-gray-900 mb-2">{variant.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{variant.description}</p>
              <div className="text-sm">
                <p className="text-gray-700">
                  <strong>{variant.serviceElements.length}</strong> dienstelementen
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedVariant && (
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            {variants
              .filter(v => v.id === selectedVariant)
              .map(variant => (
                <div key={variant.id} className="space-y-6">
                  <div>
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">{variant.title}</h3>
                    <p className="text-gray-600">{variant.description}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-3">Openbare waarden spanning</h4>
                    <div className="space-y-3">
                      {variant.publicValueTensions.map((tension, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded">
                          <p className="font-semibold text-gray-900">{tension.tension}</p>
                          <p className="text-sm text-gray-600 mt-1">{tension.explanation}</p>
                          <p className="text-sm text-primary mt-2">
                            <strong>Service implicatie:</strong> {tension.serviceImplication}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-3">Dienstelementen ({variant.serviceElements.length})</h4>
                    <div className="space-y-2">
                      {variant.serviceElements.map(element => (
                        <div key={element.id} className="p-3 bg-gray-50 rounded border-l-4 border-primary">
                          <p className="font-semibold text-sm text-gray-900">{element.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{element.description}</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {element.channel}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {element.mandatoryStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dmn-model')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Volgende: DMN Model →
          </button>
          <button
            onClick={() => router.push('/interpretation-points')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Terug
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceVariants;
