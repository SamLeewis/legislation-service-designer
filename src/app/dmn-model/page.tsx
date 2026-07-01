'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { useRouter } from 'next/navigation';
import { DMNModel } from '@/types';
import { generateDMNModel, generateDMNXML, generateDMNExplanation } from '@/services/dmnGenerator';

const DMNModelPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [dmnModels, setDmnModels] = useState<DMNModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<DMNModel | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!analysis || analysis.serviceVariants.length === 0) {
      router.push('/service-variants');
      return;
    }

    const models = analysis.serviceVariants.map(variant =>
      generateDMNModel(variant)
    );

    setDmnModels(models);
    if (models.length > 0) {
      setSelectedModel(models[0]);
    }
  }, [analysis, router]);

  const downloadDMN = (model: DMNModel) => {
    const xml = generateDMNXML(model);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmn-model-${Date.now()}.dmn`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Gekopieerd naar klembord!');
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">DMN Model</h2>
          <p className="text-gray-600">
            Decision Model and Notation (DMN) export van besluitvormingslogica.
          </p>
        </section>

        {dmnModels.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-700">Geen DMN-modellen gegenereerd. Controleer uw dienstverlening varianten.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dmnModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    selectedModel?.id === model.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900">{model.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{model.decisions.length} besluiten</p>
                </button>
              ))}
            </div>

            {selectedModel && (
              <div className="bg-white p-8 rounded-lg border border-gray-200 space-y-6">
                <div>
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">{selectedModel.title}</h3>
                  <p className="text-sm text-gray-600">
                    Namespace: <code className="bg-gray-100 px-2 py-1 rounded">{selectedModel.namespace}</code>
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">Ingevoerde gegevens ({selectedModel.inputs.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedModel.inputs.map(input => (
                      <div key={input.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-semibold text-sm text-gray-900">{input.name}</p>
                        <p className="text-xs text-gray-600">Type: {input.typeRef}</p>
                        {input.allowedValues && (
                          <p className="text-xs text-gray-600 mt-1">
                            Waarden: {input.allowedValues.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">Besluiten ({selectedModel.decisions.length})</h4>
                  <div className="space-y-3">
                    {selectedModel.decisions.map(decision => (
                      <div key={decision.id} className="p-4 bg-gray-50 rounded border-l-4 border-primary">
                        <p className="font-semibold text-gray-900">{decision.name}</p>
                        <p className="text-xs text-gray-600 mt-1">Wettelijke basis: {decision.sourceArticle}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Hit policy: {decision.decisionTable.hitPolicy}
                        </p>
                        {decision.validationWarnings.length > 0 && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                            ⚠️ {decision.validationWarnings.join('; ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">DMN XML Preview</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-x-auto">
                    <pre>{generateDMNXML(selectedModel).substring(0, 500)}...</pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-3">Toelichting</h4>
                  <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm text-gray-700">
                    {generateDMNExplanation(selectedModel)}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => downloadDMN(selectedModel)}
                    className="bg-success text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    📥 Download DMN XML
                  </button>
                  <button
                    onClick={() => copyToClipboard(generateDMNXML(selectedModel))}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    📋 Kopieer XML
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/chat')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Volgende: Chat assistent →
          </button>
          <button
            onClick={() => router.push('/service-variants')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Terug
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DMNModelPage;
