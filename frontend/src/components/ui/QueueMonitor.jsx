import React, { useState } from 'react';
import Card from './Card';
import Table from './Table';
import Badge from './Badge';
import Button from './Button';
import { useQueues } from '../../hooks/useQueues';

export default function QueueMonitor() {
  const [filter, setFilter] = useState('semua');
  
  const { data: queuesResponse, isLoading } = useQueues({ per_page: -1 });

  // Handle both { data: [...] } format and raw array format
  const queues = Array.isArray(queuesResponse) ? queuesResponse : (queuesResponse?.data || []);
  
  const filteredData = filter === 'semua' ? queues : queues.filter(q => q.status === filter);

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
    }
  ];

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Pantauan Antrean</h2>
        <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide flex-nowrap" style={{ WebkitOverflowScrolling: "touch" }}>
          <Button variant={filter === 'semua' ? 'primary' : 'secondary'} className="whitespace-nowrap flex-shrink-0" onClick={() => setFilter('semua')}>Semua</Button>
          <Button variant={filter === 'menunggu' ? 'primary' : 'secondary'} className="whitespace-nowrap flex-shrink-0" onClick={() => setFilter('menunggu')}>Menunggu</Button>
          <Button variant={filter === 'triase' ? 'primary' : 'secondary'} className="whitespace-nowrap flex-shrink-0" onClick={() => setFilter('triase')}>Triase</Button>
          <Button variant={filter === 'periksa' ? 'primary' : 'secondary'} className="whitespace-nowrap flex-shrink-0" onClick={() => setFilter('periksa')}>Diperiksa</Button>
          <Button variant={filter === 'selesai' ? 'primary' : 'secondary'} className="whitespace-nowrap flex-shrink-0" onClick={() => setFilter('selesai')}>Selesai</Button>
        </div>
      </div>
      <Card>
        <Table 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
          emptyMessage="Tidak ada antrean hari ini."
        />
      </Card>
    </div>
  );
}

