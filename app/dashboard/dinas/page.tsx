'use client';

import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Users,
  School,
  Download,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  FileSpreadsheet,
  MapPin,
  Calendar,
} from 'lucide-react';

interface ProblemTrend {
  id: string;
  category: string;
  problemStatement: string;
  affectedSchoolsCount: number;
  percentage: number;
  severity: 'TINGGI' | 'SEDANG' | 'RENDAH';
  recommendedIntervention: string;
}

interface DistrictMetric {
  kecamatan: string;
  totalSchools: number;
  supervisedCount: number;
  avgLiteracy: number;
  avgNumeracy: number;
  avgClimate: number;
  complianceRate: number;
  riskStatus: 'RENDAH' | 'SEDANG' | 'TINGGI';
}

interface SupervisorWorkload {
  id: string;
  name: string;
  nip: string;
  assignedSchoolsCount: number;
  completedVisits: number;
  pendingVisits: number;
  completionRate: number;
}

export default function DinasDashboardPage() {
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('ALL');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024/2025');

  // Big Data KPI Aggregates
  const stats = {
    totalSchools: 92,
    totalSupervisors: 12,
    supervisedRate: 88.0,
    complianceRate: 86.4,
    highRiskSchools: 14,
    totalStudents: 54200,
    totalTeachers: 3840,
  };

  // Tren Permasalahan Wilayah Terdeteksi (Root Cause Analysis dari Berita Acara Supervisi Pengawas)
  const problemTrends: ProblemTrend[] = [
    {
      id: 'p-1',
      category: 'Asesmen & Pembelajaran',
      problemStatement: 'Kelemahan perumusan asesmen awal diagnostik dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)',
      affectedSchoolsCount: 31,
      percentage: 33.7,
      severity: 'TINGGI',
      recommendedIntervention: 'Bimbingan teknis penyusunan rubrik KKTP berbasis kombel antarsekolah.',
    },
    {
      id: 'p-2',
      category: 'Pembelajaran Berdiferensiasi',
      problemStatement: 'Diferensiasi proses dan produk belum optimal, guru masih dominan menggunakan ceramah klasikal seragam',
      affectedSchoolsCount: 26,
      percentage: 28.3,
      severity: 'TINGGI',
      recommendedIntervention: 'Workshop pemodelan peer-teaching diferensiasi PhET dan media interaktif.',
    },
    {
      id: 'p-3',
      category: 'Tata Kelola Anggaran (RKAS BOS)',
      problemStatement: 'Alokasi belanja RKAS belum terhubung erat dengan prioritas rekomendasi Rapor Pendidikan (Literasi/Numerasi)',
      affectedSchoolsCount: 18,
      percentage: 19.5,
      severity: 'SEDANG',
      recommendedIntervention: 'Klinik virtual penyelarasan ARKAS bersama tim manajemen BOS Dinas.',
    },
    {
      id: 'p-4',
      category: 'Budaya Kolaborasi Guru',
      problemStatement: 'Komunitas Belajar (Kombel) intra-sekolah belum memiliki jadwal blok tetap dan notula berbagi praktik baik',
      affectedSchoolsCount: 11,
      percentage: 12.0,
      severity: 'SEDANG',
      recommendedIntervention: 'Instruksi dinas penetapan jadwal blok Kombel minimal 2 jam per minggu.',
    },
    {
      id: 'p-5',
      category: 'Projek P5 Satuan',
      problemStatement: 'Modul Projek Penguatan Profil Pelajar Pancasila (P5) masih mengadopsi mentah tanpa penyesuaian kearifan lokal',
      affectedSchoolsCount: 6,
      percentage: 6.5,
      severity: 'RENDAH',
      recommendedIntervention: 'Kurasi modul P5 tematik kearifan lokal DKI Jakarta oleh tim Pengawas.',
    },
  ];

  // Data Analitik Kewilayahan per Kecamatan
  const districtMetrics: DistrictMetric[] = [
    {
      kecamatan: 'Pulo Gadung',
      totalSchools: 24,
      supervisedCount: 22,
      avgLiteracy: 84.6,
      avgNumeracy: 78.2,
      avgClimate: 86.4,
      complianceRate: 91.7,
      riskStatus: 'RENDAH',
    },
    {
      kecamatan: 'Duren Sawit',
      totalSchools: 28,
      supervisedCount: 27,
      avgLiteracy: 86.4,
      avgNumeracy: 81.5,
      avgClimate: 88.0,
      complianceRate: 96.4,
      riskStatus: 'RENDAH',
    },
    {
      kecamatan: 'Matraman',
      totalSchools: 18,
      supervisedCount: 15,
      avgLiteracy: 76.2,
      avgNumeracy: 70.8,
      avgClimate: 75.4,
      complianceRate: 83.3,
      riskStatus: 'SEDANG',
    },
    {
      kecamatan: 'Jatinegara',
      totalSchools: 22,
      supervisedCount: 17,
      avgLiteracy: 68.9,
      avgNumeracy: 64.3,
      avgClimate: 70.1,
      complianceRate: 72.7,
      riskStatus: 'TINGGI',
    },
  ];

  // Beban Kerja & Rasio Pengawas Pembina
  const supervisorWorkloads: SupervisorWorkload[] = [
    {
      id: 'spv-1',
      name: 'Drs. H. Suryadi, M.Pd.',
      nip: '197405121998021003',
      assignedSchoolsCount: 6,
      completedVisits: 5,
      pendingVisits: 1,
      completionRate: 83.3,
    },
    {
      id: 'spv-2',
      name: 'Dra. Hj. Nurbaeti, M.M.',
      nip: '196908151994032002',
      assignedSchoolsCount: 8,
      completedVisits: 7,
      pendingVisits: 1,
      completionRate: 87.5,
    },
    {
      id: 'spv-3',
      name: 'Drs. M. Taufik Hidayat, M.Pd.',
      nip: '197111201997021001',
      assignedSchoolsCount: 8,
      completedVisits: 8,
      pendingVisits: 0,
      completionRate: 100.0,
    },
    {
      id: 'spv-4',
      name: 'Dr. Bambang Subagyo, S.Pd., M.Ed.',
      nip: '197602042000031004',
      assignedSchoolsCount: 7,
      completedVisits: 5,
      pendingVisits: 2,
      completionRate: 71.4,
    },
  ];

  const filteredDistricts =
    selectedKecamatan === 'ALL'
      ? districtMetrics
      : districtMetrics.filter((d) => d.kecamatan === selectedKecamatan);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* Top Header Profil Dinas Pendidikan */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-xl shadow-lg shadow-purple-500/10">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                Bidang Pembinaan SMA & SMK
              </span>
              <span className="text-xs text-slate-400">Dinas Pendidikan Provinsi DKI Jakarta</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Drs. Hendra Kusuma, M.M.
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Dashboard Analisis Big Data Mutu, Pengawasan Wilayah & Kebijakan Berbasis Bukti
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono">
            {selectedAcademicYear} Ganjil
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-600/20">
            <Download className="h-4 w-4" />
            <span>Ekspor Rekap Wilayah</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ringkasan Eksekutif */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Satuan Binaan</span>
            <School className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalSchools} <span className="text-xs font-normal text-slate-400">Sekolah</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.totalTeachers} Guru • {stats.totalStudents.toLocaleString()} Siswa
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cakupan Supervisi</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            {stats.supervisedRate}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 81 dari 92 Terjadwal
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kepatuhan KOSP & RKAS</span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-2">
            {stats.complianceRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pengesahan Pengawas Pembina
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Butuh Intervensi Khusus</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-2">
            {stats.highRiskSchools} <span className="text-xs font-normal text-slate-400">Sekolah</span>
          </div>
          <div className="text-[11px] text-rose-400 mt-1">
            Zona Merah Rapor Pendidikan
          </div>
        </div>
      </div>

      {/* Bagian 1: Tren Permasalahan Wilayah (Root Cause Analysis Bar Chart) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h2 className="text-base font-extrabold text-white">
                Analisis Tren Permasalahan Mutu Wilayah (Root Cause Analysis)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Diolah dari agregasi ribuan butir catatan telaah Pengawas Pembina, rubrik observasi kelas, dan evaluasi RKAS se-wilayah.
            </p>
          </div>

          <span className="text-xs text-purple-300 font-mono bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
            Total 92 Satuan Dianalisis
          </span>
        </div>

        {/* Visualisasi Grafik Batang Tren */}
        <div className="space-y-4">
          {problemTrends.map((trend, idx) => (
            <div key={trend.id} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-white">
                    {trend.problemStatement}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      trend.severity === 'TINGGI'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : trend.severity === 'SEDANG'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {trend.severity}
                  </span>
                </div>
                <div className="font-mono text-slate-300 shrink-0">
                  <span className="font-bold text-cyan-400">{trend.affectedSchoolsCount} Sekolah</span> ({trend.percentage}%)
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    trend.severity === 'TINGGI'
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                      : trend.severity === 'SEDANG'
                      ? 'bg-gradient-to-r from-amber-500 to-cyan-500'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                  }`}
                  style={{ width: `${trend.percentage * 2.5}%` }}
                />
              </div>

              {/* Rekomendasi Intervensi Dinas */}
              <div className="text-[11px] text-slate-400 pl-6 flex items-center gap-1.5">
                <span className="text-purple-400 font-semibold">Solusi Kebijakan Dinas:</span>
                <span>{trend.recommendedIntervention}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bagian 2: Matriks Spasial Mutu per Kecamatan & Beban Pengawas (2 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Matriks Mutu per Kecamatan (7 Kolom) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-extrabold text-white">
                Matriks Mutu Satuan per Kecamatan
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedKecamatan}
                onChange={(e) => setSelectedKecamatan(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="ALL">Semua Kecamatan</option>
                <option value="Pulo Gadung">Pulo Gadung</option>
                <option value="Duren Sawit">Duren Sawit</option>
                <option value="Matraman">Matraman</option>
                <option value="Jatinegara">Jatinegara</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Kecamatan</th>
                    <th className="py-3 px-3 text-center">Sekolah</th>
                    <th className="py-3 px-3 text-center">Literasi</th>
                    <th className="py-3 px-3 text-center">Numerasi</th>
                    <th className="py-3 px-3 text-center">Kepatuhan</th>
                    <th className="py-3 px-4 text-center">Status Mutu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredDistricts.map((d) => (
                    <tr key={d.kecamatan} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {d.kecamatan}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {d.supervisedCount} / {d.totalSchools}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-cyan-400 font-bold">
                        {d.avgLiteracy}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-purple-400 font-bold">
                        {d.avgNumeracy}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                        {d.complianceRate}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            d.riskStatus === 'RENDAH'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : d.riskStatus === 'SEDANG'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {d.riskStatus === 'RENDAH'
                            ? 'Optimal'
                            : d.riskStatus === 'SEDANG'
                            ? 'Waspada'
                            : 'Kritis'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Beban Kerja & Rasio Pengawas Pembina (5 Kolom) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-extrabold text-white">
                Beban Kerja & Target Pengawas
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">12 Pengawas Aktif</span>
          </div>

          <div className="space-y-3">
            {supervisorWorkloads.map((spv) => (
              <div
                key={spv.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-2 shadow-md hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xs">
                      {spv.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      NIP: {spv.nip}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {spv.completionRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Binaan: {spv.assignedSchoolsCount} Sekolah</span>
                  <span>
                    Selesai: <strong className="text-white">{spv.completedVisits}</strong> • Sisa:{' '}
                    <strong className="text-amber-400">{spv.pendingVisits}</strong>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${spv.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bagian 3: Rekomendasi Kebijakan Berbasis Bukti (Evidence-Based Policy Memo) */}
      <section className="p-6 rounded-2xl border border-purple-800/40 bg-gradient-to-br from-purple-950/20 via-slate-900 to-slate-950 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" /> Memo Strategis Kepala Dinas Pendidikan
        </div>
        <h3 className="text-base font-extrabold text-white">
          Rekomendasi Kebijakan Berbasis Data Pengawasan (Tahun Anggaran 2025)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400">1. Alokasi BOS Afirmasi Kinerja</span>
            <p className="text-slate-300 leading-relaxed">
              Memprioritaskan 14 sekolah zona merah di Kecamatan Jatinegara & Matraman untuk bantuan sarpras laboratorium sains dan modul numerasi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400">2. Penataan Rasio Pengawas</span>
            <p className="text-slate-300 leading-relaxed">
              Menyetarakan penugasan SK pengawas maksimal 7 sekolah per pengawas pembina agar intensitas coaching 1-on-1 meningkat merata.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400">3. Standardisasi Dokumen ARKAS</span>
            <p className="text-slate-300 leading-relaxed">
              Menerapkan validasi wajib persetujuan Pengawas Pembina dalam sistem SIPD/ARKAS sebelum anggaran BOS dapat dicairkan satuan pendidikan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
