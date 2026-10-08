import React from 'react';
import PengawasDashboardPage from '../../app/dashboard/pengawas/page';
import DinasDashboardPage from '../../app/dashboard/dinas/page';
import {
  UserRole,
  RiskLevel,
  DocumentStatus,
  ClinicStatus,
} from '../types';
import {
  MOCK_USERS,
  MOCK_SCHOOLS,
  MOCK_HEATMAP_DATA,
  MOCK_DOCUMENTS,
  MOCK_OBSERVATIONS,
  MOCK_CLINIC_BOOKINGS,
  MOCK_RAPOR_PENDIDIKAN,
} from '../data/mockData';
import {
  Shield,
  School,
  FileText,
  Calendar,
  AlertTriangle,
  Award,
  Video,
  CheckCircle,
  FileCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface RoleDashboardProps {
  currentRole: UserRole;
  onNavigateTab: (tabId: string) => void;
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  currentRole,
  onNavigateTab,
}) => {
  const user = MOCK_USERS[currentRole];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl || ''}
              alt={user.name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {currentRole.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">TP 2024/2025 Ganjil</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Selamat Datang, {user.name}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                NIP: {user.nip || 'Non-PNS Terdaftar'} • Akses Terautentikasi SiWasPro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('api-explorer')}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <span>⚡ Uji Backend API</span>
            </button>
            <button
              onClick={() => onNavigateTab('prisma-schema')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              Cek Skema DB
            </button>
            <button
              onClick={() => onNavigateTab('documents')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            >
              Lihat Dokumen
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Content */}
      {currentRole === UserRole.PENGAWAS && (
        <PengawasDashboardPage />
      )}

      {currentRole === UserRole.KEPALA_SEKOLAH && (
        <KepalaSekolahDashboardView onNavigateTab={onNavigateTab} />
      )}

      {currentRole === UserRole.GURU && (
        <GuruDashboardView onNavigateTab={onNavigateTab} />
      )}

      {currentRole === UserRole.DINAS_PENDIDIKAN && (
        <DinasDashboardPage />
      )}

      {currentRole === UserRole.SUPER_ADMIN && (
        <AdminDashboardView onNavigateTab={onNavigateTab} />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 1. Pengawas View                                                           */
/* -------------------------------------------------------------------------- */
const PengawasDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sekolah Binaan</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <School className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">4 Sekolah</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> 100% Wilayah Jakarta Timur
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Menunggu Telaah</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">2 Dokumen</div>
          <div className="text-[11px] text-slate-400 mt-1">1 Modul Ajar & 1 RKAS BOS</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Jadwal Klinik</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Video className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-2">2 Sesi</div>
          <div className="text-[11px] text-slate-400 mt-1">Klinik KOSP & Supervisi Klinis</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Skor Mutu Rata-rata</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-400 mt-2">91.7%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Kepatuhan Kurikulum Tinggi
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sekolah Binaan Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Daftar Sekolah Binaan Binaan Resmi (SK Dinas)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Tahun 2024/2025</span>
          </div>

          <div className="divide-y divide-slate-800">
            {MOCK_SCHOOLS.map((school) => (
              <div key={school.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">
                      {school.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      NPSN: {school.npsn}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      school.riskLevel === RiskLevel.RENDAH
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : school.riskLevel === RiskLevel.SEDANG
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      Risiko {school.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {school.kecamatan}, {school.kabupatenKota}
                    </span>
                    <span>• Akreditasi {school.accreditation}</span>
                    <span>• {school.teacherCount} Guru</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('observations')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Supervisi
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Agenda & Dokumen Tertunda */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Sesi Klinik Virtual Terdekat
            </h3>

            {MOCK_CLINIC_BOOKINGS.slice(0, 2).map((clinic) => (
              <div key={clinic.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-400">{clinic.clinicType}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{clinic.status}</span>
                </div>
                <div className="font-bold text-slate-200 text-xs line-clamp-1">
                  {clinic.topic}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Pemohon: {clinic.requester.name}</span>
                  <span className="font-mono text-slate-300">09 Okt 13:30</span>
                </div>
                <a
                  href={clinic.meetingJoinUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 text-xs font-semibold w-full transition-colors"
                >
                  <Video className="h-3.5 w-3.5" />
                  Masuk Google Meet
                </a>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              Tugas Telaah Kritis
            </h3>
            <p className="text-xs text-slate-400">
              Modul Ajar Fisika dari Pak Fauzi membutuhkan masukan pengawas terkait diferensiasi konten.
            </p>
            <button
              onClick={() => onNavigateTab('documents')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all"
            >
              Buka Dokumen Modul Ajar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Kepala Sekolah View                                                     */
/* -------------------------------------------------------------------------- */
const KepalaSekolahDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Status KOSP Satuan</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2 flex items-center gap-2">
            Disahkan
            <FileCheck className="h-5 w-5" />
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Versi 2.0 (Pengawas Approved)</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Status RKAS BOS 2025</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">Draf Diajukan</div>
          <div className="text-[11px] text-slate-400 mt-1">Rp 1.450.000.000 teralokasi</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Capaian Literasi Rapor</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-2">88.40</div>
          <div className="text-[11px] text-emerald-400 mt-1">Kategori: Mahir</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Pengawas Pembina</div>
          <div className="text-base font-bold text-white mt-2 truncate">Drs. H. Suryadi, M.Pd.</div>
          <div className="text-[11px] text-slate-400 mt-1">NIP: 197405121998021003</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-cyan-400" />
            Indikator Rapor Pendidikan SMAN 1 Nusantara (2024)
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Kemampuan Literasi</span>
                <span className="font-bold text-cyan-400">88.4 / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '88.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Kemampuan Numerasi</span>
                <span className="font-bold text-emerald-400">81.2 / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '81.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Iklim Kebinekaan</span>
                <span className="font-bold text-purple-400">91.5 / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Kualitas Pembelajaran Guru</span>
                <span className="font-bold text-amber-400">82.0 / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Rekomendasi Prioritas Pembenahan Mutu
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {MOCK_RAPOR_PENDIDIKAN.prioritasRekomendasi.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => onNavigateTab('portal')}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
            >
              💼 Buka Ruang Kerja Kepala Sekolah
            </button>
            <button
              onClick={() => onNavigateTab('virtual-clinic')}
              className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              Konsultasi Pengawas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Guru View                                                               */
/* -------------------------------------------------------------------------- */
const GuruDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  const obs = MOCK_OBSERVATIONS[0];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Hasil Observasi Terakhir</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">
            {obs.finalPredicate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Skor: {obs.totalScore} / {obs.maxPossibleScore} ({obs.percentageScore}%)
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Modul Ajar Diunggah</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">Dalam Telaah</div>
          <div className="text-[11px] text-slate-400 mt-1">Fisika Fase F - Kinematika</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Progress Pelatihan PMM</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-2">42 Aksi Nyata</div>
          <div className="text-[11px] text-emerald-400 mt-1">14 Sertifikat Divalidasi</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            Catatan Resmi & Umpan Balik Pengawas (Drs. H. Suryadi, M.Pd.)
          </h3>
          <span className="text-xs font-mono text-slate-400">03 Oktober 2026</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <p className="font-semibold text-cyan-400 mb-1">Kekuatan Teramati:</p>
          <p className="mb-3">{obs.qualitativeStrengths}</p>

          <p className="font-semibold text-amber-400 mb-1">Rekomendasi Peningkatan:</p>
          <p className="mb-3">{obs.areasForGrowth}</p>

          <p className="font-semibold text-purple-400 mb-1">Kesepakatan Tindak Lanjut:</p>
          <p>{obs.agreedNextSteps}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('portal')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
          >
            💼 Buka Ruang Kerja Portal Guru
          </button>
          <button
            onClick={() => onNavigateTab('observations')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
          >
            Dengarkan Voice Note Supervisi
          </button>
          <button
            onClick={() => onNavigateTab('virtual-clinic')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            Booking Sesi Klinik Pengawas
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Dinas Pendidikan View                                                   */
/* -------------------------------------------------------------------------- */
const DinasDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Aggregates */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Total Satuan Pendidikan</div>
          <div className="text-2xl font-extrabold text-white mt-2">92 SMA/SMK</div>
          <div className="text-[11px] text-slate-400 mt-1">4 Kecamatan Binaan</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Cakupan Supervisi</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">88.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">81 dari 92 Terjadwal</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Kepatuhan KOSP & RKAS</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-2">86.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">Terverifikasi Pengawas</div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-xs text-slate-400 font-medium">Sekolah Butuh Intervensi</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-2">14 Sekolah</div>
          <div className="text-[11px] text-rose-400 mt-1">Kategori Risiko Tinggi</div>
        </div>
      </div>

      {/* Regional Heatmap Data Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">
              Peta Mutu & Risiko Kewilayahan (Regional Heatmap Data)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Jakarta Timur • TP 2024/2025</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_HEATMAP_DATA.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border ${
                item.riskLevel === RiskLevel.RENDAH
                  ? 'border-emerald-800/60 bg-emerald-950/20'
                  : item.riskLevel === RiskLevel.SEDANG
                  ? 'border-amber-800/60 bg-amber-950/20'
                  : 'border-rose-800/60 bg-rose-950/20'
              } space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">
                    Kecamatan {item.kecamatan}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {item.totalSchools} Sekolah ({item.schoolsSupervised} Telah Disupervisi)
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    item.riskLevel === RiskLevel.RENDAH
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.riskLevel === RiskLevel.SEDANG
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  Risiko {item.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-900/80">
                  <div className="text-[10px] text-slate-400">Literasi</div>
                  <div className="font-extrabold text-cyan-400 mt-0.5">{item.averageLiteracyScore}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80">
                  <div className="text-[10px] text-slate-400">Numerasi</div>
                  <div className="font-extrabold text-purple-400 mt-0.5">{item.averageNumeracyScore}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80">
                  <div className="text-[10px] text-slate-400">Kepatuhan</div>
                  <div className="font-extrabold text-emerald-400 mt-0.5">{item.complianceRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Super Admin View                                                        */
/* -------------------------------------------------------------------------- */
const AdminDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({
  onNavigateTab,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <h3 className="text-base font-bold text-white">Status Platform & Database Engine</h3>
      <p className="text-xs text-slate-400">
        Prisma ORM Client siap terhubung ke database PostgreSQL. Skema dan types telah terkompilasi utuh.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => onNavigateTab('prisma-schema')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
        >
          Periksa Schema Prisma
        </button>
        <button
          onClick={() => onNavigateTab('integrations')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
        >
          Periksa Log Integrasi
        </button>
      </div>
    </div>
  );
};
