import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-800">RSIA Halim</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#layanan" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">Layanan</a>
              <a href="#tentang" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">Tentang</a>
              <a href="#kontak" className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">Kontak</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login/pasien"
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Portal Pasien
              </Link>
              <Link
                to="/login/staff"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                Login Staff
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                Sistem Digital Terintegrasi
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                Kesehatan Anda,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500"> Prioritas Kami</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                RSIA Halim menghadirkan pelayanan kesehatan ibu dan anak modern dengan sistem informasi digital. 
                Pendaftaran mudah, antrian real-time, rekam medis elektronik, dan pembayaran cashless.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/login/pasien"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Daftar / Cek Antrian
                </Link>
                <a
                  href="#layanan"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-slate-700 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:text-purple-600 transition-all"
                >
                  Lihat Layanan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-bold text-slate-900">5000+</p>
                  <p className="text-sm text-slate-500">Pasien Terdaftar</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">15+</p>
                  <p className="text-sm text-slate-500">Dokter Spesialis</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">24/7</p>
                  <p className="text-sm text-slate-500">Layanan Online</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Pendaftaran Online</p>
                        <p className="text-sm text-slate-500">Daftar dari rumah, langsung dapat nomor antrian</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-fuchsia-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-fuchsia-100 flex items-center justify-center text-fuchsia-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Pemeriksaan Dokter</p>
                        <p className="text-sm text-slate-500">Rekam medis digital & e-resep otomatis</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Apotek Digital</p>
                        <p className="text-sm text-slate-500">Obat disiapkan otomatis setelah resep terbit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Pembayaran QRIS</p>
                        <p className="text-sm text-slate-500">Scan & bayar, invoice digital instan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section id="layanan" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Layanan Kami</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Didukung teknologi modern untuk pengalaman berobat yang nyaman dan efisien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🩺',
                title: 'Poli Umum',
                desc: 'Pemeriksaan kesehatan umum oleh dokter berpengalaman dengan fasilitas lengkap.',
                color: 'purple',
              },
              {
                icon: '👶',
                title: 'Poli Anak',
                desc: 'Layanan kesehatan anak dengan pendekatan ramah dan menyenangkan.',
                color: 'pink',
              },
              {
                icon: '🦷',
                title: 'Poli Gigi',
                desc: 'Perawatan gigi komprehensif dari pemeriksaan rutin hingga tindakan khusus.',
                color: 'fuchsia',
              },
              {
                icon: '👁️',
                title: 'Poli Mata',
                desc: 'Pemeriksaan mata lengkap dengan peralatan diagnostik modern.',
                color: 'indigo',
              },
              {
                icon: '🔬',
                title: 'Laboratorium',
                desc: 'Pemeriksaan laboratorium cepat dan akurat untuk diagnosis tepat.',
                color: 'violet',
              },
              {
                icon: '💊',
                title: 'Apotek',
                desc: 'Apotek lengkap dengan obat berkualitas dan konsultasi farmasi gratis.',
                color: 'purple',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-100 transition-all group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Berobat */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Alur Berobat Digital</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Proses berobat yang simple dan transparan dari awal hingga selesai
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Daftar Online', desc: 'Daftarkan diri via portal pasien dan dapatkan nomor antrian.', icon: '📱' },
              { step: '2', title: 'Triase & Periksa', desc: 'Perawat mengecek kondisi awal, lalu dokter memeriksa Anda.', icon: '🩺' },
              { step: '3', title: 'Resep & Obat', desc: 'Dokter membuat e-resep, apotek menyiapkan obat otomatis.', icon: '💊' },
              { step: '4', title: 'Bayar & Selesai', desc: 'Bayar tunai atau QRIS, terima invoice digital.', icon: '✅' },
            ].map((item, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                  {item.icon}
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-purple-100 -z-10 hidden lg:block"></div>
                <div className="mt-4">
                  <span className="inline-block px-2 py-0.5 text-xs font-bold text-purple-600 bg-purple-100 rounded-full mb-2">
                    Langkah {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Mulai Perjalanan Kesehatan Anda</h2>
          <p className="mt-4 text-lg text-purple-100">
            Daftar sekarang dan nikmati kemudahan layanan kesehatan digital
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/login/pasien"
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-purple-700 bg-white rounded-xl hover:bg-purple-50 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Portal Pasien
            </Link>
            <Link
              to="/login/staff"
              className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Login Staff
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-lg font-bold text-white">RSIA Halim</span>
              </div>
              <p className="text-sm leading-relaxed">
                Rumah Sakit Ibu dan Anak (RSIA) modern dengan sistem informasi digital terintegrasi 
                untuk pelayanan yang cepat, tepat, dan transparan.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-sm">
                <p>📍 Jl. Kesehatan No. 123, Jakarta</p>
                <p>📞 (021) 1234-5678</p>
                <p>✉️ info@rsiahalim.com</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Jam Operasional</h4>
              <div className="space-y-2 text-sm">
                <p>Senin - Jumat: 08:00 - 21:00</p>
                <p>Sabtu: 08:00 - 17:00</p>
                <p>Minggu & Libur: 09:00 - 14:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 RSIA Halim. Hak cipta dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
