import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const cekAntrianSchema = z.object({
  no_rm: z.string().min(1, 'Nomor Rekam Medis wajib diisi'),
});

const daftarSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  alamat: z.string().min(5, 'Alamat minimal 5 karakter'),
  no_telepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  golongan_darah: z.string().optional(),
  alergi: z.string().optional(),
  poli: z.string().min(1, 'Pilih poli tujuan'),
});

export default function PatientLoginPage() {
  const [activeTab, setActiveTab] = useState('cek'); // 'cek' | 'daftar'
  const [antrianResult, setAntrianResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Cek Antrian Form
  const cekForm = useForm({ resolver: zodResolver(cekAntrianSchema) });

  // Daftar Pasien Form
  const daftarForm = useForm({ resolver: zodResolver(daftarSchema) });

  const onCekAntrian = async (data) => {
    setIsSearching(true);
    setAntrianResult(null);
    try {
      const response = await api.get(`/patients?search=${data.no_rm}`);
      const patients = response.data?.data || response.data;
      if (patients && patients.length > 0) {
        const patient = patients[0];
        // Get today's queue for this patient using flat array api
        const queueRes = await api.get(`/queues`, { params: { per_page: -1 } });
        const queues = queueRes.data?.data || queueRes.data || [];
        
        // Filter queues for today only (using local timezone)
        const today = new Date();
        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        
        const myQueue = queues.find((q) => {
          if (q.patient_id !== patient.id) return false;
          // ensure the date matches today in local timezone
          const qDateObj = new Date(q.tanggal);
          const qDate = qDateObj.getFullYear() + '-' + String(qDateObj.getMonth() + 1).padStart(2, '0') + '-' + String(qDateObj.getDate()).padStart(2, '0');
          return qDate === todayStr;
        });
        
        setAntrianResult({
          patient,
          queue: myQueue || null,
        });
        if (myQueue) {
          toast.success('Data antrian ditemukan!');
        } else {
          toast('Pasien ditemukan, belum ada antrian hari ini.', { icon: 'ℹ️' });
        }
      } else {
        toast.error('Data pasien tidak ditemukan');
        setAntrianResult(null);
      }
    } catch (error) {
      toast.error('Gagal mencari data. Pastikan server aktif.');
    } finally {
      setIsSearching(false);
    }
  };

  const onDaftar = async (data) => {
    try {
      const { poli, ...patientData } = data;
      // Step 1: Register patient
      const patientRes = await api.post('/patients', patientData);
      const patient = patientRes.data?.data || patientRes.data;

      // Step 2: Create queue
      const today = new Date();
      const localDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      
      const queueRes = await api.post('/queues', {
        patient_id: patient.id,
        poli: poli,
        tanggal: localDate
      });
      const queue = queueRes.data?.data || queueRes.data;

      setAntrianResult({ patient, queue });
      setActiveTab('cek');
      toast.success('Pendaftaran berhasil! Nomor antrian Anda sudah tersedia.');
      daftarForm.reset();
    } catch (error) {
      const msg = error.response?.data?.message || 'Pendaftaran gagal';
      toast.error(msg);
    }
  };

  const statusColor = {
    menunggu: 'bg-yellow-100 text-yellow-800',
    triase: 'bg-blue-100 text-blue-800',
    periksa: 'bg-purple-100 text-purple-800',
    selesai: 'bg-green-100 text-green-800',
    batal: 'bg-red-100 text-red-800',
  };

  const statusLabel = {
    menunggu: 'Menunggu Dipanggil',
    triase: 'Sedang Triase',
    periksa: 'Sedang Diperiksa Dokter',
    selesai: 'Selesai',
    batal: 'Dibatalkan',
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-800 via-purple-700 to-fuchsia-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">RSIA Halim</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">Portal Pasien</h2>
          <p className="text-purple-100 text-lg leading-relaxed">
            Cek antrian Anda atau daftar sebagai pasien baru untuk mendapatkan pelayanan kesehatan terbaik.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: '📋', text: 'Cek status antrian real-time' },
              { icon: '📱', text: 'Daftar online tanpa antre di klinik' },
              { icon: '🔔', text: 'Dapat nomor antrian langsung' },
              { icon: '📊', text: 'Lihat riwayat kunjungan' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-purple-100">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-purple-200 text-sm">
          &copy; 2024 RSIA Halim — Portal Pasien
        </div>
      </div>

      {/* Right - Content */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-3 justify-center">
              <span className="text-xl font-bold text-slate-800">RSIA Halim</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            {/* Tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setActiveTab('cek')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'cek'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ✅ Cek Antrian
              </button>
              <button
                onClick={() => setActiveTab('daftar')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'daftar'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                📝 Daftar Baru
              </button>
            </div>

            {/* Tab: Cek Antrian */}
            {activeTab === 'cek' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Cek Antrian Anda</h2>
                  <p className="mt-1 text-sm text-slate-500">Masukkan No. Rekam Medis atau NIK Anda</p>
                </div>

                <form onSubmit={cekForm.handleSubmit(onCekAntrian)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      No. Rekam Medis / NIK
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        {...cekForm.register('no_rm')}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Contoh: RM-20241008-0001 atau NIK"
                      />
                    </div>
                    {cekForm.formState.errors.no_rm && (
                      <p className="text-red-500 text-xs mt-1.5">{cekForm.formState.errors.no_rm.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-70 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Mencari...
                      </>
                    ) : (
                      'Cek Antrian'
                    )}
                  </button>
                </form>

                {/* Result Card */}
                {antrianResult && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-center mb-3">
                      <p className="text-sm text-slate-500">Pasien</p>
                      <p className="font-bold text-slate-900 text-lg">{antrianResult.patient.nama}</p>
                      <p className="text-xs text-slate-400">No. RM: {antrianResult.patient.no_rm}</p>
                    </div>

                    {antrianResult.queue ? (
                      <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                        <p className="text-sm text-slate-500 mb-1">Nomor Antrian Anda</p>
                        <p className="text-5xl font-bold text-purple-600 mb-2">{antrianResult.queue.no_antrian}</p>
                        <p className="text-sm text-slate-600 mb-3">Poli: <span className="font-medium">{antrianResult.queue.poli}</span></p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor[antrianResult.queue.status] || 'bg-gray-100 text-gray-800'}`}>
                          {statusLabel[antrianResult.queue.status] || antrianResult.queue.status}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                        <p className="text-sm text-slate-500">Belum ada antrian hari ini</p>
                        <button
                          onClick={() => setActiveTab('daftar')}
                          className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Daftar antrian sekarang →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Daftar Baru */}
            {activeTab === 'daftar' && (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Pendaftaran Pasien Baru</h2>
                  <p className="mt-1 text-sm text-slate-500">Isi data diri untuk mendaftar dan mendapat antrian</p>
                </div>

                <form onSubmit={daftarForm.handleSubmit(onDaftar)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK (KTP)</label>
                    <input
                      {...daftarForm.register('nik')}
                      className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="16 digit NIK"
                      maxLength={16}
                    />
                    {daftarForm.formState.errors.nik && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.nik.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      {...daftarForm.register('nama')}
                      className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Nama sesuai KTP"
                    />
                    {daftarForm.formState.errors.nama && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.nama.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                      <input
                        type="date"
                        {...daftarForm.register('tanggal_lahir')}
                        className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      {daftarForm.formState.errors.tanggal_lahir && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.tanggal_lahir.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                      <select
                        {...daftarForm.register('jenis_kelamin')}
                        className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      >
                        <option value="">Pilih</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                      {daftarForm.formState.errors.jenis_kelamin && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.jenis_kelamin.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                    <textarea
                      {...daftarForm.register('alamat')}
                      rows={2}
                      className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Alamat lengkap"
                    />
                    {daftarForm.formState.errors.alamat && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.alamat.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                      <input
                        {...daftarForm.register('no_telepon')}
                        className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="08xxxxxxxxxx"
                      />
                      {daftarForm.formState.errors.no_telepon && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.no_telepon.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Gol. Darah</label>
                      <select
                        {...daftarForm.register('golongan_darah')}
                        className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                      >
                        <option value="">-</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alergi (opsional)</label>
                    <input
                      {...daftarForm.register('alergi')}
                      className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Contoh: Penisilin, Seafood"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Poli Tujuan</label>
                    <select
                      {...daftarForm.register('poli')}
                      className="block w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    >
                      <option value="">Pilih Poli</option>
                      <option value="Poli Umum">Poli Umum</option>
                      <option value="Poli Anak">Poli Anak</option>
                      <option value="Poli Gigi">Poli Gigi</option>
                      <option value="Poli Mata">Poli Mata</option>
                    </select>
                    {daftarForm.formState.errors.poli && <p className="text-red-500 text-xs mt-1">{daftarForm.formState.errors.poli.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={daftarForm.formState.isSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-70 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                  >
                    {daftarForm.formState.isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Mendaftar...
                      </>
                    ) : (
                      '📋 Daftar & Ambil Antrian'
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/login/staff" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Staff klinik? Login di sini →
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
