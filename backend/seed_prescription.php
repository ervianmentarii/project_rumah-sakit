<?php
$rm = App\Models\MedicalRecord::first();
if ($rm) {
    $p = App\Models\Prescription::create([
        'medical_record_id' => $rm->id,
        'patient_id' => $rm->patient_id,
        'doctor_id' => $rm->doctor_id,
        'status' => 'pending'
    ]);
    $m = App\Models\Medicine::first();
    if ($m) {
        $p->items()->create([
            'medicine_id' => $m->id,
            'jumlah' => 1,
            'dosis' => '3x1',
            'aturan_pakai' => 'Sesudah makan'
        ]);
        echo "Seeded 1 pending prescription.\n";
    }
}
