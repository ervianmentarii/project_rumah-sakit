import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const patientSchema = z.object({
  nik: z.string().length(16, 'NIK harus 16 digit'),
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P'], { required_error: 'Pilih jenis kelamin' }),
  alamat: z.string().min(5, 'Alamat terlalu pendek'),
  no_telepon: z.string().min(10, 'No telepon tidak valid'),
  golongan_darah: z.string().optional(),
  alergi: z.string().optional(),
});

export const triageSchema = z.object({
  tekanan_darah: z.string().min(1, 'Wajib diisi'),
  suhu: z.coerce.number().min(30).max(45),
  nadi: z.coerce.number().min(30).max(250),
  pernapasan: z.coerce.number().min(10).max(60),
  berat_badan: z.coerce.number().min(1).max(300),
  tinggi_badan: z.coerce.number().min(10).max(250),
  keluhan_utama: z.string().min(5, 'Minimal 5 karakter'),
  riwayat_penyakit: z.string().optional(),
  catatan_perawat: z.string().optional()
});

export const medicalRecordSchema = z.object({
  anamnesis: z.string().min(5, 'Wajib diisi'),
  pemeriksaan_fisik: z.string().min(5, 'Wajib diisi'),
  diagnosis: z.string().min(2, 'Diagnosis wajib diisi'),
  icd_10: z.string().optional(),
  tindakan: z.string().optional(),
});

export const prescriptionItemSchema = z.object({
  medicine_id: z.number().min(1, 'Pilih obat'),
  jumlah: z.coerce.number().min(1, 'Jumlah minimal 1'),
  dosis: z.string().min(1, 'Dosis wajib diisi'),
  aturan_pakai: z.string().min(1, 'Aturan pakai wajib diisi'),
});

export const prescriptionSchema = z.object({
  items: z.array(prescriptionItemSchema).min(1, 'Minimal satu obat harus diresepkan')
});

export const transactionSchema = z.object({
  payment_method: z.enum(['tunai', 'qris']),
  amount_paid: z.coerce.number().min(0)
});

export const medicineSchema = z.object({
  nama_obat: z.string().min(2, 'Nama wajib diisi'),
  kategori: z.string().min(2, 'Kategori wajib diisi'),
  stok: z.coerce.number().min(0, 'Stok minimal 0'),
  harga: z.coerce.number().min(0, 'Harga tidak valid'),
  satuan: z.string().min(1, 'Satuan wajib diisi')
});

export const userSchema = z.object({
  name: z.string().min(3, 'Nama wajib diisi'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['admin', 'resepsionis', 'perawat', 'dokter', 'kasir', 'apoteker']),
  password: z.string().min(6).optional()
});

export const tariffSchema = z.object({
  nama_layanan: z.string().min(3, 'Nama layanan wajib diisi'),
  kategori: z.enum(['konsultasi', 'tindakan', 'laboratorium', 'lainnya']),
  biaya: z.coerce.number().min(0)
});
