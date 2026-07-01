import { LegalElement, LegalSource, InterpretationPoint } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock parser that identifies legal elements based on keywords
// This would be replaced with LLM analysis in production
export const parseLegalElements = (source: LegalSource): LegalElement[] => {
  const elements: LegalElement[] = [];
  const text = source.fullText;
  
  // Keywords for identifying legal element types
  const obligationKeywords = ['moet', 'dient', 'is verplicht', 'verplichting', 'shall', 'required'];
  const rightKeywords = ['mag', 'kan', 'recht op', 'recht hebben', 'right to'];
  const conditionKeywords = ['indien', 'wanneer', 'mits', 'onder voorwaarde', 'if', 'provided that'];
  const timeKeywords = ['dagen', 'weken', 'maanden', 'termijn', 'deadline', 'days', 'weeks'];
  const evidenceKeywords = ['beschrijving', 'document', 'bewijs', 'aantoont', 'proof', 'evidence'];
  const vagueTerms = ['redelijk', 'passend', 'noodzakelijk', 'aannemelijk', 'bijzondere omstandigheden', 'naar oordeel van', 'zo spoedig mogelijk'];

  // Extract paragraphs/sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();
    if (trimmed.length < 10) return;

    // Determine element type
    let elementType: LegalElement['type'] = 'obligation';
    let requiresInterpretation = false;
    let foundVagueTerms: string[] = [];

    if (obligationKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      elementType = 'obligation';
    } else if (rightKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      elementType = 'right';
    } else if (conditionKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      elementType = 'condition';
    } else if (timeKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      elementType = 'time_limit';
    } else if (evidenceKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      elementType = 'evidence_requirement';
    }

    // Check for vague terms that need interpretation
    vagueTerms.forEach(term => {
      if (trimmed.toLowerCase().includes(term)) {
        requiresInterpretation = true;
        foundVagueTerms.push(term);
      }
    });

    elements.push({
      id: uuidv4(),
      sourceId: source.id,
      type: elementType,
      title: `${elementType.charAt(0).toUpperCase() + elementType.slice(1).replace(/_/g, ' ')}: ${trimmed.substring(0, 50)}...`,
      description: trimmed,
      textFragment: trimmed,
      article: source.article,
      paragraph: source.paragraph,
      requiresInterpretation,
      vagueTerms: foundVagueTerms,
      relatedArticles: extractReferences(trimmed),
    });
  });

  return elements;
};

// Extract article references from text
const extractReferences = (text: string): string[] => {
  const matches = text.match(/artikel\s+\d+/gi) || [];
  return matches.map(m => m.toLowerCase());
};

// Identify interpretation points where vague terms need clarification
export const identifyInterpretationPoints = (
  legalElements: LegalElement[],
  sourceId: string
): InterpretationPoint[] => {
  const points: InterpretationPoint[] = [];
  
  legalElements.forEach(element => {
    if (element.requiresInterpretation && element.vagueTerms) {
      element.vagueTerms.forEach(term => {
        points.push({
          id: uuidv4(),
          legalElementId: element.id,
          sourceId,
          question: `Hoe interpreteren we "${term}" in de context van: ${element.textFragment.substring(0, 100)}...?`,
          vagueTerms: [term],
          suggestedInterpretations: getInterpretationSuggestions(term),
          validationNeeded: true,
          consequences: getConsequences(term),
          dmnImpact: getDMNImpact(term),
        });
      });
    }
  });

  return points;
};

// Get interpretation suggestions for vague legal terms
const getInterpretationSuggestions = (term: string): string[] => {
  const suggestions: Record<string, string[]> = {
    'redelijk': [
      'Standaard die een gemiddelde burger zou gebruiken',
      'Proportioneel ten opzichte van de omstandigheden',
      'In lijn met actuele maatschappelijke normen',
    ],
    'passend': [
      'Geschikt voor het doel dat de wet nastreeft',
      'In lijn met de individuele omstandigheden van de burger',
      'Effectief gegeven de beschikbare middelen',
    ],
    'noodzakelijk': [
      'Onmisbaar voor het bereiken van het wettelijk doel',
      'Geen minder ingrijpend alternatief beschikbaar',
      'Proportioneel gegeven de situatie',
    ],
    'aannemelijk': [
      'Waarschijnlijk op basis van geboden informatie',
      'Voldoende aangetoond door aanvrager',
      'Niet onredelijk te betwijfelen',
    ],
    'bijzondere omstandigheden': [
      'Omstandigheden die niet in de standaardprocedure passen',
      'Situaties die uitzondering van de regel rechtvaardigen',
      'Individuele factoren die standaardbehandeling ongeschikt maken',
    ],
  };
  return suggestions[term.toLowerCase()] || ['Nader uit te werken in workshop'];
};

// Get service design consequences of interpretation
const getConsequences = (term: string): string[] => {
  const consequences: Record<string, string[]> = {
    'redelijk': [
      'Kan leiden tot verschillende toepassing per geval',
      'Vereist geschoolde beoordeling',
      'Risico op inconsistentie zonder duidelijke criteria',
    ],
    'noodzakelijk': [
      'Bepaalt welke ondersteuning wordt verstrekt',
      'Beïnvloedt kosten en haalbaarheid',
      'Kan leiden tot bezwaren als te streng of te mild',
    ],
    'bijzondere omstandigheden': [
      'Vereist uitzondering procedure',
      'Extra beoordeling nodig',
      'Risico op ongelijke behandeling',
    ],
  };
  return consequences[term.toLowerCase()] || [];
};

// Assess DMN impact of vague term
const getDMNImpact = (term: string): string => {
  return `Dit begrip vereist verdere interpretatie voordat het in DMN kan worden gemodelleerd. Het is niet geschikt voor automatische regels zonder menselijke beoordeling.`;
};
