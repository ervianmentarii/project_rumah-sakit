import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQueues } from '../../hooks/useQueues';
import QueueMonitor from '../../components/ui/QueueMonitor';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: queuesResponse, isLoading } = useQueues({ per_page: -1 });

  const queues = Array.isArray(queuesResponse) ? queuesResponse : (queuesResponse?.data || []);
  
  const patientsToday = queues.length;
  const inQueue = queues.filter(q => q.status !== 'selesai' && q.status !== 'batal').length;
  const completed = queues.filter(q => q.status === 'selesai').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Selamat Datang, {user?.name}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Total Kunjungan Hari Ini</h3>
          <p className="text-3xl font-bold text-clinic-primary mt-2">{patientsToday}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Sedang Antre / Diproses</h3>
          <p className="text-3xl font-bold text-clinic-secondary mt-2">{inQueue}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-medium text-slate-500">Selesai</h3>
          <p className="text-3xl font-bold text-clinic-accent mt-2">{completed}</p>
        </div>
      </div>

      <QueueMonitor />
    </div>
  );
}
