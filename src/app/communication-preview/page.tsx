'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAnalysisStore } from '@/store/analysisStore';

const CommunicationPreview: React.FC = () => {
  const analysis = useAnalysisStore((state) => state.getCurrentAnalysis());
  const [selectedType, setSelectedType] = useState<'form' | 'letter' | 'website' | 'script'>('form');

  if (!analysis) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Geen actieve analyse.</p>
        </div>
      </Layout>
    );
  }

  const formExample = `AANVRAAGFORMULIER - Ondersteuning

1. Beschrijf uw persoonlijke situatie
   [Tekstarea]
   Juridische basis: Artikel 4, lid 2

2. Welke ondersteuning vraagt u aan?
   [Tekstarea]
   Juridische basis: Artikel 4, lid 2

3. Waarom is deze ondersteuning voor u noodzakelijk?
   [Tekstarea]
   Juridische basis: Artikel 4, lid 2

[Verzenden]

Let op: Dit formulier is verplicht ingevuld voordat we uw aanvraag kunnen behandelen.`;

  const letterExample = `BRIEF - Besluit op aanvraag ondersteuning

[Gemeente logo]
[Datum]

Geachte [Naam],

Wij hebben uw aanvraag voor ondersteuning ontvangen op [datum].

BESLUIT
Wij hebben uw aanvraag beoordeeld op basis van de informatie die u heeft gegeven over uw persoonlijke situatie en de ondersteuning die u nodig heeft (artikel 4, lid 2).

Ons besluit: JA / NEE

MOTIVERING
[Motivering gebaseerd op artikel 4]

BEZWAAR
Bent u het niet eens met dit besluit? U kunt bezwaar maken volgens artikel [X].

Contactgegevens: [gegevens]

Met vriendelijke groet,
De gemeente`;

  const websiteExample = `WEBPAGINA - Ondersteuning aanvragen

# Hoe vraag ik ondersteuning aan?

U kunt ondersteuning aanvragen als u aannemelijk kunt maken dat u de noodzakelijke voorziening niet zelfstandig kunt organiseren.

## Wat hebt u nodig?

Bij uw aanvraag moet u het volgende meegeven:
- Een beschrijving van uw persoonlijke situatie
- De ondersteuning die u vraagt
- De reden waarom u deze ondersteuning nodig hebt

## Hoe lang duurt het?

Wij nemen een besluit binnen 8 weken na ontvangst van uw volledige aanvraag.

## Wat als er bijzondere omstandigheden zijn?

Als u bijzondere omstandigheden hebt, kunnen wij van de standaardprocedure afwijken.

[Aanvragen button]`;

  const scriptExample = `CALL CENTER SCRIPT

Agent: "Goedendag, u belt met [naam]. Waarmee kan ik u helpen?"

Burger: "Ik wil ondersteuning aanvragen."

Agent: "Graag! Daarvoor hebben wij het volgende van u nodig (artikel 4, lid 2):
  - Kunt u beschrijven wat uw persoonlijke situatie is?
  - Welke ondersteuning hebt u nodig?
  - Waarom is deze ondersteuning nodig?"

Burger: [Antwoord]

Agent: "Bedankt. Uw aanvraag is compleet. We nemen een besluit binnen 8 weken. U hoort van ons."

Burger: "Dank u."

Agent: "Tot ziens!"`;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Communicatie Preview</h2>
          <p className="text-gray-600">
            Voorbeelden van dienstelementen in verschillende communicatiekanalen.
          </p>
        </section>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType('form')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedType === 'form'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📝 Formulier
          </button>
          <button
            onClick={() => setSelectedType('letter')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedType === 'letter'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            💌 Brief
          </button>
          <button
            onClick={() => setSelectedType('website')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedType === 'website'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🌐 Website
          </button>
          <button
            onClick={() => setSelectedType('script')}
            className={`px-4 py-2 rounded-lg transition ${
              selectedType === 'script'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ☎️ Script
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg border border-gray-200">
          <pre className="font-mono text-sm text-gray-700 whitespace-pre-wrap">
            {
              selectedType === 'form'
                ? formExample
                : selectedType === 'letter'
                ? letterExample
                : selectedType === 'website'
                ? websiteExample
                : scriptExample
            }
          </pre>
        </div>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-primary mb-2">💡 Opmerking</h3>
          <p className="text-sm text-gray-700">
            Alle communicatie vermeldt de juridische basis voor vereiste informatie. Dit zorgt voor transparantie en rechtszekerheid.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default CommunicationPreview;
