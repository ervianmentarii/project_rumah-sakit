import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientSchema } from '../../lib/validations';
import { usePatients } from '../../hooks/usePatients';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function PatientRegistrationPage() {
  const { createPatient } = usePatients();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(patientSchema)
  });

  const onSubmit = (data) => {
    createPatient.mutate(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Registrasi Pasien Baru</h1>
        <Link to="/queues/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          Buat Antrean Pasien →
        </Link>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="NIK" {...register('nik')} error={errors.nik?.message} />
            <Input label="Nama Lengkap" {...register('nama')} error={errors.nama?.message} />
            
            <Input type="date" label="Tanggal Lahir" {...register('tanggal_lahir')} error={errors.tanggal_lahir?.message} />
            <Select 
              label="Jenis Kelamin" 
              {...register('jenis_kelamin')} 
              error={errors.jenis_kelamin?.message}
              options={[{ value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' }]}
            />
            
            <Input label="No. Telepon" {...register('no_telepon')} error={errors.no_telepon?.message} />
            <Select 
              label="Golongan Darah" 
              {...register('golongan_darah')} 
              error={errors.golongan_darah?.message}
              options={['A', 'B', 'AB', 'O'].map(v => ({ value: v, label: v }))}
            />
          </div>

          <Input label="Alergi (Opsional)" {...register('alergi')} error={errors.alergi?.message} />
          <TextArea label="Alamat" {...register('alamat')} error={errors.alamat?.message} />

          <div className="flex justify-end">
            <Button type="submit" isLoading={createPatient.isPending}>
              Simpan Pasien
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
