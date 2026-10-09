import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

export default function ReportPage() {
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  
  const [filterQuery, setFilterQuery] = useState({ start: dateRange.start, end: dateRange.end });

  const { data, isLoading } = useQuery({
    queryKey: ['reports-dashboard', filterQuery],
    queryFn: async () => {
      const response = await api.get('/reports/dashboard', { 
        params: { start_date: filterQuery.start, end_date: filterQuery.end } 
      });
      return response.data;
    }
  });

  const handleFilter = () => {
    setFilterQuery({ start: dateRange.start, end: dateRange.end });
  };

  const handleExport = () => {
    // Basic browser download for excel
    const token = localStorage.getItem('token'); // or however auth is handled, better yet open window with query params if cookie auth
    // We can also use blob download
    api.get('/reports/export', { 
      params: { start_date: filterQuery.start, end_date: filterQuery.end },
      responseType: 'blob' 
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_${filterQuery.start}_${filterQuery.end}.xlsx`);
      document.body.appendChild(link);
      link.click();
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const stats = data?.stats || { revenue: 0, patients_count: 0, completed_prescriptions: 0, canceled_queues: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Laporan Klinik</h1>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
          <Input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} />
          <span>-</span>
          <Input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} />
          <Button variant="primary" onClick={handleFilter}>Filter</Button>
          <Button variant="success" onClick={handleExport}>Export Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Pendapatan" value={`Rp ${Number(stats.revenue).toLocaleString()}`} />
        <StatCard title="Total Pasien" value={stats.patients_count} />
        <StatCard title="Resep Selesai" value={stats.completed_prescriptions} />
        <StatCard title="Antrean Batal" value={stats.canceled_queues} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Pendapatan Harian">
          <div className="h-80 w-full">
            {!isLoading && data?.lineData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" name="Pendapatan" dataKey="revenue" stroke="#2563eb" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="Kunjungan per Poli">
          <div className="h-80 w-full">
            {!isLoading && data?.barData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" name="Jumlah Pasien" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card title="Metode Pembayaran">
          <div className="h-80 w-full">
            {!isLoading && data?.pieData && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
