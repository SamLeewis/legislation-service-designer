import { create } from 'zustand';
import { Analysis, LegalSource, ServiceElement, WorkshopNote } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AnalysisStore {
  analysis: Analysis | null;
  setAnalysis: (analysis: Analysis) => void;
  createNewAnalysis: (projectName: string) => void;
  addLegalSource: (source: LegalSource) => void;
  updateServiceElement: (element: ServiceElement) => void;
  addWorkshopNote: (note: WorkshopNote) => void;
  getCurrentAnalysis: () => Analysis | null;
}

const createEmptyAnalysis = (projectName: string): Analysis => ({
  id: uuidv4(),
  projectName,
  legalSources: [],
  legalElements: [],
  interpretationPoints: [],
  serviceVariants: [],
  dmnModels: [],
  workshopNotes: [],
  traceability: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft',
});

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  analysis: null,
  
  setAnalysis: (analysis: Analysis) => set({ analysis }),
  
  createNewAnalysis: (projectName: string) => {
    const newAnalysis = createEmptyAnalysis(projectName);
    set({ analysis: newAnalysis });
    localStorage.setItem('currentAnalysis', JSON.stringify(newAnalysis));
  },
  
  addLegalSource: (source: LegalSource) => {
    set((state) => {
      if (!state.analysis) return state;
      return {
        analysis: {
          ...state.analysis,
          legalSources: [...state.analysis.legalSources, source],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  },
  
  updateServiceElement: (element: ServiceElement) => {
    set((state) => {
      if (!state.analysis) return state;
      const variantIndex = state.analysis.serviceVariants.findIndex(
        (v) => v.id === element.serviceVariant
      );
      if (variantIndex === -1) return state;

      const updatedVariants = [...state.analysis.serviceVariants];
      const elementIndex = updatedVariants[variantIndex].serviceElements.findIndex(
        (e) => e.id === element.id
      );
      if (elementIndex !== -1) {
        updatedVariants[variantIndex].serviceElements[elementIndex] = element;
      }

      return {
        analysis: {
          ...state.analysis,
          serviceVariants: updatedVariants,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  },

  addWorkshopNote: (note: WorkshopNote) => {
    set((state) => {
      if (!state.analysis) return state;
      return {
        analysis: {
          ...state.analysis,
          workshopNotes: [...state.analysis.workshopNotes, note],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  },

  getCurrentAnalysis: () => get().analysis,
}));
