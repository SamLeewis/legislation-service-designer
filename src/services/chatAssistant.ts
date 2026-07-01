import { Analysis } from '@/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedElements?: string[];
}

// Mock chat assistant that analyzes questions about legislation-to-service translation
export const processChatMessage = (
  userMessage: string,
  analysis: Analysis
): ChatMessage => {
  const response = generateResponse(userMessage, analysis);

  return {
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
  };
};

const generateResponse = (question: string, analysis: Analysis): string => {
  const lowerQuestion = question.toLowerCase();

  // Service-related questions
  if (lowerQuestion.includes('welke dienstverlening') || lowerQuestion.includes('dienst volgt')) {
    return `Op basis van de geanalyseerde tekst kunnen de volgende dienstelementen ontstaan:

**Digitale diensten:**
- Online aanvraagformulier met velden voor persoonlijke situatie, gevraagde ondersteuning en motivering

**Procestappen:**
- Volledigheidscheck binnen 2 werkdagen
- Beoordeling op geschiktheid
- Mededeling van het besluit

**Communicatie:**
- Ontvangstbevestiging
- Gemotiveerd besluit
- Informatie over bezwaar en beroep

Dit is gebaseerd op de artikelen in de ingevoerde tekst. Welk onderdeel wil je verder uitwerken?`;
  }

  if (lowerQuestion.includes('vragen') && lowerQuestion.includes('burger')) {
    return `Vanuit artikel 4 lid 2 moeten de volgende vragen aan de burger gesteld worden:

**Verplichte vragen:**
1. "Beschrijf uw persoonlijke situatie:" - noodzakelijk volgens artikel 4 lid 2
2. "Welke ondersteuning vraagt u aan?" - noodzakelijk volgens artikel 4 lid 2
3. "Waarom is deze ondersteuning voor u noodzakelijk?" - noodzakelijk volgens artikel 4 lid 2

**Aanvullende vragen (implementatiekeuze):**
- Contact gegevens en voorkeur communicatiekanaal
- Toestemming voor gegevensdeling met andere instanties

Alle verplichte vragen moeten opgenomen worden. De aanvullende vragen zijn implementatieruimte.`;
  }

  if (lowerQuestion.includes('gegevens') && lowerQuestion.includes('juridisch')) {
    return `**Juridisch noodzakelijke gegevens** (artikel 4 lid 2):
- Beschrijving van de persoonlijke situatie
- Omschrijving van de gevraagde ondersteuning  
- Toelichting waarom ondersteuning noodzakelijk is

**Niet juridisch verplicht maar praktisch nuttig:**
- Contactgegevens
- Voorkeur communicatiekanaal
- Bestaande ondersteuning

**Gegeven die risico's opleveren:**
- Meer dan nodig vragen leidt tot administratieve last
- Te weinig gegevens maakt beoordeling onmogelijk

Deze balans is een implementatiekeuze die met stakeholders besproken moet worden.`;
  }

  if (lowerQuestion.includes('dmn') || lowerQuestion.includes('automatiseren')) {
    return `**Geschikt voor DMN (automatiseerbare logica):**
- Is de aanvraag volledig? (alle drie verplichte onderdelen aanwezig)
- Voldoet burger aan basisvoorwaarden?
- Is aanvullende beoordeling nodig?

**Niet geschikt voor DMN:**
- "Bijzondere omstandigheden" - vereist menselijk oordeel
- "Aannemelijk maken" - vereist interpretatieruimte
- "Redelijke ondersteuning" - policy-discretie

De formele controlestappen kunnen in DMN, maar de inhoudelijke beoordeling in artikel 4 lid 4 vereist menselijke expertise.`;
  }

  if (lowerQuestion.includes('menselijk') || lowerQuestion.includes('handmatig')) {
    return `**Waar is menselijke beoordeling nodig:**

1. **Bijzondere omstandigheden (artikel 4 lid 4)**
   - Situaties die niet in het standaardtraject passen
   - Vereist professioneel oordeel

2. **Redelijke ondersteuning bepalen**
   - Wat is "redelijk" hangt af van context
   - Vereist dialoog met burger

3. **Discretionaire afwegingen**
   - Proportionaliteit beoordelen
   - Individuele omstandigheden meewegen

4. **Complexe cases**
   - Meerdere wettelijke bepalingen tegelijk
   - Conflicterende belangen

Deze elementen moeten in het service design voorbij DMN liggen.`;
  }

  if (lowerQuestion.includes('brief') || lowerQuestion.includes('communicatie')) {
    return `**Brief elementen volgens artikel 4 lid 5:**

De beslissingsbrief MOET bevatten:
- Duidelijke ja/nee beslissing
- Motivering van het besluit
- Juridische basis
- Informatie over bezwaar en beroepsmogelijkheden
- Contactgegevens voor vragen

**Toon:**
- Respectvol en begrijpelijk
- Geen onnodig juridisch jargon
- Helder wat de burger moet doen

**Voorbeeld motivering:**
"U hebt uw aanvraag ingediend met een beschrijving van uw persoonlijke situatie, de ondersteuning die u vraagt en de reden waarom dit nodig is. Dit voldoet aan de wettelijke vereisten uit artikel 4 lid 2."

Wil je een voorbeeld brief zien?`;
  }

  // Default response
  return `Ik heb uw vraag begrepen: "${question}"

Kunt u specifieker zijn welk aspect u wilt verkennen:
- **Dienstverlening**: "Welke dienstverlening volgt uit dit artikel?"
- **Vragen**: "Welke vragen moeten we stellen?"
- **Gegevens**: "Welke gegevens zijn juridisch noodzakelijk?"
- **Digitaal**: "Welke onderdelen kunnen digitaal afgehandeld worden?"
- **Menselijk**: "Waar is menselijke beoordeling nodig?"
- **Communicatie**: "Welke brief moeten we sturen?"
- **DMN**: "Welke onderdelen zijn geschikt voor DMN?"

Ik zal mijn antwoord direct koppelen aan de wettekst.`;
};
