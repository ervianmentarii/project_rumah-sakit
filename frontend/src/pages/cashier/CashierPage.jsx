import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import InvoicePrint from './InvoicePrint';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import ReactSelect from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function CashierPage() {
  const [paymentMethod, setPaymentMethod] = useState('tunai');
  const [transaction, setTransaction] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  const printRef = useRef();
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const { data: pendingTransactionsResponse, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', 'pending'],
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params: { status_pembayaran: 'belum_bayar', per_page: -1 } });
      return data;
    }
  });

  const pendingTransactions = Array.isArray(pendingTransactionsResponse) ? pendingTransactionsResponse : (pendingTransactionsResponse?.data || []);

  const transactionOptions = pendingTransactions.map(trx => ({
    value: trx,
    label: `${trx.kode_transaksi} - ${trx.patient?.nama}`
  }));

  const handleSelect = (opt) => {
    if (!opt) {
      setTransaction(null);
      return;
    }
    const trx = opt.value;
    setTransaction({
      id: trx.id,
      kode_transaksi: trx.kode_transaksi,
      patientName: trx.patient?.nama || 'Unknown',
      date: new Date(trx.created_at).toLocaleDateString('id-ID'),
      items: trx.items?.map(i => ({ name: i.deskripsi, qty: i.jumlah, price: i.harga_satuan, total: i.subtotal })) || [],
      total: trx.total_keseluruhan,
      status: trx.status_pembayaran,
      snap_token: trx.snap_token
    });
  };

  const queryClient = useQueryClient();

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await api.put(`/transactions/${transaction.id}/payment-status`, { 
        status_pembayaran: 'lunas',
        metode_pembayaran: paymentMethod
      });
      setTransaction({ ...transaction, status: 'lunas', metode_pembayaran: paymentMethod });
      toast.success('Pembayaran berhasil dikonfirmasi');
      queryClient.invalidateQueries({ queryKey: ['transactions', 'pending'] });
    } catch (error) {
      toast.error('Gagal memproses pembayaran');
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    let interval;
    if (transaction && paymentMethod === 'qris' && transaction.snap_token && transaction.status !== 'lunas') {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/payments/qris/${transaction.id}/status`);
          if (res.data.status === 'lunas') {
            setTransaction(prev => ({ ...prev, status: 'lunas', metode_pembayaran: 'qris' }));
            toast.success('Pembayaran QRIS otomatis Lunas!');
            queryClient.invalidateQueries({ queryKey: ['transactions', 'pending'] });
          }
        } catch (e) {
          console.error('Error polling QRIS status:', e);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transaction, paymentMethod, queryClient]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Kasir & Pembayaran</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card title="Pilih Pasien / Tagihan">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Cari Tagihan Belum Lunas</label>
              <ReactSelect
                options={transactionOptions}
                isLoading={isLoadingTransactions}
                placeholder="Ketik nama atau Kode TRX..."
                onChange={handleSelect}
                isClearable
                isSearchable
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </Card>

          {transaction && (transaction.status === 'pending' || transaction.status === 'belum_bayar') && (
            <Card title="Proses Pembayaran">
              <div className="space-y-4">
                <Select 
                  label="Metode Pembayaran"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={[
                    { value: 'tunai', label: 'Tunai' },
                    { value: 'qris', label: 'QRIS' }
                  ]}
                />
                
                {paymentMethod === 'qris' && (
                  <div className="flex flex-col items-center p-4 bg-slate-50 border rounded-lg">
                    <p className="text-sm font-semibold mb-2 text-slate-600">Scan QRIS (Midtrans Sandbox)</p>
                    {!transaction.snap_token ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={async () => {
                          try {
                            const res = await api.post(`/payments/qris/${transaction.id}`);
                            setTransaction({ ...transaction, snap_token: res.data.snap_token });
                            toast.success('QRIS berhasil dibuat!');
                          } catch(e) {
                            toast.error(e.response?.data?.error || 'Gagal memuat QRIS');
                          }
                        }}
                      >
                        Generate QRIS
                      </Button>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <QRCodeSVG value={`https://app.sandbox.midtrans.com/snap/v3/redirection/${transaction.snap_token}`} size={200} />
                        <span className="text-xs text-slate-500 break-all text-center px-4">
                          Scan atau akses:<br/>
                          <a href={`https://app.sandbox.midtrans.com/snap/v3/redirection/${transaction.snap_token}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            Link Pembayaran Midtrans
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {paymentMethod === 'qris' ? (
                  transaction.snap_token && (
                    <div className="mt-4 p-4 text-center bg-blue-50 text-blue-700 rounded-lg animate-pulse font-medium border border-blue-100">
                      Menunggu pembayaran via QRIS... <br/>
                      <span className="text-sm font-normal">(Sistem akan mengkonfirmasi otomatis jika berhasil)</span>
                    </div>
                  )
                ) : (
                  <Button variant="success" className="w-full mt-4" onClick={handlePayment} disabled={isPaying}>
                    {isPaying ? 'Memproses...' : 'Konfirmasi Lunas (Tunai)'}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          {transaction ? (
            <Card title={`Rincian Tagihan - ${transaction.patientName}`}>
              <div className="space-y-4">
                <Table 
                  columns={[
                    { header: 'Item', accessor: 'name' },
                    { header: 'Qty', accessor: 'qty' },
                    { header: 'Harga', render: (row) => `Rp ${row.price.toLocaleString()}` },
                    { header: 'Total', render: (row) => `Rp ${row.total.toLocaleString()}` }
                  ]}
                  data={transaction.items}
                />
                
                <div className="flex justify-end text-xl font-bold text-slate-800 p-4 border-t">
                  Total Bayar: Rp {transaction.total.toLocaleString()}
                </div>

                {transaction.status === 'lunas' && (
                  <div className="flex justify-end pt-4 gap-4">
                    <div className="hidden">
                      <InvoicePrint ref={printRef} data={transaction} />
                    </div>
                    <Button variant="outline" onClick={handlePrint}>Cetak Invoice</Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-8 text-center text-slate-500">
                Silakan cari pasien untuk menampilkan rincian tagihan.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
