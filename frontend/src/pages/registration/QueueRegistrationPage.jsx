import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import QueueTicketPrint from './QueueTicketPrint';
import { useQueues } from '../../hooks/useQueues';
import { usePatients } from '../../hooks/usePatients';
import toast from 'react-hot-toast';

import ReactSelect from 'react-select';

export default function QueueRegistrationPage() {
  const [selectedPoli, setSelectedPoli] = useState('');
  const [patientId, setPatientId] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const printRef = useRef();
  
  const { createQueue } = useQueues();
  // Pass per_page: -1 to backend to bypass pagination and fetch all patients
  const { data: patientsResponse, isLoading: isLoadingPatients } = usePatients({ per_page: -1 });
  
  // Ambil list pasien dari array response
  const patientsList = Array.isArray(patientsResponse) ? patientsResponse : (patientsResponse?.data || []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleCreateQueue = (e) => {
    e.preventDefault();
    if (!selectedPoli || !patientId) {
      toast.error('Pilih pasien dan poliklinik');
      return;
    }
    
    // Temukan nama pasien untuk keperluan cetak struk nanti
    const selectedPatient = patientsList.find(p => p.id === parseInt(patientId));
    
    createQueue.mutate({
      patient_id: patientId,
      poli: selectedPoli,
      tanggal: new Date().toISOString().split('T')[0] // format YYYY-MM-DD
    }, {
      onSuccess: (responseData) => {
        // responseData is the newly created queue from backend
        setTicketData({
          queueNumber: responseData.no_antrian || responseData.data?.no_antrian,
          patientName: selectedPatient?.nama,
          poli: selectedPoli,
          date: new Date().toLocaleDateString('id-ID')
        });
      }
    });
  };

  const patientOptions = patientsList.map(p => ({
    value: p.id,
    label: `${p.no_rm} - ${p.nama} (${p.nik})`
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Pendaftaran Antrean Baru</h1>
      
      <Card>
        <form onSubmit={handleCreateQueue} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Pilih Pasien</label>
            <ReactSelect
              options={patientOptions}
              isLoading={isLoadingPatients}
              placeholder={isLoadingPatients ? "Memuat Data Pasien..." : "Cari Nama / NIK Pasien..."}
              onChange={(selectedOption) => setPatientId(selectedOption ? selectedOption.value : '')}
              isClearable
              isSearchable
              noOptionsMessage={() => "Pasien tidak ditemukan"} menuPortalTarget={document.body} menuPosition="fixed" styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
          <Select 
            label="Poliklinik"
            value={selectedPoli}
            onChange={(e) => setSelectedPoli(e.target.value)}
            options={[
              { value: 'Poli Umum', label: 'Poli Umum' },
              { value: 'Poli Gigi', label: 'Poli Gigi' },
              { value: 'Poli Anak', label: 'Poli Anak' },
              { value: 'Poli Mata', label: 'Poli Mata' }, { value: 'Poli Kandungan', label: 'Poli Kandungan' }
            ]}
            required
          />
          <Button type="submit" variant="primary" isLoading={createQueue.isPending}>Buat Antrean</Button>
        </form>
      </Card>

      {ticketData && (
        <Card title="Tiket Antrean">
          <div className="flex flex-col items-center">
            <div className="border p-4 bg-white mb-4">
              <QueueTicketPrint ref={printRef} data={ticketData} />
            </div>
            <Button onClick={handlePrint} variant="success">Cetak Tiket</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
