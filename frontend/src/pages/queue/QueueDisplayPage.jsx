import React, { useState } from 'react';
import { useEcho } from '../../hooks/useEcho';

export default function QueueDisplayPage() {
  const [currentQueues, setCurrentQueues] = useState({
    'Umum': 'A-012',
    'Gigi': 'B-005',
    'KIA': 'C-008'
  });

  useEcho('queue-channel', 'QueueUpdated', (event) => {
    setCurrentQueues(prev => ({
      ...prev,
      [event.poli]: event.queueNumber
    }));
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-clinic-secondary mb-4">SISTEM ANTREAN KLINIK</h1>
        <p className="text-2xl text-slate-300">Mohon menunggu panggilan dari petugas kami</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
        {Object.entries(currentQueues).map(([poli, number]) => (
          <div key={poli} className="bg-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center border-4 border-slate-700 shadow-2xl">
            <h2 className="text-4xl font-semibold mb-8 text-slate-400">Poli {poli}</h2>
            <div className="text-8xl font-bold text-clinic-primary tracking-wider bg-slate-900 px-12 py-8 rounded-2xl w-full text-center">
              {number}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-slate-800 p-4 rounded-xl text-center text-slate-400 animate-pulse">
        Layanan darurat harap melapor ke petugas keamanan.
      </div>
    </div>
  );
}
