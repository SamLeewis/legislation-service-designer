'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';
import { generateDMNXML } from '@/services/dmnGenerator';

const ExportPage: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());

  const exportJSON = () => {
    if (!analysis) return;
    const json = JSON.stringify(analysis, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analyse-${Date.now()}.json`;
    a.click();
  };

  const exportDMN = () => {
    if (!analysis || analysis.dmnModels.length === 0) {
      alert('Geen DMN modellen beschikbaar');
      return;
    }
    const model = analysis.dmnModels[0];
    const xml = generateDMNXML(model);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dmn-${Date.now()}.dmn`;
    a.click();
  };

  const exportReport = () => {
    if (!analysis) return;
    let report = `# Analyse Rapport: ${analysis.projectName}\n\n`;
    report += `Datum: ${new Date().toLocaleDateString('nl-NL')}\n\n`;
    report += `## Samenvatting\n`;
    report += `- Juridische bronnen: ${analysis.legalSources.length}\n`;
    report += `- Juridische elementen: ${analysis.legalElements.length}\n`;
    report += `- Interpretatiepunten: ${analysis.interpretationPoints.length}\n`;
    report += `- Dienstverlening varianten: ${analysis.serviceVariants.length}\n`;
    report += `- DMN modellen: ${analysis.dmnModels.length}\n\n`;

    report += `## Juridische bronnen\n`;
    analysis.legalSources.forEach(source => {
      report += `\n### ${source.title}\n`;
      report += `- Artikel: ${source.article || 'N/A'}\n`;
      report += `- Type: ${source.type}\n`;
      report += `- Status: ${source.status}\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${Date.now()}.md`;
    a.click();
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
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Export</h2>
          <p className="text-gray-600">
            Exporteer uw analyse in verschillende formaten.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">📄 JSON Export</h3>
            <p className="text-sm text-gray-600">
              Volledige analyse in JSON formaat voor verdere verwerking.
            </p>
            <button
              onClick={exportJSON}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Download JSON
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">⚙️ DMN Export</h3>
            <p className="text-sm text-gray-600">
              DMN 1.5 XML formaat voor besluitmodellering.
            </p>
            <button
              onClick={exportDMN}
              className="w-full bg-success text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Download DMN
            </button>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-bold text-lg text-gray-900">📋 Rapport</h3>
            <p className="text-sm text-gray-600">
              Markdown rapport met samenvatting.
            </p>
            <button
              onClick={exportReport}
              className="w-full bg-warning text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Download Rapport
            </button>
          </div>
        </div>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-primary mb-2">📊 Analyse Statistieken</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Juridische bronnen</p>
              <p className="font-bold text-2xl text-primary">{analysis.legalSources.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Juridische elementen</p>
              <p className="font-bold text-2xl text-primary">{analysis.legalElements.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Interpretatiepunten</p>
              <p className="font-bold text-2xl text-primary">{analysis.interpretationPoints.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Dienstverlening varianten</p>
              <p className="font-bold text-2xl text-primary">{analysis.serviceVariants.length}</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ExportPage;
