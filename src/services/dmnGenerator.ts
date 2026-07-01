import { ServiceVariantDesign, DMNModel, DMNDecision } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Generate DMN model from service variant design
export const generateDMNModel = (variant: ServiceVariantDesign): DMNModel => {
  const model: DMNModel = {
    id: uuidv4(),
    sourceId: variant.sourceId,
    title: `DMN Model: ${variant.title}`,
    namespace: `http://legislation.nl/dmn/${variant.id}`,
    decisions: [],
    businessKnowledgeModels: [],
    inputs: generateDMNInputs(variant),
    annotations: [],
  };

  // Extract decision points that are suitable for DMN
  const decisionElements = variant.serviceElements.filter(
    el => el.dmnSuitability === 'suitable' || el.dmnSuitability === 'partly_suitable'
  );

  // Generate decisions from service elements
  model.decisions = decisionElements.map((el, idx) => generateDecision(el, idx));

  return model;
};

const generateDMNInputs = (variant: ServiceVariantDesign) => {
  return [
    {
      id: 'input_1',
      name: 'persoonlijke_situatie_beschreven',
      typeRef: 'boolean',
      allowedValues: ['ja', 'nee'],
    },
    {
      id: 'input_2',
      name: 'ondersteuning_beschreven',
      typeRef: 'boolean',
      allowedValues: ['ja', 'nee'],
    },
    {
      id: 'input_3',
      name: 'noodzaak_beschreven',
      typeRef: 'boolean',
      allowedValues: ['ja', 'nee'],
    },
    {
      id: 'input_4',
      name: 'voorziening_zelfstandig',
      typeRef: 'boolean',
      allowedValues: ['ja', 'nee'],
    },
    {
      id: 'input_5',
      name: 'bijzondere_omstandigheden',
      typeRef: 'boolean',
      allowedValues: ['ja', 'nee'],
    },
  ];
};

const generateDecision = (element: any, index: number): DMNDecision => {
  return {
    id: uuidv4(),
    name: element.title,
    variable: element.title.toLowerCase().replace(/\s+/g, '_').substring(0, 30),
    inputs: ['persoonlijke_situatie_beschreven', 'ondersteuning_beschreven'],
    decisionTable: {
      hitPolicy: 'UNIQUE',
      inputs: [
        {
          id: 'input_1',
          label: 'Persoonlijke situatie beschreven?',
          inputExpression: 'persoonlijke_situatie_beschreven',
          allowedValues: ['ja', 'nee'],
        },
      ],
      outputs: [
        {
          id: 'output_1',
          label: 'Aanvraag volledig',
          name: 'aanvraag_volledig',
          typeRef: 'boolean',
          allowedValues: ['ja', 'nee'],
        },
      ],
      rules: [
        {
          id: 'rule_1',
          index: 1,
          inputEntries: ['"ja"'],
          outputEntry: '"ja"',
          annotation: 'Aanvraag bevat alle verplichte gegevens',
        },
        {
          id: 'rule_2',
          index: 2,
          inputEntries: ['"nee"'],
          outputEntry: '"nee"',
          annotation: 'Aanvraag is onvolledig',
        },
      ],
    },
    sourceArticle: element.legalBasis?.article,
    sourceParagraph: element.legalBasis?.paragraph,
    validationWarnings: element.interpretation?.uncertainties || [],
  };
};

// Generate DMN XML conforming to DMN 1.5 specification
export const generateDMNXML = (model: DMNModel): string => {
  const decisions = model.decisions.map(d => generateDecisionXML(d)).join('\n  ');
  const inputs = model.inputs.map(i => generateInputXML(i)).join('\n  ');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20191111/MODEL/" 
             xmlns:dmndi="http://www.omg.org/spec/DMN/20191111/DMNDI/"
             xmlns:di="http://www.omg.org/spec/DMN/20191111/DI/"
             xmlns:dc="http://www.omg.org/spec/DMN/20191111/DC/"
             id="${model.id}"
             name="${escapeXml(model.title)}"
             namespace="${model.namespace}">
  
  <description>${escapeXml(model.title)}</description>
  
  <!-- Input Data Elements -->
  ${inputs}
  
  <!-- Decisions -->
  ${decisions}
  
  <!-- DMNDI Diagram Information -->
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="diagram_1" name="${escapeXml(model.title)}">
      <dmndi:Size width="800" height="600"/>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
  
</definitions>`;

  return xml;
};

const generateInputXML = (input: any): string => {
  const allowedValuesXml = input.allowedValues 
    ? `<allowedValues>
      <text>${input.allowedValues.join(', ')}</text>
    </allowedValues>`
    : '';

  return `<inputData id="${input.id}" name="${escapeXml(input.name)}">
    <variable id="${input.id}_var" name="${escapeXml(input.name)}" typeRef="${input.typeRef}"/>
    ${allowedValuesXml}
  </inputData>`;
};

const generateDecisionXML = (decision: DMNDecision): string => {
  const inputClauses = decision.decisionTable.inputs
    .map(i => `      <inputClause id="${i.id}">
        <label>${escapeXml(i.label)}</label>
        <inputExpression id="${i.id}_expr" typeRef="string">
          <text>${escapeXml(i.inputExpression)}</text>
        </inputExpression>
        ${i.allowedValues ? `<inputValues><text>${i.allowedValues.join(', ')}</text></inputValues>` : ''}
      </inputClause>`)
    .join('\n');

  const outputClauses = decision.decisionTable.outputs
    .map(o => `      <outputClause id="${o.id}" name="${escapeXml(o.name)}" typeRef="${o.typeRef || 'string'}">
        ${o.allowedValues ? `<outputValues><text>${o.allowedValues.join(', ')}</text></outputValues>` : ''}
      </outputClause>`)
    .join('\n');

  const rules = decision.decisionTable.rules
    .map(r => `      <rule id="${r.id}">
        <description>${escapeXml(r.annotation || '')}</description>
        ${r.inputEntries.map((entry, i) => `<inputEntry id="${r.id}_input_${i + 1}"><text>${entry}</text></inputEntry>`).join('\n        ')}
        <outputEntry id="${r.id}_output_1"><text>${r.outputEntry}</text></outputEntry>
      </rule>`)
    .join('\n');

  return `  <decision id="${decision.id}" name="${escapeXml(decision.name)}">
    <variable id="${decision.variable}_var" name="${decision.variable}" typeRef="string"/>
    <informationRequirement>
      <requiredInput href="#input_1"/>
    </informationRequirement>
    <decisionTable id="table_${decision.id}" hitPolicy="${decision.decisionTable.hitPolicy}">
${inputClauses}
${outputClauses}
${rules}
    </decisionTable>
    <documentation id="doc_${decision.id}">
      <text>Source article: ${decision.sourceArticle || 'Unknown'}</text>
    </documentation>
  </decision>`;
};

const escapeXml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Generate human-readable DMN explanation in Dutch
export const generateDMNExplanation = (model: DMNModel): string => {
  let explanation = `# DMN Model Toelichting: ${model.title}\n\n`;
  
  explanation += `## Ingevoerde gegevens (Input Data)\n`;
  explanation += `Deze gegevens worden gebruikt als invoer voor de beslissingen:\n\n`;
  model.inputs.forEach(input => {
    explanation += `- **${input.name}**: ${input.typeRef}`;
    if (input.allowedValues) {
      explanation += ` (mogelijke waarden: ${input.allowedValues.join(', ')})`;
    }
    explanation += `\n`;
  });
  
  explanation += `\n## Beslissingen (Decisions)\n`;
  explanation += `Deze beslissingen worden in het systeem genomen:\n\n`;
  model.decisions.forEach(decision => {
    explanation += `### ${decision.name}\n`;
    explanation += `**Wettelijke basis**: ${decision.sourceArticle || 'Onbekend'}\n`;
    if (decision.validationWarnings.length > 0) {
      explanation += `**Validatiewaarschuwingen**: ${decision.validationWarnings.join(', ')}\n`;
    }
    explanation += `\n`;
  });
  
  explanation += `## Elementen buiten DMN\n`;
  explanation += `Deze onderdelen kunnen niet (volledig) in DMN worden gemodelleerd:\n`;
  explanation += `- Communicatie en toonzetting van brieven\n`;
  explanation += `- Complexe discretionaire beoordeling\n`;
  explanation += `- Menselijk contact en ondersteuning\n`;
  explanation += `- Processtappen die niet besluitvorming zijn\n`;

  return explanation;
};
