import React, { forwardRef } from 'react';

const MedicineLabelPrint = forwardRef(({ data }, ref) => {
  if (!data || !data.items) return null;

  return (
    <div ref={ref} className="bg-white">
      {data.items.map((item, idx) => (
        <div key={idx} className="w-[60mm] h-[40mm] p-2 border border-black mb-4 flex flex-col justify-between font-sans text-xs break-inside-avoid">
          <div className="text-center font-bold border-b border-black pb-1 mb-1">
            KLINIK KU - LABEL OBAT
          </div>
          <div>
            <p><strong>Pasien:</strong> {data.patientName}</p>
            <p><strong>Tgl:</strong> {new Date().toLocaleDateString('id-ID')}</p>
          </div>
          <div className="flex-1 mt-2 text-center border-t border-b border-black py-1">
            <h2 className="font-bold text-sm">{item.name}</h2>
            <p className="font-semibold">{item.dosage}</p>
          </div>
          <div className="text-center text-[10px] pt-1">
            Semoga Lekas Sembuh
          </div>
        </div>
      ))}
    </div>
  );
});

MedicineLabelPrint.displayName = 'MedicineLabelPrint';
export default MedicineLabelPrint;
