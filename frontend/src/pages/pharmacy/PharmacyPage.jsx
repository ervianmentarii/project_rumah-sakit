import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { usePharmacyStore } from '../../stores/pharmacyStore';
import { useEcho } from '../../hooks/useEcho';
import toast from 'react-hot-toast';
import MedicineLabelPrint from './MedicineLabelPrint';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export default function PharmacyPage() {
  const { pendingPrescriptions, processingPrescriptions, completedPrescriptions, addPrescription, updateStatus, removePrescription } = usePharmacyStore();
  const printRef = useRef();
  
  // Real-time listener for new prescriptions from doctor
  useEcho('pharmacy-channel', 'NewPrescription', (e) => {
    toast.success(`Resep baru untuk ${e.patientName}!`);
    addPrescription(e.prescription);
  });

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const { data: prescriptionsResponse, refetch } = useQuery({
    queryKey: ['pharmacy', 'pending'],
    queryFn: async () => {
      const { data } = await api.get('/pharmacy/pending');
      return data;
    }
  });

  useEffect(() => {
    if (prescriptionsResponse) {
      const serverPrescriptions = Array.isArray(prescriptionsResponse) ? prescriptionsResponse : (prescriptionsResponse?.data || []);
      
      const newPending = [];
      const newProcessing = [];
      const newCompleted = [];
      
      serverPrescriptions.forEach(p => {
        const mapped = {
          id: p.id,
          patientName: p.patient?.nama || 'Unknown',
          items: p.items?.map(i => ({ name: i.medicine?.nama_obat, dosage: i.dosis, qty: i.jumlah })) || [],
          status: p.status
        };
        if (p.status === 'diproses') newProcessing.push(mapped);
        else if (p.status === 'selesai') newCompleted.push(mapped);
        else newPending.push(mapped);
      });
      
      usePharmacyStore.getState().setPrescriptions(newPending, newProcessing, newCompleted);
    }
  }, [prescriptionsResponse]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Farmasi & Resep</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <Card title="Antrean Resep (Menunggu)" bodyClassName="p-4 bg-slate-50 min-h-[60vh]">
          <div className="space-y-4">
            {pendingPrescriptions.map((pres) => (
              <Card key={pres.id} className="cursor-pointer border-l-4 border-l-yellow-400">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">{pres.patientName}</h4>
                    <Badge variant="yellow">Pending</Badge>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="danger" className="w-1/3" onClick={async () => {
                      try {
                        await api.put(`/pharmacy/${pres.id}/cancel`);
                        usePharmacyStore.getState().removePrescription(pres.id);
                        toast.success('Resep berhasil dibatalkan dan dihapus');
                      } catch(e) { 
                        toast.error('Gagal membatalkan: ' + (e.response?.data?.message || e.message)); 
                      }
                    }}>
                      Batalkan Resep
                    </Button>
                    <Button size="sm" variant="primary" className="flex-1" onClick={async () => {
                      try {
                        await api.put(`/pharmacy/${pres.id}/process`);
                        updateStatus(pres.id, 'diproses');
                      } catch(e) { toast.error('Gagal memproses resep'); }
                    }}>
                      Proses Resep
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Processing */}
        <Card title="Sedang Diproses" bodyClassName="p-4 bg-blue-50 min-h-[60vh]">
          <div className="space-y-4">
            {processingPrescriptions.map((pres) => (
              <Card key={pres.id} className="border-l-4 border-l-blue-400">
                <div className="p-4">
                  <h4 className="font-bold mb-2">{pres.patientName}</h4>
                  <ul className="text-sm text-slate-600 mb-4 space-y-1">
                    {pres.items.map((item, idx) => (
                      <li key={idx}>- {item.name} ({item.qty}) - {item.dosage}</li>
                    ))}
                  </ul>
                  
                  <div className="hidden">
                    <MedicineLabelPrint ref={printRef} data={pres} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" onClick={async () => {
                      try {
                        await api.put(`/pharmacy/${pres.id}/cancel`);
                        usePharmacyStore.getState().removePrescription(pres.id);
                        toast.success('Resep berhasil dibatalkan dan dihapus');
                      } catch(e) { 
                        toast.error('Gagal membatalkan: ' + (e.response?.data?.message || e.message)); 
                      }
                    }}>
                      Batalkan Resep
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePrint}>Cetak</Button>
                    <Button size="sm" variant="success" className="flex-1" onClick={async () => {
                      try {
                        await api.put(`/pharmacy/${pres.id}/complete`);
                        updateStatus(pres.id, 'selesai');
                        toast.success('Resep selesai dan stok obat dipotong');
                      } catch (err) {
                        toast.error(err.response?.data?.message || 'Gagal menyelesaikan resep');
                      }
                    }}>
                      Selesai
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Completed */}
        <Card title="Selesai" bodyClassName="p-4 bg-green-50 min-h-[60vh]">
          <div className="space-y-4">
            {completedPrescriptions.map((pres) => (
              <Card key={pres.id} className="border-l-4 border-l-green-400 opacity-70">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">{pres.patientName}</h4>
                    <Badge variant="green">Selesai</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
