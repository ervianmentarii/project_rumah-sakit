import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { medicalRecordSchema } from '../../lib/validations';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import TextArea from '../../components/ui/TextArea';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useMedicines } from '../../hooks/useMedicines';
import toast from 'react-hot-toast';

export default function MedicalRecordPage() {
  const { queueId } = useParams();
  const navigate = useNavigate();
  const { createMedicalRecord } = useMedicalRecords(null);
  
  const [prescriptions, setPrescriptions] = useState([]);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(medicalRecordSchema)
  });

  const { data: medicinesData } = useMedicines({ per_page: -1 });
  const medicineOptions = (Array.isArray(medicinesData) ? medicinesData : (medicinesData?.data || [])).map(m => ({
    value: m.id,
    label: `${m.nama_obat} (${m.stok} ${m.satuan})`
  }));

  const { data: triage } = useQuery({
    queryKey: ['triage', queueId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/triages/queue/${queueId}`);
        return data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!queueId
  });

  const addPrescriptionItem = () => {
    setPrescriptions([...prescriptions, { medicine: null, jumlah: 1, dosis: '', aturan_pakai: '' }]);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      prescriptions: prescriptions.filter(p => p.medicine)
    };
    
    createMedicalRecord.mutate({ queueId, recordData: payload }, {
      onSuccess: () => navigate('/doctor')
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Pemeriksaan Medis</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Kembali</Button>
      </div>

      {triage && (
        <Card title="Hasil Pemeriksaan Awal (Triase - Perawat)" className="bg-blue-50 border-blue-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-700">
            <div><span className="font-semibold">Tekanan Darah:</span> {triage.tekanan_darah || '-'} mmHg</div>
            <div><span className="font-semibold">Suhu:</span> {triage.suhu || '-'} °C</div>
            <div><span className="font-semibold">Nadi:</span> {triage.nadi || '-'} x/mnt</div>
            <div><span className="font-semibold">Pernapasan:</span> {triage.pernapasan || '-'} x/mnt</div>
            <div><span className="font-semibold">Berat Badan:</span> {triage.berat_badan || '-'} kg</div>
            <div><span className="font-semibold">Tinggi Badan:</span> {triage.tinggi_badan || '-'} cm</div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-700 border-t pt-4 border-blue-100">
            <p><span className="font-semibold">Keluhan Utama:</span> {triage.keluhan_utama || '-'}</p>
            <p><span className="font-semibold">Riwayat Penyakit:</span> {triage.riwayat_penyakit || '-'}</p>
            <p><span className="font-semibold">Catatan Perawat:</span> {triage.catatan_perawat || '-'}</p>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card title="Rekam Medis (SOAP)">
          <div className="space-y-4">
            <div>
              <TextArea label="Anamnesis (S)" {...register('anamnesis')} rows={4} />
              {errors.anamnesis && <p className="text-red-500 text-xs mt-1">{errors.anamnesis.message}</p>}
            </div>

            <div>
              <TextArea label="Pemeriksaan Fisik (O)" {...register('pemeriksaan_fisik')} rows={4} />
              {errors.pemeriksaan_fisik && <p className="text-red-500 text-xs mt-1">{errors.pemeriksaan_fisik.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Diagnosis Utama (A)" {...register('diagnosis')} error={errors.diagnosis?.message} />
              <Input label="Kode ICD-10 (Opsional)" {...register('icd_10')} />
            </div>
            
            <TextArea label="Tindakan / Rencana (P)" {...register('tindakan')} rows={3} />
          </div>
        </Card>

        <Card title="E-Resep">
          <div className="space-y-4">
            {prescriptions.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs text-slate-500 mb-1">Obat</label>
                  <Select
                    options={medicineOptions}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    maxMenuHeight={250}
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    onChange={(val) => {
                      const newP = [...prescriptions];
                      newP[index].medicine = val;
                      setPrescriptions(newP);
                    }}
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Input type="number" label="Jumlah" value={item.jumlah} onChange={e => {
                    const newP = [...prescriptions];
                    newP[index].jumlah = e.target.value;
                    setPrescriptions(newP);
                  }} />
                </div>
                <div className="col-span-8 md:col-span-2">
                  <Input placeholder="3x1" label="Dosis" value={item.dosis} onChange={e => {
                    const newP = [...prescriptions];
                    newP[index].dosis = e.target.value;
                    setPrescriptions(newP);
                  }} />
                </div>
                <div className="col-span-10 md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Aturan Makan</label>
                  <Select
                    options={[
                      { value: 'Sebelum Makan', label: 'Sebelum Makan' },
                      { value: 'Sesudah Makan', label: 'Sesudah Makan' },
                      
                    ]}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                    placeholder="Pilih..."
                    onChange={(val) => {
                      const newP = [...prescriptions];
                      newP[index].aturan_pakai = val ? val.value : '';
                      setPrescriptions(newP);
                    }}
                  />
                </div>
                <div className="col-span-2 md:col-span-1 pb-1">
                  <Button type="button" variant="danger" size="sm" onClick={() => {
                    setPrescriptions(prescriptions.filter((_, i) => i !== index));
                  }}>X</Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPrescriptionItem}>
              + Tambah Obat
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="primary" isLoading={createMedicalRecord.isPending}>
            Simpan & Selesai
          </Button>
        </div>
      </form>
    </div>
  );
}
