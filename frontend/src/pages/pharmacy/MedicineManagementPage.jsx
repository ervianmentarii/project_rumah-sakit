import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import { useMedicines } from '../../hooks/useMedicines';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function MedicineManagementPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, createMedicine, updateMedicine, deleteMedicine } = useMedicines({ search });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const medicines = Array.isArray(data) ? data : (data?.data || []);

  useEffect(() => {
    if (editingMedicine) {
      setValue('nama_obat', editingMedicine.nama_obat);
      setValue('kode_obat', editingMedicine.kode_obat);
      setValue('kategori', editingMedicine.kategori);
      setValue('stok', editingMedicine.stok);
      setValue('satuan', editingMedicine.satuan);
      setValue('harga', editingMedicine.harga);
    } else {
      reset();
    }
  }, [editingMedicine, setValue, reset]);

  const openAddModal = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus obat ini?')) {
      deleteMedicine.mutate(id);
    }
  };

  const onSubmit = (formData) => {
    if (editingMedicine) {
      updateMedicine.mutate({ id: editingMedicine.id, ...formData }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createMedicine.mutate(formData, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const columns = [
    { header: 'Kode', accessor: 'kode_obat' },
    { header: 'Nama Obat', accessor: 'nama_obat' },
    { header: 'Kategori', accessor: 'kategori' },
    { 
      header: 'Stok', 
      render: (row) => (
        <Badge variant={row.stok < 20 ? 'red' : 'green'}>
          {row.stok} {row.satuan}
        </Badge>
      )
    },
    { header: 'Harga', render: (row) => `Rp ${Number(row.harga).toLocaleString()}` },
    { 
      header: 'Aksi', 
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} isLoading={deleteMedicine.isPending}>Hapus</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Obat</h1>
        <Button variant="primary" onClick={openAddModal}>+ Tambah Obat</Button>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="max-w-md">
            <SearchInput onSearch={setSearch} placeholder="Cari obat..." />
          </div>
        </div>
        <Table 
          columns={columns} 
          data={medicines} 
          isLoading={isLoading} 
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMedicine ? "Edit Obat" : "Tambah Obat"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Kode Obat" {...register('kode_obat')} required />
          <Input label="Nama Obat" {...register('nama_obat')} required />
          <Input label="Kategori" {...register('kategori')} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Stok" type="number" {...register('stok')} required />
            <Input label="Satuan" placeholder="Misal: Strip, Botol" {...register('satuan')} required />
          </div>
          <Input label="Harga (Rp)" type="number" {...register('harga')} required />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" isLoading={createMedicine.isPending || updateMedicine.isPending}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
