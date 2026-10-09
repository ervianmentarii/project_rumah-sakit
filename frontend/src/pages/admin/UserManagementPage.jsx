import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function UserManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    }
  });

  const createUser = useMutation({
    mutationFn: async (userData) => {
      const { data } = await api.post('/users', userData);
      return data;
    },
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to create user')
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }) => {
      const { data } = await api.put(`/users/${id}`, userData);
      return data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
    onError: () => toast.error('Failed to update user')
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => toast.error('Failed to delete user')
  });

  const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || []);

  useEffect(() => {
    if (editingUser) {
      setValue('name', editingUser.name);
      setValue('email', editingUser.email);
      setValue('role', editingUser.roles?.[0]?.name || editingUser.role || 'user');
    } else {
      reset();
    }
  }, [editingUser, setValue, reset]);

  const openAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      deleteUser.mutate(id);
    }
  };

  const onSubmit = (data) => {
    if (editingUser) {
      // Allow password to be empty during edit (won't update password)
      updateUser.mutate({ id: editingUser.id, ...data });
    } else {
      createUser.mutate(data);
    }
  };

  const columns = [
    { header: 'Nama Lengkap', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Role', 
      render: (row) => {
        const roleName = row.roles && row.roles.length > 0 ? row.roles[0].name : (row.role || 'user');
        const colors = {
          admin: 'red', resepsionis: 'blue', dokter: 'green', 
          perawat: 'purple', kasir: 'yellow', apoteker: 'gray'
        };
        return <Badge variant={colors[roleName] || 'gray'}>{roleName.toUpperCase()}</Badge>;
      }
    },
    { 
      header: 'Aksi', 
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.id)} isLoading={deleteUser.isPending}>Hapus</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
        <Button variant="primary" onClick={openAddModal}>+ Tambah User</Button>
      </div>

      <Card>
        <Table columns={columns} data={users} isLoading={isLoading} />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Edit User" : "Tambah User Baru"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nama Lengkap" {...register('name')} required />
          <Input label="Email" type="email" {...register('email')} required />
          <Input label="Password" type="password" {...register('password')} placeholder={editingUser ? "Kosongkan jika tidak ingin ganti" : ""} required={!editingUser} />
          <Select 
            label="Role" 
            {...register('role')}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'resepsionis', label: 'Resepsionis' },
              { value: 'perawat', label: 'Perawat' },
              { value: 'dokter', label: 'Dokter' },
              { value: 'kasir', label: 'Kasir' },
              { value: 'apoteker', label: 'Apoteker' }
            ]} 
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" type="submit" isLoading={createUser.isPending || updateUser.isPending}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
