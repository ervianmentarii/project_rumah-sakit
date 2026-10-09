import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const InvoicePrint = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="p-8 max-w-2xl bg-white text-black font-sans mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">KLINIK KU</h1>
        <p className="text-sm">Jl. Kesehatan No. 123, Kota</p>
        <p className="text-sm border-b pb-4 mb-4">Telp: 08123456789</p>
        <h2 className="text-xl font-bold uppercase tracking-wider">INVOICE</h2>
      </div>

      <div className="flex justify-between mb-6 text-sm">
        <div>
          <p><strong>No Invoice:</strong> {data.id}</p>
          <p><strong>Tanggal:</strong> {data.date}</p>
        </div>
        <div className="text-right">
          <p><strong>Pasien:</strong> {data.patientName}</p>
          <p><strong>Status:</strong> {data.status.toUpperCase()}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-6 border-t border-b">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Deskripsi</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Harga</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-center">{item.qty}</td>
              <td className="py-2 text-right">Rp {item.price.toLocaleString()}</td>
              <td className="py-2 text-right">Rp {item.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end text-lg font-bold mb-6">
        <p>Total: Rp {data.total.toLocaleString()}</p>
      </div>
      
      {data.metode_pembayaran === 'qris' && (
        <div className="flex flex-col items-center justify-center mb-6 border-2 border-dashed p-4 rounded-lg">
          <p className="font-bold mb-2">Scan QRIS untuk Pembayaran</p>
          <QRCodeSVG value={`https://qris.example.com/pay/${data.id}`} size={128} />
        </div>
      )}

      <div className="text-center text-xs text-gray-500 mt-8 border-t pt-4">
        <p>Terima kasih atas kunjungan Anda.</p>
        <p>Semoga lekas sembuh.</p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';
export default InvoicePrint;
