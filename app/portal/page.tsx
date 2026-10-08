'use client';

import React, { useState } from 'react';
import {
  FolderLock,
  BookOpen,
  Video,
  Upload,
  FileText,
  History,
  MessageSquare,
  CheckCircle2,
  Clock,
  Calendar,
  Smile,
  AlertTriangle,
  Send,
  Plus,
  Download,
  Eye,
  UserCheck,
  School,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  ThumbsUp,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  DocumentType,
  DocumentStatus,
  ReflectionMood,
  ReflectionCategory,
  ClinicType,
  ClinicStatus,
} from '../../types';

interface DocumentRepoItem {
  id: string;
  title: string;
  type: DocumentType;
  academicYear: string;
  status: DocumentStatus;
  currentVersion: number;
  uploadedAt: string;
  versions: {
    versionNumber: number;
    fileName: string;
    fileSizeMb: number;
    uploadedAt: string;
    changeSummary: string;
  }[];
  supervisorNotes: {
    id: string;
    authorName: string;
    role: string;
    createdAt: string;
    content: string;
    status: 'OPEN' | 'RESOLVED';
  }[];
}

interface ReflectionEntry {
  id: string;
  date: string;
  title: string;
  category: ReflectionCategory;
  mood: ReflectionMood;
  whatWentWell: string;
  challengesFaced: string;
  actionPlanNext: string;
  resourcesNeeded: string;
  supervisorFeedback?: string;
  feedbackGivenAt?: string;
}

interface SupervisorSlot {
  id: string;
  date: string;
  time: string;
  dayName: string;
  isAvailable: boolean;
  platform: string;
}

interface ClinicBookingItem {
  id: string;
  bookingCode: string;
  clinicType: ClinicType;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  status: ClinicStatus;
  meetingPlatform: string;
  meetingUrl: string;
  supervisorName: string;
  actionItems: string[];
}

export default function WorkspacePortalPage() {
  // Toggle Peran Pengguna Aktif di Portal (Guru / Kepala Sekolah)
  const [activePortalRole, setActivePortalRole] = useState<'GURU' | 'KEPALA_SEKOLAH'>('GURU');

  // Active Tab Menu
  const [activeTab, setActiveTab] = useState<'REPOSITORY' | 'REFLECTION' | 'CLINIC'>('REPOSITORY');

  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // 1. DATA & STATE: BRANKAS DOKUMEN (E-REPOSITORY)
  // ---------------------------------------------------------------------------
  const [documents, setDocuments] = useState<DocumentRepoItem[]>([
    {
      id: 'doc-kosp-1',
      title: 'Kurikulum Operasional Satuan Pendidikan (KOSP) SMAN 1 Nusantara 2024/2025',
      type: DocumentType.KOSP,
      academicYear: '2024/2025',
      status: DocumentStatus.APPROVED,
      currentVersion: 2,
      uploadedAt: '2026-09-25',
      versions: [
        {
          versionNumber: 2,
          fileName: 'KOSP_SMAN1_Nusantara_2024_Final_Approved.pdf',
          fileSizeMb: 4.25,
          uploadedAt: '2026-09-25 11:00 WIB',
          changeSummary: 'Revisi Bab III: Penyesuaian Beban Belajar P5 Tema Rekayasa dan Teknologi sesuai rekomendasi Pengawas.',
        },
        {
          versionNumber: 1,
          fileName: 'KOSP_SMAN1_Nusantara_2024_Draft_Awal.pdf',
          fileSizeMb: 4.12,
          uploadedAt: '2026-07-10 09:30 WIB',
          changeSummary: 'Pengajuan draf awal KOSP TP 2024/2025 untuk validasi pengawas pembina.',
        },
      ],
      supervisorNotes: [
        {
          id: 'sn-1',
          authorName: 'Drs. H. Suryadi, M.Pd.',
          role: 'Pengawas Sekolah Pembina',
          createdAt: '2026-09-28 14:30 WIB',
          content: 'Dokumen KOSP versi 2.0 telah memenuhi seluruh kriteria regulasi BSKAP 032/H/KR/2024. Telah diverifikasi dan disahkan.',
          status: 'RESOLVED',
        },
      ],
    },
    {
      id: 'doc-ma-1',
      title: 'Modul Ajar Fisika - Kinematika Gerak Lurus & Penerapan IoT Sensor (Fase F)',
      type: DocumentType.MODUL_AJAR,
      academicYear: '2024/2025',
      status: DocumentStatus.IN_REVIEW,
      currentVersion: 1,
      uploadedAt: '2026-10-02',
      versions: [
        {
          versionNumber: 1,
          fileName: 'Modul_Ajar_Fisika_Fauzi_Kinematika.pdf',
          fileSizeMb: 1.84,
          uploadedAt: '2026-10-02 13:00 WIB',
          changeSummary: 'Unggahan awal modul ajar pembelajaran berdiferensiasi untuk persiapan supervisi klinis.',
        },
      ],
      supervisorNotes: [
        {
          id: 'sn-2',
          authorName: 'Drs. H. Suryadi, M.Pd.',
          role: 'Pengawas Sekolah Pembina',
          createdAt: '2026-10-04 15:20 WIB',
          content: 'Rancangan diferensiasi proses sudah sangat bagus (variasi PhET vs Praktikum riil). Saran: Perjelas rubrik asesmen formatif unjuk kerja saat praktikum berlangsung.',
          status: 'OPEN',
        },
      ],
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState<DocumentRepoItem>(documents[0]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<DocumentType>(DocumentType.MODUL_AJAR);
  const [newDocDescription, setNewDocDescription] = useState('');

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    const newDoc: DocumentRepoItem = {
      id: `doc-${Date.now()}`,
      title: newDocTitle,
      type: newDocType,
      academicYear: '2024/2025',
      status: DocumentStatus.SUBMITTED,
      currentVersion: 1,
      uploadedAt: new Date().toISOString().split('T')[0],
      versions: [
        {
          versionNumber: 1,
          fileName: `${newDocTitle.replace(/\s+/g, '_')}_v1.pdf`,
          fileSizeMb: 2.15,
          uploadedAt: new Date().toLocaleString('id-ID'),
          changeSummary: newDocDescription || 'Unggahan draf berkas untuk review Pengawas Pembina.',
        },
      ],
      supervisorNotes: [],
    };

    setDocuments([newDoc, ...documents]);
    setSelectedDoc(newDoc);
    setIsUploadModalOpen(false);
    setNewDocTitle('');
    setNewDocDescription('');
    setNotification('Dokumen berhasil diunggah ke Brankas dan dikirim untuk telaah Pengawas!');
    setTimeout(() => setNotification(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // 2. DATA & STATE: JURNAL REFLEKSI DIGITAL
  // ---------------------------------------------------------------------------
  const [reflections, setReflections] = useState<ReflectionEntry[]>([
    {
      id: 'ref-1',
      date: '2026-10-04',
      title: 'Refleksi Praktik Pembelajaran Sains Kinematika Berdiferensiasi',
      category: ReflectionCategory.REFLEKSI_GURU,
      mood: ReflectionMood.SANGAT_ANTUSIAS,
      whatWentWell: 'Siswa yang biasanya pasif di barisan belakang menjadi sangat bersemangat saat memegang peran sebagai operator sensor gerak digital.',
      challengesFaced: 'Transisi perpindahan antarkelompok praktikum masih memakan waktu 7 menit sehingga fase penutup terasa terburu-buru.',
      actionPlanNext: 'Menetapkan role keeper time di tiap kelompok dan menampilkan timer digital di layar LCD depan kelas.',
      resourcesNeeded: '2 unit laptop tambahan untuk display grafik kecepatan realtime.',
      supervisorFeedback: 'Sangat inspiratif! Pendekatan student-centered Pak Fauzi sudah sangat matang. Saran timer di layar utama sangat tepat.',
      feedbackGivenAt: '2026-10-05 09:00 WIB',
    },
    {
      id: 'ref-2',
      date: '2026-10-01',
      title: 'Evaluasi Implementasi Komunitas Belajar (Kombel) Guru Fase E & F',
      category: ReflectionCategory.REFLEKSI_KEPALA_SEKOLAH,
      mood: ReflectionMood.PUAS,
      whatWentWell: 'Partisipasi Kombel mencapai 94%. Guru mulai berani saling mengobservasi kelas rekan sejawat (peer observation).',
      challengesFaced: 'Sinkronisasi jadwal luang guru mata pelajaran peminatan masih agak padat di hari Rabu.',
      actionPlanNext: 'Membuat jadwal blok khusus Kombel di hari Jumat siang setelah kegiatan ibadah.',
      resourcesNeeded: 'Ruang kolaborasi guru dengan smartboard untuk simulasi modul ajar.',
      supervisorFeedback: 'Langkah strategis Ibu Kepala Sekolah patut diapresiasi. Budaya saling berbagi praktik baik adalah jantung Kurikulum Merdeka.',
      feedbackGivenAt: '2026-10-02 11:15 WIB',
    },
  ]);

  const [refTitle, setRefTitle] = useState('');
  const [refMood, setRefMood] = useState<ReflectionMood>(ReflectionMood.SANGAT_ANTUSIAS);
  const [refWhatWentWell, setRefWhatWentWell] = useState('');
  const [refChallenges, setRefChallenges] = useState('');
  const [refActionPlan, setRefActionPlan] = useState('');
  const [refResources, setRefResources] = useState('');

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refTitle.trim() || !refWhatWentWell.trim()) return;

    const newRef: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: refTitle,
      category:
        activePortalRole === 'GURU'
          ? ReflectionCategory.REFLEKSI_GURU
          : ReflectionCategory.REFLEKSI_KEPALA_SEKOLAH,
      mood: refMood,
      whatWentWell: refWhatWentWell,
      challengesFaced: refChallenges,
      actionPlanNext: refActionPlan,
      resourcesNeeded: refResources,
    };

    setReflections([newRef, ...reflections]);
    setRefTitle('');
    setRefWhatWentWell('');
    setRefChallenges('');
    setRefActionPlan('');
    setRefResources('');
    setNotification('Jurnal Refleksi berhasil disimpan dan disinkronkan ke Dasbor Pengawas!');
    setTimeout(() => setNotification(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // 3. DATA & STATE: KLINIK VIRTUAL BOOKING
  // ---------------------------------------------------------------------------
  const supervisorAvailableSlots: SupervisorSlot[] = [
    {
      id: 'slot-1',
      date: '2026-10-09',
      dayName: 'Jumat',
      time: '13:30 - 14:15 WIB',
      isAvailable: false,
      platform: 'Google Meet',
    },
    {
      id: 'slot-2',
      date: '2026-10-12',
      dayName: 'Senin',
      time: '09:00 - 09:45 WIB',
      isAvailable: true,
      platform: 'Google Meet',
    },
    {
      id: 'slot-3',
      date: '2026-10-12',
      dayName: 'Senin',
      time: '14:00 - 14:45 WIB',
      isAvailable: true,
      platform: 'Google Meet',
    },
    {
      id: 'slot-4',
      date: '2026-10-14',
      dayName: 'Rabu',
      time: '10:00 - 10:45 WIB',
      isAvailable: true,
      platform: 'Google Meet',
    },
    {
      id: 'slot-5',
      date: '2026-10-16',
      dayName: 'Jumat',
      time: '15:00 - 15:45 WIB',
      isAvailable: true,
      platform: 'Google Meet',
    },
  ];

  const [bookings, setBookings] = useState<ClinicBookingItem[]>([
    {
      id: 'cln-1',
      bookingCode: 'KLINIK-202410-0012',
      clinicType: ClinicType.KLINIK_KOSP,
      topic: 'Konsultasi Bedah Indikator Mutu & Penyelarasan RKAS BOS 2025',
      scheduledAt: 'Jumat, 09 Okt 2026 (13:30 WIB)',
      durationMinutes: 45,
      status: ClinicStatus.CONFIRMED,
      meetingPlatform: 'Google Meet',
      meetingUrl: 'https://meet.google.com/siw-aspr-pro',
      supervisorName: 'Drs. H. Suryadi, M.Pd.',
      actionItems: ['Menyiapkan lembar Rapor Pendidikan Satuan', 'Draft rancangan belanja BOS sub-program literasi'],
    },
  ]);

  const [selectedSlot, setSelectedSlot] = useState<SupervisorSlot | null>(supervisorAvailableSlots[1]);
  const [bookingType, setBookingType] = useState<ClinicType>(ClinicType.INDIVIDUAL_COACHING);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDesc, setBookingDesc] = useState('');

  const handleBookClinicSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !bookingTopic.trim()) return;

    const newBooking: ClinicBookingItem = {
      id: `cln-${Date.now()}`,
      bookingCode: `KLINIK-202410-${Math.floor(1000 + Math.random() * 9000)}`,
      clinicType: bookingType,
      topic: bookingTopic,
      scheduledAt: `${selectedSlot.dayName}, ${selectedSlot.date} (${selectedSlot.time})`,
      durationMinutes: 45,
      status: ClinicStatus.CONFIRMED,
      meetingPlatform: selectedSlot.platform,
      meetingUrl: 'https://meet.google.com/siw-clinic-session',
      supervisorName: 'Drs. H. Suryadi, M.Pd.',
      actionItems: ['Menyiapkan draf bahan yang ingin dikonsultasikan'],
    };

    setBookings([newBooking, ...bookings]);
    setBookingTopic('');
    setBookingDesc('');
    setNotification('Sesi Klinik Coaching berhasil dibooking dan tautan Google Meet telah dibuat!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner Ruang Kerja Digital */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold shadow-lg shadow-cyan-500/10 shrink-0">
            {activePortalRole === 'GURU' ? <BookOpen className="h-7 w-7" /> : <School className="h-7 w-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
                Ruang Kerja Satuan Pendidikan
              </span>
              <span className="text-xs text-slate-400">SMAN 1 Nusantara Jakarta (NPSN: 20101456)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Portal {activePortalRole === 'GURU' ? 'Guru Profesional' : 'Kepala Sekolah'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activePortalRole === 'GURU'
                ? 'Ahmad Fauzi, S.Pd., Gr. • Guru Mata Pelajaran Fisika'
                : 'Dr. Hj. Siti Rahmawati, S.Pd., M.Si. • Kepala Sekolah'}
            </p>
          </div>
        </div>

        {/* Role Switcher Pill & Pengawas Info */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setActivePortalRole('GURU')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activePortalRole === 'GURU' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode Guru
            </button>
            <button
              onClick={() => setActivePortalRole('KEPALA_SEKOLAH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activePortalRole === 'KEPALA_SEKOLAH' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mode Kepala Sekolah
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 hidden sm:block">
            <span className="text-slate-400 block text-[10px]">Pengawas Pembina:</span>
            <span className="font-bold text-white">Drs. H. Suryadi, M.Pd.</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-md">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('REPOSITORY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'REPOSITORY'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderLock className="h-4 w-4" />
          <span>1. Brankas Dokumen (E-Repository & Versi)</span>
        </button>

        <button
          onClick={() => setActiveTab('REFLECTION')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'REFLECTION'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>2. Jurnal Refleksi Digital</span>
        </button>

        <button
          onClick={() => setActiveTab('CLINIC')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'CLINIC'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="h-4 w-4" />
          <span>3. Booking Klinik Virtual Pengawas</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* MODUL 1: BRANKAS DOKUMEN (E-REPOSITORY & VERSIONING)                  */}
      {/* ===================================================================== */}
      {activeTab === 'REPOSITORY' && (
        <section className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Brankas Dokumen Digital (KOSP, RKAS & Modul Ajar)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola arsip kurikulum, riwayat pembaharuan berkas (version control), serta catatan telaah Pengawas Pembina.
              </p>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-lg shadow-cyan-600/20 self-start sm:self-auto"
            >
              <Upload className="h-4 w-4" />
              <span>Unggah Dokumen / Revisi Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List Dokumen Satuan (5 Kolom) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-300 px-1">
                Daftar Berkas Terunggah ({documents.length})
              </div>

              {documents.map((doc) => {
                const isSelected = doc.id === selectedDoc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700 font-mono">
                        {doc.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === DocumentStatus.APPROVED
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-100 mt-2 line-clamp-2">
                      {doc.title}
                    </h3>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Versi {doc.currentVersion}.0</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MessageSquare className="h-3 w-3 text-cyan-400" />
                        {doc.supervisorNotes.length} Catatan Pengawas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail Dokumen, Riwayat Versi & Catatan Pengawas (7 Kolom) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                      {selectedDoc.type}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Tahun Ajaran: {selectedDoc.academicYear}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">
                    {selectedDoc.title}
                  </h3>
                </div>

                {/* Riwayat Versi Berkas */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <History className="h-4 w-4 text-cyan-400" />
                    Riwayat Pembaharuan Versi Berkas (Versioning)
                  </h4>

                  <div className="space-y-2">
                    {selectedDoc.versions.map((ver) => (
                      <div
                        key={ver.versionNumber}
                        className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-400 font-mono bg-cyan-950 px-1.5 py-0.5 rounded">
                              v{ver.versionNumber}.0
                            </span>
                            <span className="font-semibold text-slate-200">{ver.fileName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{ver.changeSummary}</p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Diunggah: {ver.uploadedAt} • {ver.fileSizeMb} MB
                          </span>
                        </div>

                        <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kolom Catatan & Umpan Balik Resmi Pengawas */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" />
                    Catatan & Telaah Resmi Pengawas Pembina
                  </h4>

                  {selectedDoc.supervisorNotes.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-800/30 text-center text-xs text-slate-500 italic">
                      Belum ada catatan dari Pengawas Pembina. Berkas sedang dalam antrean telaah.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedDoc.supervisorNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-300">
                              {note.authorName} ({note.role})
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {note.createdAt}
                            </span>
                          </div>
                          <p className="text-slate-200 leading-relaxed italic">
                            "{note.content}"
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Status: Terverifikasi
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Unggah Berkas Baru */}
          {isUploadModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Upload className="h-4 w-4 text-cyan-400" />
                    Unggah Dokumen Kurikulum ke Brankas
                  </h3>
                  <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleUploadDocument} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Jenis Dokumen:</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value as DocumentType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value={DocumentType.MODUL_AJAR}>Modul Ajar Pembelajaran</option>
                      <option value={DocumentType.KOSP}>KOSP (Kurikulum Operasional Satuan)</option>
                      <option value={DocumentType.RKAS}>RKAS (Rencana Kegiatan Anggaran BOS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Judul Dokumen:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Modul Ajar Kimia Termokimia Kelas XI..."
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Catatan Ringkasan / Perubahan Versi:</label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan komponen utama atau revisi yang baru dilakukan..."
                      value={newDocDescription}
                      onChange={(e) => setNewDocDescription(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-200"
                    />
                  </div>

                  <div className="p-4 border-2 border-dashed border-slate-700 rounded-xl text-center space-y-1 bg-slate-950/40">
                    <FileText className="h-6 w-6 text-cyan-400 mx-auto" />
                    <p className="text-slate-300 font-semibold text-xs">Pilih berkas PDF atau seret ke sini</p>
                    <p className="text-[10px] text-slate-500">Maksimal 25MB • Format .PDF atau .DOCX</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                    >
                      Simpan & Kirim
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===================================================================== */}
      {/* MODUL 2: JURNAL REFLEKSI DIGITAL (LOG HARIAN / MINGGUAN)              */}
      {/* ===================================================================== */}
      {activeTab === 'REFLECTION' && (
        <section className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-extrabold text-white">
              Jurnal Refleksi Digital Pembelajaran & Kepemimpinan
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ruang log mandiri untuk mendokumentasikan kendala riil, capaian positif, dan rencana tindak lanjut perbaikan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Input Log Refleksi Baru (6 Kolom) */}
            <div className="lg:col-span-6 space-y-4">
              <form onSubmit={handleSaveReflection} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    Tulis Catatan Refleksi Baru
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Judul / Topik Refleksi:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Refleksi Efektivitas Praktikum Sensor Gerak Pekan ke-4..."
                      value={refTitle}
                      onChange={(e) => setRefTitle(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Kondisi Emosional & Kepuasan (Mood):
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {[
                        { key: ReflectionMood.SANGAT_ANTUSIAS, label: 'Sangat Puas' },
                        { key: ReflectionMood.PUAS, label: 'Puas' },
                        { key: ReflectionMood.NETRAL, label: 'Cukup' },
                        { key: ReflectionMood.TERTANTANG, label: 'Tertantang' },
                        { key: ReflectionMood.BUTUH_BANTUAN, label: 'Butuh Solusi' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setRefMood(item.key)}
                          className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                            refMood === item.key
                              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      1. Apa yang telah berjalan dengan baik? (Keberhasilan):
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Siswa mampu berkolaborasi aktif, respon positif terhadap metode..."
                      value={refWhatWentWell}
                      onChange={(e) => setRefWhatWentWell(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      2. Kendala & Tantangan yang Dihadapi:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Manajemen waktu transisi, pemahaman beberapa siswa pada rumus..."
                      value={refChallenges}
                      onChange={(e) => setRefChallenges(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      3. Rencana Aksi Perbaikan Berikutnya:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Membagi lembar bimbingan bertingkat, menyiapkan timer visual..."
                      value={refActionPlan}
                      onChange={(e) => setRefActionPlan(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      4. Kebutuhan Dukungan / Sarana Tambahan:
                    </label>
                    <input
                      type="text"
                      placeholder="Tambahan modul ajar, konsultasi klinis pengawas..."
                      value={refResources}
                      onChange={(e) => setRefResources(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 mt-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Simpan Catatan Refleksi</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Riwayat Refleksi & Umpan Balik Pengawas (6 Kolom) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span>Riwayat Log Refleksi ({reflections.length})</span>
                <span className="text-slate-500 font-mono">Tersinkron Pengawas</span>
              </div>

              <div className="space-y-4">
                {reflections.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {ref.title}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                        {ref.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                        <span className="text-emerald-400 font-semibold block text-[11px]">Keberhasilan:</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{ref.whatWentWell}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                        <span className="text-amber-400 font-semibold block text-[11px]">Tantangan:</span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{ref.challengesFaced || '-'}</p>
                      </div>
                    </div>

                    {/* Umpan Balik Pengawas jika ada */}
                    {ref.supervisorFeedback && (
                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-purple-300">
                            Umpan Balik Pengawas Pembina (Drs. H. Suryadi, M.Pd.)
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {ref.feedbackGivenAt}
                          </span>
                        </div>
                        <p className="text-slate-200 italic leading-relaxed text-[11px]">
                          "{ref.supervisorFeedback}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* MODUL 3: KLINIK VIRTUAL BOOKING & JADWAL PENGAWAS                     */}
      {/* ===================================================================== */}
      {activeTab === 'CLINIC' && (
        <section className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-lg font-extrabold text-white">
              Klinik Virtual & Konsultasi Pengawas (1-on-1 Coaching)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih slot waktu ketersediaan Pengawas Pembina untuk berkonsultasi mengenai KOSP, RKAS, atau supervisi klinis pembelajaran.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Slot Ketersediaan & Form Booking (6 Kolom) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    Slot Waktu Ketersediaan Pengawas Pembina
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Drs. H. Suryadi, M.Pd.</span>
                </div>

                {/* Grid Slot Ketersediaan */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Pilih Jadwal Sesi yang Masih Tersedia:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {supervisorAvailableSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                              : slot.isAvailable
                              ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                              : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{slot.dayName}, {slot.date}</span>
                            {!slot.isAvailable && (
                              <span className="text-[10px] text-rose-400 bg-rose-950 px-1 rounded">Terisi</span>
                            )}
                          </div>
                          <div className="text-[11px] mt-1 font-mono">{slot.time}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{slot.platform}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Input Detail Konsultasi */}
                <form onSubmit={handleBookClinicSession} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Jenis Konsultasi:
                    </label>
                    <select
                      value={bookingType}
                      onChange={(e) => setBookingType(e.target.value as ClinicType)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value={ClinicType.INDIVIDUAL_COACHING}>Coaching 1-on-1 Praktik Mengajar</option>
                      <option value={ClinicType.KLINIK_KOSP}>Klinik KOSP & Kurikulum Satuan</option>
                      <option value={ClinicType.KLINIK_RKAS}>Klinik RKAS BOS & Anggaran</option>
                      <option value={ClinicType.SUPERVISI_KLINIS}>Supervisi Klinis Modul Ajar</option>
                      <option value={ClinicType.BEDAH_RAPOR_PENDIDIKAN}>Bedah Rapor Mutu Pendidikan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Topik Bimbingan:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Konsultasi Rubrik Penilaian Diferensiasi..."
                      value={bookingTopic}
                      onChange={(e) => setBookingTopic(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Catatan Kendala yang Ingin Dibahas:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan kendala spesifik yang ingin dikonsultasikan bersama pengawas..."
                      value={bookingDesc}
                      onChange={(e) => setBookingDesc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mt-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>Konfirmasi Booking Sesi Klinik Virtual</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Sesi Terjadwal & Link Google Meet (6 Kolom) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-slate-300 px-1">
                Jadwal Sesi Terkonfirmasi ({bookings.length})
              </div>

              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {booking.clinicType}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {booking.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white">
                      {booking.topic}
                    </h3>

                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1 text-xs">
                      <div className="text-slate-400 text-[11px]">Waktu Sesi:</div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                        <Clock className="h-3.5 w-3.5 text-cyan-400" />
                        {booking.scheduledAt} ({booking.durationMinutes} Menit)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Bersama: <strong className="text-white">{booking.supervisorName}</strong>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={booking.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
                      >
                        <Video className="h-4 w-4" />
                        <span>Masuk Sesi {booking.meetingPlatform}</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
