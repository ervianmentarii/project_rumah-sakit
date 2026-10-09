import { create } from 'zustand';

export const usePharmacyStore = create((set) => ({
  pendingPrescriptions: [],
  processingPrescriptions: [],
  completedPrescriptions: [],
  
  setPrescriptions: (pending, processing, completed) => 
    set({ pendingPrescriptions: pending, processingPrescriptions: processing, completedPrescriptions: completed }),
    
  addPrescription: (prescription) => 
    set((state) => {
      const status = prescription.status || 'pending';
      if (status === 'diproses') {
        return { processingPrescriptions: [...state.processingPrescriptions, prescription] };
      } else if (status === 'selesai') {
        return { completedPrescriptions: [...state.completedPrescriptions, prescription] };
      }
      return { pendingPrescriptions: [...state.pendingPrescriptions, prescription] };
    }),
    
  updateStatus: (id, newStatus) => 
    set((state) => {
      // Find prescription across all lists
      let prescription = 
        state.pendingPrescriptions.find(p => p.id === id) ||
        state.processingPrescriptions.find(p => p.id === id) ||
        state.completedPrescriptions.find(p => p.id === id);
        
      if (!prescription) return state;
      
      const updatedPrescription = { ...prescription, status: newStatus };
      
      return {
        pendingPrescriptions: newStatus === 'pending' 
          ? [...state.pendingPrescriptions.filter(p => p.id !== id), updatedPrescription] 
          : state.pendingPrescriptions.filter(p => p.id !== id),
        processingPrescriptions: newStatus === 'diproses'
          ? [...state.processingPrescriptions.filter(p => p.id !== id), updatedPrescription]
          : state.processingPrescriptions.filter(p => p.id !== id),
        completedPrescriptions: newStatus === 'selesai'
          ? [...state.completedPrescriptions.filter(p => p.id !== id), updatedPrescription]
          : state.completedPrescriptions.filter(p => p.id !== id)
      };
    }),
    
  removePrescription: (id) => 
    set((state) => ({
      pendingPrescriptions: state.pendingPrescriptions.filter(p => p.id !== id),
      processingPrescriptions: state.processingPrescriptions.filter(p => p.id !== id),
      completedPrescriptions: state.completedPrescriptions.filter(p => p.id !== id)
    }))
}));
