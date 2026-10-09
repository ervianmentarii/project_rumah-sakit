import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { useQueues } from '../../hooks/useQueues';
import { useEcho } from '../../hooks/useEcho';
import QueueMonitor from '../../components/ui/QueueMonitor';

export default function DoctorDashboardPage() {
  const navigate = useNavigate();
  const [selectedPoli, setSelectedPoli] = useState('Semua Poli');
  
  // Fetch only triaged patients
  const { data: queuesResponse, isLoading } = useQueues({ status: 'triase', per_page: -1 });
  
  // Real-time listener for new triage arrivals
  useEcho('doctor-channel', 'PatientReadyForExam', (e) => {
    console.log('New patient ready', e);
  });

  const queues = Array.isArray(queuesResponse) ? queuesResponse : (queuesResponse?.data || []);

  const calculateAge = (dob) => {
    if (!dob) return '-';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  // Get unique polys dynamically from available queues, plus some common ones so doctors always see them
  const availablePolys = [...new Set(queues.map(q => q.poli))];
  const allPolys = ['Semua Poli', ...new Set(['Poli Umum', 'Poli Anak', 'Poli Gigi', 'Poli Kandungan', ...availablePolys])];

  const filteredQueues = queues.filter(q => selectedPoli === 'Semua Poli' || q.poli === selectedPoli);

  const columns = [
    { header: 'Antrean', accessor: 'no_antrian' },
    { 
      header: 'Nama Pasien', 
      render: (row) => (
        <div>
          <p className="font-semibold">{row.patient?.nama}</p>
          <p className="text-xs text-slate-500">{calculateAge(row.patient?.tanggal_lahir)} Tahun</p>
        </div>
      ) 
    },
    { header: 'Poliklinik', accessor: 'poli' },
    { 
      header: 'Aksi', 
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary" onClick={() => navigate(`/doctor/examine/${row.id}`)}>
            Mulai Periksa
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate(`/doctor/history/${row.patient?.id}`)}>
            Riwayat Medis
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard Dokter</h1>
      
      {/* Polyclinic Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allPolys.map(poli => (
          <button
            key={poli}
            onClick={() => setSelectedPoli(poli)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedPoli === poli 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:text-purple-600'
            }`}
          >
            {poli}
          </button>
        ))}
      </div>

      <Card title={`Antrean Pemeriksaan - ${selectedPoli}`}>
        <Table 
          columns={columns} 
          data={filteredQueues} 
          isLoading={isLoading} 
        />
      </Card>

      <QueueMonitor />
    </div>
  );
}
