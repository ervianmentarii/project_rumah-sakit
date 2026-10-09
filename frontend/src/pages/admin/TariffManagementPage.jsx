import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function TariffManagementPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTariff, setEditingTariff] = useState(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();

  const { data: tariffsResponse, isLoading } = useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const { data } = await api.get('/tariffs');
      return data;
    }
  });

  const createTariff = useMutation({
    mutationFn: async (tariffData) => {
      const { data } = await api.post('/tariffs', tariffData);
      return data;
    },
    onSuccess: () => {
      toast.success('Layanan berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['tariffs'] });
      setIsModalOpen(false);
    }
  });

  const updateTariff = useMutation({
    mutationFn: async ({ id, ...tariffData }) => {
      const { data } = await api.put(`/tariffs/${id}`, tariffData);
      return data;
    },
    onSuccess: () => {
      toast.success('Layanan berhasil diubah');
      queryClient.invalidateQueries({ queryKey: ['tariffs'] });
      setIsModalOpen(false);
    }
  });

  const deleteTariff = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tariffs/${id}`);
    },
    onSuccess: () => {
      toast.success('Layanan berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['tariffs'] });
    }
  });

  const tariffs = Array.isArray(tariffsResponse) ? tariffsResponse : (tariffsResponse?.data || []);
  const filteredTariffs = tariffs.filter(t => t.nama_tarif.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (editingTariff) {
      setValue('kode_tarif', editingTariff.kode_tarif);
      setValue('nama_tarif', editingTariff.nama_tarif);
      setValue('kategori', editingTariff.kategori);
      setValue('harga', editingTariff.harga);
    } else {
      reset();
    }
  }, [editingTariff, setValue, reset]);

  const openAddModal = () => {
    setEditingTariff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tariff) => {
    setEditingTariff(tariff);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus layanan ini?')) {
      deleteTariff.mutate(id);
    }
  };

  const onSubmit = (formData) => {
    if (editingTariff) {
      updateTariff.mutate({ id: editingTariff.id, ...formData });
    } else {
      createTariff.mutate(formData);
    }
  };

  const columns = [
    { header: 'Kode', accessor: 'kode_tarif' },
    { header: 'Nama Layanan', accessor: 'nama_tarif' },
    { 
      header: 'Kategori', 
      render: (row) => <Badge variant="blue">{row.kategori.toUpperCase()}</Badge>
    },
    { header: 'Biaya', render: (row) => `Rp ${Number(row.harga).toLocaleString()}` },
    { 
      header: 'Aksi', 
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} isLoading={deleteTariff.isPending}>Hapus</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Tarif Layanan</h1>
        <Button variant="primary" onClick={openAddModal}>+ Tambah Layanan</Button>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="max-w-md">
            <SearchInput onSearch={setSearch} placeholder="Cari layanan..." />
          </div>
        </div>
        <Table columns={columns} data={filteredTariffs} isLoading={isLoading} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTariff ? "Edit Layanan" : "Tambah Layanan"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Kode Tarif" {...register('kode_tarif')} required />
          <Input label="Nama Layanan" {...register('nama_tarif')} required />
          <Select 
            label="Kategori" 
            {...register('kategori')}
            options={[
              { value: 'konsultasi', label: 'Konsultasi' },
              { value: 'tindakan', label: 'Tindakan' },
              { value: 'laboratorium', label: 'Laboratorium' },
              { value: 'lainnya', label: 'Lainnya' }
            ]} 
          />
          <Input label="Harga (Rp)" type="number" {...register('harga')} required />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" isLoading={createTariff.isPending || updateTariff.isPending}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
