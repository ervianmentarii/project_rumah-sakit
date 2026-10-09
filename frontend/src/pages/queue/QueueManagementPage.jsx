import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useQueues } from '../../hooks/useQueues';
import { useAuthStore } from '../../stores/authStore';

export default function QueueManagementPage() {
  const { user } = useAuthStore();
  const { data: queues, updateQueueStatus, isLoading } = useQueues({ per_page: 100 });
  const [filter, setFilter] = useState('menunggu');

  const handleCall = (id) => {
    updateQueueStatus.mutate({ id, status: 'triase' });
  };

  const columns = [
    { header: 'No. Antrean', accessor: 'no_antrian' },
    { 
      header: 'Nama Pasien', 
      render: (row) => row.patient?.nama || '-' 
    },
    { header: 'Poliklinik', accessor: 'poli' },
    { 
      header: 'Status', 
      render: (row) => {
        const variants = {
          menunggu: 'yellow',
          triase: 'blue',
          periksa: 'purple',
          selesai: 'green',
          batal: 'red'
        };
        return (
          <Badge variant={variants[row.status] || 'gray'}>
            {row.status.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      header: 'Aksi',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {(user?.role === 'admin' || user?.role === 'perawat') ? (
            row.status === 'menunggu' ? (
              <Button size="sm" variant="primary" onClick={() => handleCall(row.id)}>
                Panggil ke Triase
              </Button>
            ) : (
              <span className="text-slate-400">-</span>
            )
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
      )
    }
  ];

  // Pastikan data berbentuk array. Response dari laravel biasanya { data: [...] }
  const tableData = Array.isArray(queues) ? queues : (queues?.data || []);
  
  // Filter data sesuai state filter
  const filteredData = tableData.filter(q => q.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Antrean</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/queues/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-4">
            + Antrean Baru
          </Link>
          <Button variant={filter === 'menunggu' ? 'primary' : 'secondary'} onClick={() => setFilter('menunggu')}>Menunggu</Button>
          <Button variant={filter === 'triase' ? 'primary' : 'secondary'} onClick={() => setFilter('triase')}>Triase</Button>
          <Button variant={filter === 'periksa' ? 'primary' : 'secondary'} onClick={() => setFilter('periksa')}>Diperiksa</Button>
          <Button variant={filter === 'selesai' ? 'primary' : 'secondary'} onClick={() => setFilter('selesai')}>Selesai</Button>
        </div>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
        />
      </Card>
    </div>
  );
}
