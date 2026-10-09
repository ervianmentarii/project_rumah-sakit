<?php

namespace App\Exports;

use App\Models\Transaction;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ReportExport
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function export()
    {
        $start = $this->startDate . ' 00:00:00';
        $end = $this->endDate . ' 23:59:59';
        $transactions = Transaction::with('patient')
            ->whereBetween('created_at', [$start, $end])
            ->where('status_pembayaran', 'lunas')
            ->orderBy('created_at', 'asc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Transaksi');

        // Header row
        $headers = [
            'A1' => 'No',
            'B1' => 'Kode Transaksi',
            'C1' => 'Tanggal',
            'D1' => 'Nama Pasien',
            'E1' => 'Biaya Tindakan',
            'F1' => 'Biaya Obat',
            'G1' => 'Total',
            'H1' => 'Metode Pembayaran',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style header
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN],
            ],
        ];
        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Data rows
        $row = 2;
        foreach ($transactions as $index => $transaction) {
            $sheet->setCellValue("A{$row}", $index + 1);
            $sheet->setCellValue("B{$row}", $transaction->kode_transaksi);
            $sheet->setCellValue("C{$row}", $transaction->created_at->format('Y-m-d H:i'));
            $sheet->setCellValue("D{$row}", $transaction->patient->nama ?? '-');
            $sheet->setCellValue("E{$row}", $transaction->total_biaya_tindakan);
            $sheet->setCellValue("F{$row}", $transaction->total_biaya_obat);
            $sheet->setCellValue("G{$row}", $transaction->total_keseluruhan);
            $sheet->setCellValue("H{$row}", ucfirst($transaction->metode_pembayaran));
            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Data borders
        if ($row > 2) {
            $sheet->getStyle('A2:H' . ($row - 1))->applyFromArray([
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
            ]);
        }

        // Summary row
        $sheet->setCellValue("F{$row}", 'GRAND TOTAL:');
        $sheet->setCellValue("G{$row}", $transactions->sum('total_keseluruhan'));
        $sheet->getStyle("F{$row}:G{$row}")->getFont()->setBold(true);

        $fileName = 'laporan_transaksi_' . date('Ymd_His') . '.xlsx';
        $filePath = storage_path('app/public/' . $fileName);

        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return $filePath;
    }
}
