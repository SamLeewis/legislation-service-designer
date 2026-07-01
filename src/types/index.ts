export type ServiceVariant = "digital_first" | "human_assisted" | "hybrid";
export type ValidationStatus = 
  | "not_checked" 
  | "needs_legal_review" 
  | "legally_checked" 
  | "service_checked" 
  | "stakeholder_checked" 
  | "rejected";
export type DMNSuitability = "suitable" | "partly_suitable" | "not_suitable" | "legal_interpretation_needed";
export type MandatoryStatus = "mandatory" | "recommended" | "optional" | "requires_legal_validation";
export type ServiceElementType = 
  | "form_field" 
  | "process_step" 
  | "decision_point" 
  | "letter_text" 
  | "explanation_text" 
  | "employee_task" 
  | "manual_review" 
  | "non_digital_route" 
  | "evidence_requirement" 
  | "dmn_decision" 
  | "dmn_rule" 
  | "workshop_note";
export type Channel = "digital" | "physical" | "phone" | "letter" | "employee_action" | "hybrid";
export type PublicValue = 
  | "begrijpelijkheid" 
  | "transparantie" 
  | "rechtvaardigheid" 
  | "proportionaliteit" 
  | "uitvoerbaarheid" 
  | "rechtszekerheid" 
  | "toegankelijkheid";

export interface LegalSource {
  id: string;
  title: string;
  article?: string;
  paragraph?: string;
  sourceUrl?: string;
  effectiveDate?: string;
  responsibleOrganisation?: string;
  type: "law" | "regulation" | "policy_rule" | "work_instruction" | "municipal_rule" | "other";
  version?: string;
  status: "draft" | "proposed" | "active" | "expired" | "unknown";
  fullText: string;
  uploadedAt: string;
}

export interface LegalElement {
  id: string;
  sourceId: string;
  type: "obligation" | "right" | "condition" | "exception" | "definition" | "time_limit" | "evidence_requirement" | "decision_point" | "reference" | "discretion" | "human_judgement" | "vague_term" | "communication_obligation" | "procedural_obligation" | "objection_appeal" | "implementation_constraint";
  title: string;
  description: string;
  textFragment: string;
  article?: string;
  paragraph?: string;
  requiresInterpretation: boolean;
  vagueTerms?: string[];
  relatedArticles?: string[];
}

export interface InterpretationPoint {
  id: string;
  legalElementId: string;
  sourceId: string;
  question: string;
  vagueTerms: string[];
  suggestedInterpretations: string[];
  selectedInterpretation?: string;
  validationNeeded: boolean;
  validatedBy?: "legal_expert" | "policy_officer" | "implementation_professional" | "workshop_consensus";
  consequences: string[];
  dmnImpact: string;
}

export interface ServiceElement {
  id: string;
  sourceId: string;
  type: ServiceElementType;
  title: string;
  description: string;
  serviceVariant: ServiceVariant;
  mandatoryStatus: MandatoryStatus;
  dmnSuitability: DMNSuitability;
  legalBasis: {
    sourceTitle: string;
    article?: string;
    paragraph?: string;
    textFragment: string;
    reasoning: string;
  };
  interpretation: {
    summary: string;
    assumptions: string[];
    uncertainties: string[];
  };
  serviceDesign: {
    channel: Channel;
    userGroup: string;
    serviceOutput: string;
    employeeAction?: string;
    communicationText?: string;
  };
  dmnMapping?: {
    decisionId: string;
    decisionName: string;
    inputData: string[];
    output: string;
    hitPolicy: "UNIQUE" | "FIRST" | "COLLECT" | "ANY" | "PRIORITY";
    rules: DMNRule[];
  };
  publicValues: PublicValue[];
  validationStatus: ValidationStatus;
  feedback: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DMNRule {
  id: string;
  index: number;
  conditions: Record<string, string>;
  output: string;
  annotation?: string;
}

export interface ServiceVariantDesign {
  id: string;
  sourceId: string;
  variantType: ServiceVariant;
  title: string;
  description: string;
  serviceElements: ServiceElement[];
  publicValueTensions: {
    tension: string;
    explanation: string;
    serviceImplication: string;
  }[];
  validationChecklist: {
    item: string;
    checked: boolean;
    notes: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface DMNModel {
  id: string;
  sourceId: string;
  title: string;
  namespace: string;
  decisions: DMNDecision[];
  businessKnowledgeModels: DMNBusinessKnowledgeModel[];
  inputs: DMNInput[];
  annotations: DMNAnnotation[];
}

export interface DMNDecision {
  id: string;
  name: string;
  variable: string;
  inputs: string[];
  decisionTable: DMNDecisionTable;
  sourceArticle?: string;
  sourceParagraph?: string;
  validationWarnings: string[];
}

export interface DMNDecisionTable {
  hitPolicy: "UNIQUE" | "FIRST" | "COLLECT" | "ANY" | "PRIORITY";
  inputs: DMNInputClause[];
  outputs: DMNOutputClause[];
  rules: DMNDecisionRule[];
}

export interface DMNInputClause {
  id: string;
  label: string;
  inputExpression: string;
  allowedValues?: string[];
}

export interface DMNOutputClause {
  id: string;
  label: string;
  name: string;
  typeRef?: string;
  allowedValues?: string[];
}

export interface DMNDecisionRule {
  id: string;
  index: number;
  inputEntries: string[];
  outputEntry: string;
  annotation?: string;
}

export interface DMNInput {
  id: string;
  name: string;
  typeRef: string;
  allowedValues?: string[];
}

export interface DMNBusinessKnowledgeModel {
  id: string;
  name: string;
  description: string;
  encapsulatedLogic: string;
}

export interface DMNAnnotation {
  id: string;
  element: string;
  text: string;
  sourceArticle?: string;
  assumptions: string[];
}

export interface WorkshopNote {
  id: string;
  sourceId: string;
  timestamp: string;
  facilitatorName: string;
  topic: "legal_interpretation" | "service_design" | "stakeholder_concern" | "public_value" | "validation" | "dmn_suitability" | "other";
  content: string;
  relatedElements: string[];
  actionItems: {
    description: string;
    owner?: string;
    dueDate?: string;
    completed: boolean;
  }[];
  decisions: {
    description: string;
    rationale: string;
    affectedElements: string[];
  }[];
}

export interface Analysis {
  id: string;
  projectName: string;
  legalSources: LegalSource[];
  legalElements: LegalElement[];
  interpretationPoints: InterpretationPoint[];
  serviceVariants: ServiceVariantDesign[];
  dmnModels: DMNModel[];
  workshopNotes: WorkshopNote[];
  traceability: TraceabilityLink[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "in_progress" | "ready_for_review" | "validated" | "archived";
}

export interface TraceabilityLink {
  id: string;
  sourceType: "legal_source" | "legal_element" | "interpretation_point" | "service_element" | "dmn_decision";
  sourceId: string;
  targetType: "legal_source" | "legal_element" | "interpretation_point" | "service_element" | "dmn_decision";
  targetId: string;
  linkType: "derived_from" | "implements" | "requires" | "constrains" | "contradicts";
  explanation: string;
}
