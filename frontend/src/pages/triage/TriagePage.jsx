import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { triageSchema } from '../../lib/validations';
import { useTriages } from '../../hooks/useTriages';
import { useQueues } from '../../hooks/useQueues';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import QueueMonitor from '../../components/ui/QueueMonitor';

export default function TriagePage() {
  const { createTriage } = useTriages();
  const { data: queuesResponse, isLoading: isLoadingQueues } = useQueues({ status: 'menunggu', per_page: -1 });
  const [selectedQueue, setSelectedQueue] = useState(null);
  
  const queues = Array.isArray(queuesResponse) ? queuesResponse : (queuesResponse?.data || []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(triageSchema)
  });

  const onSubmit = (data) => {
    if (!selectedQueue) return;
    createTriage.mutate({ queue_id: selectedQueue.id, ...data }, {
      onSuccess: () => {
        reset();
        setSelectedQueue(null);
      }
    });
  };

  const columns = [
    { header: 'NO. ANTREAN', accessor: 'no_antrian' },
    { header: 'NAMA PASIEN', render: (row) => row.patient?.nama },
    { header: 'POLIKLINIK', accessor: 'poli' },
    { 
      header: 'STATUS', 
      render: () => <Badge variant="yellow">MENUNGGU</Badge> 
    },
    { 
      header: 'AKSI', 
      render: (row) => (
        <Button size="sm" variant="primary" onClick={() => setSelectedQueue(row)}>
          Panggil ke Triase
        </Button>
      ) 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Pemeriksaan Awal (Triase)</h1>
        {selectedQueue && (
          <Button variant="outline" onClick={() => {
            setSelectedQueue(null);
            reset();
          }}>
            Kembali ke Antrean
          </Button>
        )}
      </div>
      
      {!selectedQueue ? (
        <Card title="Daftar Antrean Pasien (Menunggu)">
          <Table 
            columns={columns} 
            data={queues} 
            isLoading={isLoadingQueues} 
            emptyMessage="Tidak ada pasien dalam antrean menunggu."
          />
        </Card>
      ) : (
        <Card>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Pasien Terpilih:</p>
              <p className="text-lg font-bold text-slate-800">{selectedQueue.no_antrian} - {selectedQueue.patient?.nama}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Poli Tujuan:</p>
              <p className="font-semibold text-slate-700">{selectedQueue.poli}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Tekanan Darah (mmHg)" placeholder="120/80" {...register('tekanan_darah')} error={errors.tekanan_darah?.message} />
              <Input type="number" label="Suhu (°C)" step="0.1" {...register('suhu')} error={errors.suhu?.message} />
              <Input type="number" label="Nadi (x/mnt)" {...register('nadi')} error={errors.nadi?.message} />
              <Input type="number" label="Pernapasan (x/mnt)" {...register('pernapasan')} error={errors.pernapasan?.message} />
              <Input type="number" label="Berat Badan (kg)" step="0.1" {...register('berat_badan')} error={errors.berat_badan?.message} />
              <Input type="number" label="Tinggi Badan (cm)" {...register('tinggi_badan')} error={errors.tinggi_badan?.message} />
            </div>

            <TextArea label="Keluhan Utama" rows={3} {...register('keluhan_utama')} error={errors.keluhan_utama?.message} />
            <TextArea label="Riwayat Penyakit" rows={2} {...register('riwayat_penyakit')} error={errors.riwayat_penyakit?.message} />
            <TextArea label="Catatan Perawat" rows={2} {...register('catatan_perawat')} error={errors.catatan_perawat?.message} />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setSelectedQueue(null)}>
                Batal
              </Button>
              <Button type="submit" isLoading={createTriage.isPending}>
                Simpan Data Triase
              </Button>
            </div>
          </form>
        </Card>
      )}

      <QueueMonitor />
    </div>
  );
}
