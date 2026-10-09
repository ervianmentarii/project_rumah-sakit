<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Exports\ReportExport;

class ReportController extends Controller
{
    public function dailySummary()
    {
        $today = now()->toDateString();
        
        $patientsCount = Queue::whereDate('tanggal', $today)->count();
        $completedCount = Queue::whereDate('tanggal', $today)->where('status', 'selesai')->count();
        $revenue = Transaction::whereDate('created_at', $today)->where('status_pembayaran', 'lunas')->sum('total_keseluruhan');
        $transactionsCount = Transaction::whereDate('created_at', $today)->where('status_pembayaran', 'lunas')->count();

        return response()->json([
            'patients_count' => $patientsCount,
            'completed_count' => $completedCount,
            'revenue' => (float) $revenue,
            'transactions_count' => $transactionsCount
        ]);
    }

    public function monthlySummary(Request $request)
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $revenue = Transaction::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->where('status_pembayaran', 'lunas')
            ->sum('total_keseluruhan');

        $patientsCount = Queue::whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->count();

        return response()->json([
            'revenue' => (float) $revenue,
            'patients_count' => $patientsCount,
        ]);
    }

    public function dashboardData(Request $request)
    {
        $startDate = $request->start_date ?? now()->subDays(6)->toDateString();
        $endDate = $request->end_date ?? now()->toDateString();

        // 1. Stats
        $patientsCount = Queue::whereBetween('tanggal', [$startDate, $endDate])->count();
        $revenue = Transaction::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('status_pembayaran', 'lunas')->sum('total_keseluruhan');
        $completedPrescriptions = \App\Models\Prescription::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('status', 'selesai')->count();
        $canceledQueues = Queue::whereBetween('tanggal', [$startDate, $endDate])->where('status', 'batal')->count();

        // 2. Line Chart (Revenue per day in range)
        $lineData = Transaction::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('status_pembayaran', 'lunas')
            ->selectRaw('DATE(created_at) as date, SUM(total_keseluruhan) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function($item) {
                return ['name' => date('D', strtotime($item->date)), 'revenue' => (float) $item->revenue];
            });

        // 3. Bar Chart (Patients per poli)
        $barData = Queue::whereBetween('tanggal', [$startDate, $endDate])
            ->selectRaw('poli as name, COUNT(id) as patients')
            ->groupBy('poli')
            ->get();

        // 4. Pie Chart (Payment methods)
        $pieData = Transaction::whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('status_pembayaran', 'lunas')
            ->selectRaw('metode_pembayaran as name, COUNT(id) as value')
            ->groupBy('metode_pembayaran')
            ->get();

        return response()->json([
            'stats' => [
                'revenue' => (float) $revenue,
                'patients_count' => $patientsCount,
                'completed_prescriptions' => $completedPrescriptions,
                'canceled_queues' => $canceledQueues
            ],
            'lineData' => $lineData,
            'barData' => $barData,
            'pieData' => $pieData
        ]);
    }

    public function exportExcel(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $export = new ReportExport($request->start_date, $request->end_date);
        $filePath = $export->export();

        return response()->download($filePath, "Laporan_Klinik_{$request->start_date}_to_{$request->end_date}.xlsx")->deleteFileAfterSend(true);
    }
}
