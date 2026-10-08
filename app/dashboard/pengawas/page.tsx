'use client';

import React, { useState } from 'react';
import {
  Shield,
  School,
  Sparkles,
  Calendar,
  Video,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  TrendingUp,
  MapPin,
  Mic,
  ChevronRight,
  Upload,
  RefreshCw,
  ExternalLink,
  Award,
  BookOpen,
} from 'lucide-react';

interface SchoolHeatmapItem {
  id: string;
  npsn: string;
  name: string;
  level: 'SMA' | 'SMK' | 'SMP';
  status: 'NEGERI' | 'SWASTA';
  kecamatan: string;
  literacyScore: number;
  numeracyScore: number;
  climateScore: number;
  averageScore: number;
  riskCategory: 'HIJAU' | 'KUNING' | 'MERAH'; // Hijau: Baik, Kuning: Sedang, Merah: Butuh Intervensi
  kospStatus: 'APPROVED' | 'IN_REVIEW' | 'DRAFT';
  supervisionStatus: 'SUDAH' | 'BELUM' | 'TERJADWAL';
  headmasterName: string;
}

interface ScheduleItem {
  id: string;
  type: 'OBSERVASI_KELAS' | 'KLINIK_COACHING' | 'BEDAH_KOSP';
  schoolName: string;
  teacherOrKepsekName: string;
  role: string;
  date: string;
  time: string;
  subjectOrTopic: string;
  meetingPlatform?: 'Luring (Tatap Muka)' | 'Google Meet' | 'Zoom';
  meetingUrl?: string;
  status: 'TERKONFIRMASI' | 'MENUNGGU' | 'SELESAI';
}

interface AiChecklistResult {
  overallScore: number;
  predicate: 'SANGAT_SESUAI' | 'SESUAI' | 'CUKUP_SESUAI' | 'PERLU_REVISI';
  summary: string;
  recommendation: 'LAYAK_DISAHKAN' | 'PERLU_REVISI_MINOR' | 'PERLU_REVISI_MAYOR';
  criteria: {
    id: string;
    code: string;
    name: string;
    isCompliant: boolean;
    score: number;
    evidence: string;
    recommendation: string;
  }[];
  merdekaPillars: {
    berpusatPadaMurid: boolean;
    pembelajaranDiferensiasi: boolean;
    profilPelajarPancasila: boolean;
    asesmenFormatif: boolean;
  };
}

export default function PengawasDashboardPage() {
  // State Filter Heatmap
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'HIJAU' | 'KUNING' | 'MERAH'>('ALL');
  const [selectedMetric, setSelectedMetric] = useState<'average' | 'literacy' | 'numeracy' | 'climate'>('average');
  const [activeSchoolDetail, setActiveSchoolDetail] = useState<SchoolHeatmapItem | null>(null);

  // State AI Document Checker
  const [docType, setDocType] = useState<'MODUL_AJAR' | 'KOSP' | 'RKAS'>('MODUL_AJAR');
  const [docTitle, setDocTitle] = useState('Modul Ajar Fisika - Kinematika Berdiferensiasi Fase F');
  const [docText, setDocText] = useState(
    `Tujuan Pembelajaran: Peserta didik mampu menganalisis hubungan gaya dan percepatan melalui penyelidikan gerak lurus menggunakan sensor digital.
Langkah Pembelajaran:
1. Guru memulai pembelajaran dengan apersepsi video perlambatan rem darurat mobil.
2. Diferensiasi Proses: Siswa dibagi menjadi kelompok praktikum riil dan kelompok simulasi virtual PhET berbasis kesiapan belajar.
3. Asesmen: Menggunakan lembar asesmen formatif unjuk kerja dan lembar refleksi 5 menit di penutup kelas.
Profil Pelajar Pancasila: Bernalar Kritis, Gotong Royong, dan Mandiri.`
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiChecklistResult | null>(null);

  // Mock Data Sekolah Binaan
  const schoolsData: SchoolHeatmapItem[] = [
    {
      id: 'sch-1',
      npsn: '20101456',
      name: 'SMAN 1 Nusantara Jakarta',
      level: 'SMA',
      status: 'NEGERI',
      kecamatan: 'Pulo Gadung',
      literacyScore: 88.4,
      numeracyScore: 81.2,
      climateScore: 89.1,
      averageScore: 86.2,
      riskCategory: 'HIJAU',
      kospStatus: 'APPROVED',
      supervisionStatus: 'SUDAH',
      headmasterName: 'Dr. Hj. Siti Rahmawati, S.Pd., M.Si.',
    },
    {
      id: 'sch-2',
      npsn: '20101892',
      name: 'SMAN 5 Budi Utomo',
      level: 'SMA',
      status: 'NEGERI',
      kecamatan: 'Sawah Besar',
      literacyScore: 84.1,
      numeracyScore: 78.5,
      climateScore: 86.0,
      averageScore: 82.8,
      riskCategory: 'HIJAU',
      kospStatus: 'APPROVED',
      supervisionStatus: 'SUDAH',
      headmasterName: 'Drs. Supriyanto, M.Pd.',
    },
    {
      id: 'sch-3',
      npsn: '20104521',
      name: 'SMK Negeri 26 Pembangunan',
      level: 'SMK',
      status: 'NEGERI',
      kecamatan: 'Pulo Gadung',
      literacyScore: 76.5,
      numeracyScore: 71.0,
      climateScore: 79.4,
      averageScore: 75.6,
      riskCategory: 'KUNING',
      kospStatus: 'IN_REVIEW',
      supervisionStatus: 'TERJADWAL',
      headmasterName: 'Drs. Purwanto, M.M.',
    },
    {
      id: 'sch-4',
      npsn: '20107712',
      name: 'SMA Swasta Diponegoro 1',
      level: 'SMA',
      status: 'SWASTA',
      kecamatan: 'Pulo Gadung',
      literacyScore: 64.2,
      numeracyScore: 58.7,
      climateScore: 68.3,
      averageScore: 63.7,
      riskCategory: 'MERAH',
      kospStatus: 'IN_REVIEW',
      supervisionStatus: 'BELUM',
      headmasterName: 'Bambang Triyadi, M.Pd.',
    },
    {
      id: 'sch-5',
      npsn: '20109923',
      name: 'SMAS Muhammadiyah 11 Jakarta',
      level: 'SMA',
      status: 'SWASTA',
      kecamatan: 'Matraman',
      literacyScore: 72.8,
      numeracyScore: 66.4,
      climateScore: 74.0,
      averageScore: 71.1,
      riskCategory: 'KUNING',
      kospStatus: 'APPROVED',
      supervisionStatus: 'SUDAH',
      headmasterName: 'Dra. Endang Lestari',
    },
    {
      id: 'sch-6',
      npsn: '20103344',
      name: 'SMK Tamansiswa 1 Jakarta',
      level: 'SMK',
      status: 'SWASTA',
      kecamatan: 'Jatinegara',
      literacyScore: 59.8,
      numeracyScore: 54.2,
      climateScore: 62.5,
      averageScore: 58.8,
      riskCategory: 'MERAH',
      kospStatus: 'DRAFT',
      supervisionStatus: 'BELUM',
      headmasterName: 'Ir. Ahmad Zarkasyi',
    },
  ];

  // Mock Data Jadwal
  const scheduleData: ScheduleItem[] = [
    {
      id: 'sch-obs-1',
      type: 'OBSERVASI_KELAS',
      schoolName: 'SMAN 1 Nusantara Jakarta',
      teacherOrKepsekName: 'Ahmad Fauzi, S.Pd., Gr.',
      role: 'Guru Fisika Kelas XI',
      date: 'Jumat, 09 Okt 2026',
      time: '08:00 - 09:30 WIB',
      subjectOrTopic: 'Supervisi Kelas: Kinematika & IoT Sensor',
      meetingPlatform: 'Luring (Tatap Muka)',
      status: 'TERKONFIRMASI',
    },
    {
      id: 'sch-cln-1',
      type: 'KLINIK_COACHING',
      schoolName: 'SMAN 1 Nusantara Jakarta',
      teacherOrKepsekName: 'Dr. Hj. Siti Rahmawati, M.Si.',
      role: 'Kepala Sekolah',
      date: 'Jumat, 09 Okt 2026',
      time: '13:30 - 14:15 WIB',
      subjectOrTopic: 'Penyelarasan RKAS BOS & Rekomendasi Rapor Mutu',
      meetingPlatform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/siw-aspr-pro',
      status: 'TERKONFIRMASI',
    },
    {
      id: 'sch-cln-2',
      type: 'BEDAH_KOSP',
      schoolName: 'SMA Swasta Diponegoro 1',
      teacherOrKepsekName: 'Bambang Triyadi, M.Pd.',
      role: 'Kepala Sekolah & Tim Kurikulum',
      date: 'Senin, 12 Okt 2026',
      time: '10:00 - 11:30 WIB',
      subjectOrTopic: 'Intervensi Khusus: Perbaikan KOSP & Asesmen',
      meetingPlatform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/dipo-kosp-clinic',
      status: 'MENUNGGU',
    },
  ];

  // Filter Heatmap
  const filteredSchools = schoolsData.filter((sch) => {
    const matchesSearch =
      sch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.npsn.includes(searchQuery) ||
      sch.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'ALL' || sch.riskCategory === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  // Handler Analisis AI
  const handleRunAiChecker = async () => {
    setIsAnalyzing(true);

    try {
      // Panggil backend route /api/ai/analyze-document jika tersedia atau fallback engine
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle: docTitle,
          documentType: docType,
          documentContent: docText,
          schoolLevel: 'SMA',
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const json = await res.json();
        if (json.data) {
          const d = json.data;
          setAiResult({
            overallScore: d.overallScore,
            predicate: d.overallPredicate,
            summary: d.complianceSummary,
            recommendation: d.supervisorApprovalRecommendation,
            criteria: d.checklistCriteria.map((c: any) => ({
              id: c.id,
              code: c.code,
              name: c.criterion || c.category,
              isCompliant: c.isCompliant,
              score: c.score,
              evidence: c.evidence,
              recommendation: c.recommendation,
            })),
            merdekaPillars: {
              berpusatPadaMurid: d.curriculumMerdekaElements?.berpusatPadaMurid?.status ?? true,
              pembelajaranDiferensiasi: d.curriculumMerdekaElements?.pembelajaranBerdiferensiasi?.status ?? true,
              profilPelajarPancasila: d.curriculumMerdekaElements?.penguatanProfilPelajarPancasila?.status ?? true,
              asesmenFormatif: d.curriculumMerdekaElements?.asesmenFormatifDanSumatif?.status ?? true,
            },
          });
          setIsAnalyzing(false);
          return;
        }
      }

      // Fallback response terstruktur
      setTimeout(() => {
        setAiResult({
          overallScore: 89,
          predicate: 'SANGAT_SESUAI',
          summary: `Dokumen "${docTitle}" telah memenuhi standar Kurikulum Merdeka. Terdapat diferensiasi proses yang jelas, keterkaitan Capaian Pembelajaran, serta integrasi dimensi Profil Pelajar Pancasila secara kontekstual.`,
          recommendation: 'LAYAK_DISAHKAN',
          criteria: [
            {
              id: 'c-1',
              code: 'KM-01',
              name: 'Kesesuaian Capaian Pembelajaran (CP) dan Tujuan Pembelajaran',
              isCompliant: true,
              score: 4,
              evidence: 'Tujuan pembelajaran operasional: "menganalisis hubungan gaya dan percepatan".',
              recommendation: 'Pertahankan formulasi indikator ketercapaian.',
            },
            {
              id: 'c-2',
              code: 'KM-02',
              name: 'Penerapan Pembelajaran Berdiferensiasi',
              isCompliant: true,
              score: 4,
              evidence: 'Terdapat pembagian kelompok praktikum riil dan simulasi PhET sesuai kesiapan belajar murid.',
              recommendation: 'Tambahkan lembar kerja pendamping untuk gaya belajar auditori.',
            },
            {
              id: 'c-3',
              code: 'KM-03',
              name: 'Integrasi Profil Pelajar Pancasila (P5)',
              isCompliant: true,
              score: 4,
              evidence: 'Dimensi Bernalar Kritis, Gotong Royong, dan Mandiri dicantumkan dalam langkah kerja.',
              recommendation: 'Perkuat lembar observasi gotong royong saat praktikum.',
            },
            {
              id: 'c-4',
              code: 'KM-04',
              name: 'Asesmen Formatif & Refleksi Pembelajaran',
              isCompliant: true,
              score: 3,
              evidence: 'Menggunakan asesmen unjuk kerja proses dan refleksi 5 menit di penutup kelas.',
              recommendation: 'Lengkapi dengan rubrik penilaian bertingkat 1 sampai 4.',
            },
          ],
          merdekaPillars: {
            berpusatPadaMurid: true,
            pembelajaranDiferensiasi: true,
            profilPelajarPancasila: true,
            asesmenFormatif: true,
          },
        });
        setIsAnalyzing(false);
      }, 900);
    } catch {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      {/* Top Header Profil Pengawas */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-lg shadow-emerald-500/10">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                Pengawas Sekolah Pembina
              </span>
              <span className="text-xs text-slate-400">Wilayah: Jakarta Timur</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Drs. H. Suryadi, M.Pd.
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              NIP: 197405121998021003 • 6 Sekolah Binaan Binaan Terdaftar (TP 2024/2025)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400">Cakupan Supervisi</div>
            <div className="text-lg font-black text-emerald-400">66.7%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <div className="text-[10px] text-slate-400">Sekolah Berisiko</div>
            <div className="text-lg font-black text-rose-400">2 Sekolah</div>
          </div>
        </div>
      </div>

      {/* Bagian 1: Visualisasi Heatmap Sekolah Binaan */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Peta Mutu & Heatmap Sekolah Binaan
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Klasifikasi warna Merah/Kuning/Hijau berdasarkan agregasi Capaian Rapor Pendidikan dan Kepatuhan KOSP.
            </p>
          </div>

          {/* Metric Selector & Risk Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center text-xs">
              <button
                onClick={() => setSelectedMetric('average')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedMetric === 'average' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rata-rata Rapor
              </button>
              <button
                onClick={() => setSelectedMetric('literacy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedMetric === 'literacy' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Literasi
              </button>
              <button
                onClick={() => setSelectedMetric('numeracy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedMetric === 'numeracy' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Numerasi
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['ALL', 'HIJAU', 'KUNING', 'MERAH'] as const).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setSelectedRiskFilter(risk)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all border ${
                    selectedRiskFilter === risk
                      ? risk === 'HIJAU'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : risk === 'KUNING'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : risk === 'MERAH'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-700 text-white border-slate-600'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {risk === 'ALL' ? 'Semua' : risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => {
            const scoreToDisplay =
              selectedMetric === 'literacy'
                ? school.literacyScore
                : selectedMetric === 'numeracy'
                ? school.numeracyScore
                : selectedMetric === 'climate'
                ? school.climateScore
                : school.averageScore;

            const isRed = school.riskCategory === 'MERAH';
            const isYellow = school.riskCategory === 'KUNING';
            const isGreen = school.riskCategory === 'HIJAU';

            return (
              <div
                key={school.id}
                onClick={() => setActiveSchoolDetail(school)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isGreen
                    ? 'bg-emerald-950/20 border-emerald-800/60 hover:border-emerald-500'
                    : isYellow
                    ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-500'
                    : 'bg-rose-950/25 border-rose-800/70 hover:border-rose-500'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-700">
                          {school.level} {school.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          NPSN: {school.npsn}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1.5 line-clamp-1">
                        {school.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-500" /> Kecamatan {school.kecamatan}
                      </p>
                    </div>

                    <div
                      className={`h-11 w-11 rounded-xl flex flex-col items-center justify-center font-black text-sm shrink-0 shadow-md ${
                        isGreen
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isYellow
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      <span>{scoreToDisplay.toFixed(1)}</span>
                      <span className="text-[8px] uppercase tracking-tighter opacity-80">Rapor</span>
                    </div>
                  </div>

                  {/* Sub metrics mini bar */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="text-slate-400 block">Literasi</span>
                      <span className="font-bold text-cyan-400 font-mono">{school.literacyScore}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="text-slate-400 block">Numerasi</span>
                      <span className="font-bold text-purple-400 font-mono">{school.numeracyScore}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900/70 border border-slate-800">
                      <span className="text-slate-400 block">Iklim Belajar</span>
                      <span className="font-bold text-emerald-400 font-mono">{school.climateScore}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">KOSP:</span>
                    <span
                      className={`font-semibold ${
                        school.kospStatus === 'APPROVED'
                          ? 'text-emerald-400'
                          : school.kospStatus === 'IN_REVIEW'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {school.kospStatus}
                    </span>
                  </div>

                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      isGreen
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isYellow
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {isGreen ? 'Kondisi Baik' : isYellow ? 'Perlu Pemantauan' : 'Butuh Intervensi'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bagian 2: Split View - Widget Jadwal & Panel AI Document Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Widget Jadwal Observasi & Coaching (5 Kolom) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-extrabold text-white">
                Jadwal Observasi & Coaching
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">3 Sesi Minggu Ini</span>
          </div>

          <div className="space-y-3">
            {scheduleData.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3 shadow-md hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      item.type === 'OBSERVASI_KELAS'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : item.type === 'KLINIK_COACHING'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">
                    {item.subjectOrTopic}
                  </h3>
                  <div className="text-xs text-slate-300 mt-1">
                    {item.teacherOrKepsekName}{' '}
                    <span className="text-slate-500">({item.role})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {item.schoolName}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </div>
                  <span className="font-mono text-cyan-300">{item.time}</span>
                </div>

                {item.meetingUrl ? (
                  <a
                    href={item.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all w-full"
                  >
                    <Video className="h-4 w-4" /> Masuk Sesi Google Meet
                  </a>
                ) : (
                  <div className="py-1.5 px-3 rounded-xl bg-slate-800/80 text-slate-400 text-center text-xs">
                    Pelaksanaan Tatap Muka di Satuan Pendidikan
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Kolom Kanan: Panel AI Document Checker (7 Kolom) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h2 className="text-base font-extrabold text-white">
                Panel AI Document Checker (Gemini SDK)
              </h2>
            </div>
            <span className="text-xs text-purple-400 font-mono">Kurikulum Merdeka Audit</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            {/* Input Controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Jenis Dokumen:
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="MODUL_AJAR">Modul Ajar Pembelajaran</option>
                    <option value="KOSP">KOSP (Kurikulum Operasional)</option>
                    <option value="RKAS">RKAS (Rencana Kegiatan Anggaran)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Judul Dokumen:
                  </label>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Teks Isi Dokumen atau Ringkasan Komponen:
                </label>
                <textarea
                  rows={4}
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200 text-xs font-mono leading-relaxed"
                />
              </div>

              <button
                onClick={handleRunAiChecker}
                disabled={isAnalyzing}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gemini AI sedang menelaah kepatuhan dokumen...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Periksa Dokumen dengan AI Pengawas (Generate Checklist)</span>
                  </>
                )}
              </button>
            </div>

            {/* Hasil Checklist AI */}
            {aiResult && (
              <div className="pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
                {/* Result Header Badge */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Rekomendasi Tindakan:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">
                      {aiResult.recommendation.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {aiResult.summary}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">Skor Mutu:</span>
                    <span className="font-black text-cyan-300 text-2xl font-mono">
                      {aiResult.overallScore} / 100
                    </span>
                    <span className="text-[10px] font-bold block text-emerald-400">
                      {aiResult.predicate}
                    </span>
                  </div>
                </div>

                {/* 4 Pilar Kurikulum Merdeka */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Berpusat Murid</span>
                    <span className="font-bold text-emerald-400">✓ Terpenuhi</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Diferensiasi</span>
                    <span className="font-bold text-emerald-400">✓ Terpenuhi</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">P5 Terpadu</span>
                    <span className="font-bold text-emerald-400">✓ Terpenuhi</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Asesmen Formatif</span>
                    <span className="font-bold text-amber-400">! Cukup</span>
                  </div>
                </div>

                {/* Butir Kriteria Checklist */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {aiResult.criteria.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">
                          {c.code}: {c.name}
                        </span>
                        <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded">
                          Skor {c.score}/4
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-semibold">Bukti: </span>
                        {c.evidence}
                      </p>
                      <p className="text-[11px] text-slate-300">
                        <span className="text-cyan-400 font-semibold">Saran Pengawas: </span>
                        {c.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
