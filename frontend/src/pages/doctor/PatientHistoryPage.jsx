import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export default function PatientHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const { data: historyResponse, isLoading } = useQuery({
    queryKey: ['medicalRecords', patientId],
    queryFn: async () => {
      const { data } = await api.get(`/medical-records/patient/${patientId}`);
      return data;
    },
    enabled: !!patientId
  });

  const history = Array.isArray(historyResponse) ? historyResponse : (historyResponse?.data || []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Riwayat Rekam Medis</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Kembali</Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Memuat Riwayat...</div>
        ) : history.length === 0 ? (
          <Card><div className="p-4 text-center text-slate-500">Belum ada riwayat rekam medis.</div></Card>
        ) : (
          history.map((record) => (
            <Card key={record.id} title={`Kunjungan: ${new Date(record.tanggal_periksa).toLocaleDateString('id-ID')} - ${record.doctor?.name || 'Dokter'}`}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500">Diagnosis</h4>
                    <p className="text-slate-900">{record.diagnosis}</p>
                    {record.diagnosis_kode && <p className="text-xs text-slate-500">ICD-10: {record.diagnosis_kode}</p>}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500">Tindakan</h4>
                    <p className="text-slate-900">{record.tindakan || '-'}</p>
                  </div>
                </div>
                
                {record.prescription && record.prescription.items && record.prescription.items.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Resep Obat</h4>
                    <ul className="list-disc list-inside text-sm text-slate-700">
                      {record.prescription.items.map((p, idx) => (
                        <li key={idx}>{p.medicine?.nama_obat} ({p.jumlah}) - {p.aturan_pakai}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
