import { LegalSource, LegalElement, ServiceVariantDesign, ServiceElement } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Generate three service design variants based on legal elements
export const generateServiceVariants = (
  source: LegalSource,
  legalElements: LegalElement[]
): ServiceVariantDesign[] => {
  const variants: ServiceVariantDesign[] = [];

  variants.push(generateDigitalFirstVariant(source, legalElements));
  variants.push(generateHumanAssistedVariant(source, legalElements));
  variants.push(generateHybridVariant(source, legalElements));

  return variants;
};

const generateDigitalFirstVariant = (
  source: LegalSource,
  legalElements: LegalElement[]
): ServiceVariantDesign => {
  const serviceElements = generateServiceElements(source, legalElements, 'digital_first');

  return {
    id: uuidv4(),
    sourceId: source.id,
    variantType: 'digital_first',
    title: 'Digitaal-eerste dienst',
    description: 'Digitale invoer, automatische controles waar mogelijk, digitale communicatie en gestructureerde besluitvorming.',
    serviceElements,
    publicValueTensions: [
      {
        tension: 'Efficiëntie vs. Toegankelijkheid',
        explanation: 'Automatisering kan snel zijn maar exclusief voor burgers met beperkte digitale vaardigheden.',
        serviceImplication: 'Voorzien in niet-digitaal alternatief route.',
      },
      {
        tension: 'Automatisering vs. Menselijk oordeel',
        explanation: 'Veel zaken kunnen niet volledig automatisch besloten worden.',
        serviceImplication: 'Duidelijk aangeven welke zaken manual review nodig hebben.',
      },
    ],
    validationChecklist: [
      { item: 'Alle verplichte velden geïdentificeerd', checked: false, notes: '' },
      { item: 'Automatische controles gedocumenteerd', checked: false, notes: '' },
      { item: 'DMN-model voor automaten opgesteld', checked: false, notes: '' },
      { item: 'Niet-digitaal alternatief voorzien', checked: false, notes: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const generateHumanAssistedVariant = (
  source: LegalSource,
  legalElements: LegalElement[]
): ServiceVariantDesign => {
  const serviceElements = generateServiceElements(source, legalElements, 'human_assisted');

  return {
    id: uuidv4(),
    sourceId: source.id,
    variantType: 'human_assisted',
    title: 'Menselijk ondersteunde dienst',
    description: 'Ondersteuning door ambtenaar, loketgesprek, telefonisch contact, handmatige beoordeling en geleide intake.',
    serviceElements,
    publicValueTensions: [
      {
        tension: 'Kwaliteit vs. Schaal',
        explanation: 'Persoonlijke ondersteuning is beter maar schaalt minder goed.',
        serviceImplication: 'Voorzien in voldoende personeelscapaciteit.',
      },
      {
        tension: 'Gelijkheid vs. Discretie',
        explanation: 'Menselijke beoordeling biedt ruimte maar risico op ongelijke behandeling.',
        serviceImplication: 'Duidelijke instructies en regelmatige controle.',
      },
    ],
    validationChecklist: [
      { item: 'Personeelsinstructies opgesteld', checked: false, notes: '' },
      { item: 'Beoordeling criteria gedocumenteerd', checked: false, notes: '' },
      { item: 'Capaciteitsplanning gedaan', checked: false, notes: '' },
      { item: 'Kwaliteitscontrole proces ingesteld', checked: false, notes: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const generateHybridVariant = (
  source: LegalSource,
  legalElements: LegalElement[]
): ServiceVariantDesign => {
  const serviceElements = generateServiceElements(source, legalElements, 'hybrid');

  return {
    id: uuidv4(),
    sourceId: source.id,
    variantType: 'hybrid',
    title: 'Hybride dienst',
    description: 'Combinatie van digitale intake met menselijk oordeel, aanvullende ondersteuning, handmatige review en toegankelijke communicatie.',
    serviceElements,
    publicValueTensions: [
      {
        tension: 'Efficiëntie vs. Inclusiviteit',
        explanation: 'Balans tussen snelle digitale verwerking en ondersteuning voor allen.',
        serviceImplication: 'Automatisering waar mogelijk, ondersteuning waar nodig.',
      },
      {
        tension: 'Standaardisatie vs. Flexibiliteit',
        explanation: 'Processen moeten herhaalbaar zijn maar ook reageren op individuele situaties.',
        serviceImplication: 'Heldere standaarden met uitzondering procedures.',
      },
    ],
    validationChecklist: [
      { item: 'Digitale en niet-digitale routes gedefinieerd', checked: false, notes: '' },
      { item: 'Routing logica bepaald', checked: false, notes: '' },
      { item: 'Handoff processen tussen digital/human gedefinieerd', checked: false, notes: '' },
      { item: 'Toegankelijkheid controleren', checked: false, notes: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Generate service elements from legal elements
const generateServiceElements = (
  source: LegalSource,
  legalElements: LegalElement[],
  variant: 'digital_first' | 'human_assisted' | 'hybrid'
): ServiceElement[] => {
  const elements: ServiceElement[] = [];

  legalElements.forEach(legalElement => {
    if (legalElement.type === 'evidence_requirement') {
      elements.push({
        id: uuidv4(),
        sourceId: source.id,
        type: 'form_field',
        title: `Invulveld: ${legalElement.description.substring(0, 50)}`,
        description: `Dit veld is verplicht vanwege ${legalElement.article || 'het artikel'}`,
        serviceVariant: variant,
        mandatoryStatus: 'mandatory',
        dmnSuitability: 'suitable',
        legalBasis: {
          sourceTitle: source.title,
          article: source.article,
          textFragment: legalElement.textFragment,
          reasoning: `Dit veld is nodig omdat ${source.article} bepaalt dat dit gegeven moet worden verstrekt.`,
        },
        interpretation: {
          summary: legalElement.description,
          assumptions: [],
          uncertainties: legalElement.vagueTerms || [],
        },
        serviceDesign: {
          channel: variant === 'digital_first' ? 'digital' : (variant === 'human_assisted' ? 'physical' : 'hybrid'),
          userGroup: 'burger',
          serviceOutput: legalElement.description,
        },
        publicValues: ['begrijpelijkheid', 'rechtvaardigheid'],
        validationStatus: 'not_checked',
        feedback: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (legalElement.type === 'time_limit') {
      elements.push({
        id: uuidv4(),
        sourceId: source.id,
        type: 'process_step',
        title: `Termijn: ${extractTimeFromText(legalElement.textFragment)}`,
        description: legalElement.textFragment,
        serviceVariant: variant,
        mandatoryStatus: 'mandatory',
        dmnSuitability: 'suitable',
        legalBasis: {
          sourceTitle: source.title,
          article: source.article,
          textFragment: legalElement.textFragment,
          reasoning: `Dit is een wettelijke termijn uit ${source.article}.`,
        },
        interpretation: {
          summary: `Beslistermijn: ${extractTimeFromText(legalElement.textFragment)}`,
          assumptions: [],
          uncertainties: [],
        },
        serviceDesign: {
          channel: 'employee_action',
          userGroup: 'ambtenaar',
          serviceOutput: `Besluit moet genomen worden binnen ${extractTimeFromText(legalElement.textFragment)}`,
          employeeAction: `Monitor termijn en zorg voor tijdige afhandeling`,
        },
        publicValues: ['rechtszekerheid', 'proportionaliteit'],
        validationStatus: 'not_checked',
        feedback: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return elements;
};

const extractTimeFromText = (text: string): string => {
  const match = text.match(/(\d+)\s*(dag|week|maand|jaar)/i);
  return match ? `${match[1]} ${match[2]}en` : 'onbepaalde termijn';
};
