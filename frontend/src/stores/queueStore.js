import { create } from 'zustand';

export const useQueueStore = create((set) => ({
  queues: [],
  currentQueue: null,
  
  setQueues: (queues) => set({ queues }),
  
  addQueue: (queue) => set((state) => ({ queues: [...state.queues, queue] })),
  
  updateQueue: (id, data) => set((state) => ({
    queues: state.queues.map(q => q.id === id ? { ...q, ...data } : q)
  })),
  
  setCurrentQueue: (queue) => set({ currentQueue: queue }),
  
  removeQueue: (id) => set((state) => ({
    queues: state.queues.filter(q => q.id !== id),
    currentQueue: state.currentQueue?.id === id ? null : state.currentQueue
  }))
}));
