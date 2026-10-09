<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\TriageController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TariffController;
use App\Http\Controllers\Api\PharmacyController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;

use App\Http\Controllers\Api\PaymentController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/midtrans/webhook', [PaymentController::class, 'webhook']);

// Public routes for Patient Portal
Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::get('/queues', [QueueController::class, 'index']);
Route::get('/queues/today', [QueueController::class, 'todayQueues']);
Route::post('/queues', [QueueController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Patients (Rest of the resource)
    Route::apiResource('patients', PatientController::class)->except(['index', 'store']);

    // Queues
    Route::get('/queues/current', [QueueController::class, 'currentQueue']);
    Route::put('/queues/{id}/status', [QueueController::class, 'updateStatus']);
    Route::apiResource('queues', QueueController::class)->except(['index', 'store']);

    // Triage
    Route::get('/triages/queue/{queueId}', [TriageController::class, 'getByQueue']);
    Route::apiResource('triages', TriageController::class)->only(['store', 'show']);

    // Medical Records
    Route::get('/medical-records/patient/{patientId}', [MedicalRecordController::class, 'getByPatient']);
    Route::get('/medical-records/queue/{queueId}', [MedicalRecordController::class, 'getByQueue']);
    Route::apiResource('medical-records', MedicalRecordController::class)->only(['store', 'show']);

    // Prescriptions
    Route::get('/prescriptions/pending', [PrescriptionController::class, 'getPending']);
    Route::put('/prescriptions/{id}/status', [PrescriptionController::class, 'updateStatus']);
    Route::get('/prescriptions/record/{recordId}', [PrescriptionController::class, 'getByMedicalRecord']);
    Route::apiResource('prescriptions', PrescriptionController::class)->only(['store', 'show']);

    // Medicines
    Route::get('/medicines/low-stock', [MedicineController::class, 'lowStock']);
    Route::apiResource('medicines', MedicineController::class);

    // Transactions & Payments
    Route::get('/transactions/queue/{queueId}', [TransactionController::class, 'getByQueue']);
    Route::post('/payments/qris/{transaction_id}', [PaymentController::class, 'createQris']);
    Route::get('/payments/qris/{transaction_id}/status', [PaymentController::class, 'checkStatus']);
    Route::put('/transactions/{id}/payment-status', [TransactionController::class, 'updatePaymentStatus']);
    Route::apiResource('transactions', TransactionController::class)->only(['index', 'store', 'show']);

    // Tariffs
    Route::apiResource('tariffs', TariffController::class);

    // Pharmacy
    Route::get('/pharmacy/pending', [PharmacyController::class, 'pendingPrescriptions']);
    Route::put('/pharmacy/{id}/process', [PharmacyController::class, 'processPrescription']);
    Route::put('/pharmacy/{id}/complete', [PharmacyController::class, 'completePrescription']);
    Route::get('/pharmacy/history', [PharmacyController::class, 'prescriptionHistory']);
    Route::put('/pharmacy/{id}/cancel', [PharmacyController::class, 'cancelPrescription']);

    // Reports
    Route::get('/reports/dashboard', [ReportController::class, 'dashboardData']);
    Route::get('/reports/daily', [ReportController::class, 'dailySummary']);
    Route::get('/reports/monthly', [ReportController::class, 'monthlySummary']);
    Route::get('/reports/export', [ReportController::class, 'exportExcel']);

    // Users
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::apiResource('users', UserController::class);
});
