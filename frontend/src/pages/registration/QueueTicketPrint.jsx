import React, { forwardRef } from 'react';

const QueueTicketPrint = forwardRef(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="w-[80mm] p-4 text-center font-sans bg-white text-black">
      <h2 className="text-xl font-bold uppercase mb-1">KlinikKu</h2>
      <p className="text-sm border-b pb-2 mb-2 border-black border-dashed">
        Jl. Kesehatan No. 123, Kota
      </p>
      
      <p className="text-sm mt-4">Nomor Antrean</p>
      <h1 className="text-5xl font-bold my-2">{data.queueNumber}</h1>
      <p className="text-lg font-semibold">{data.poli}</p>
      
      <div className="border-t border-black border-dashed mt-4 pt-2 text-left text-sm">
        <p><strong>Pasien:</strong> {data.patientName}</p>
        <p><strong>Tanggal:</strong> {data.date}</p>
      </div>
      
      <p className="text-xs mt-6 text-center italic">
        Mohon tunggu panggilan sesuai nomor antrean.
      </p>
    </div>
  );
});

QueueTicketPrint.displayName = 'QueueTicketPrint';
export default QueueTicketPrint;
