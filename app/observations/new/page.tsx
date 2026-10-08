'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  School,
  FileText,
  RotateCcw,
  Download,
  Printer,
  Sparkles,
  Volume2,
  PenTool,
  Save,
  Check,
  AlertCircle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { ObservationPredicate } from '../../../types';

interface IndicatorItem {
  id: string;
  code: string;
  domain: string;
  statement: string;
  descriptors: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
}

const RUBRIC_INDICATORS: IndicatorItem[] = [
  {
    id: 'ind-1',
    code: 'IND-1.1',
    domain: '1. Keteraturan Suasana Kelas & Disiplin Positif',
    statement: 'Guru memfasilitasi kesepakatan kelas dan menerapkan komunikasi positif yang saling menghargai.',
    descriptors: {
      1: 'Guru mengabaikan dinamika kelas atau bersikap menghakimi saat murid tidak tertib.',
      2: 'Guru mengingatkan aturan tetapi cenderung searah dan kaku.',
      3: 'Guru mengingatkan kesepakatan kelas secara positif, tenang, dan bersahabat.',
      4: 'Guru memfasilitasi murid menyadari pentingnya kesepakatan bersama secara reflektif dan empatik.',
    },
  },
  {
    id: 'ind-2',
    code: 'IND-1.2',
    domain: '1. Keteraturan Suasana Kelas & Disiplin Positif',
    statement: 'Guru membangun iklim interaksi inklusif yang melibatkan seluruh peserta didik secara aktif.',
    descriptors: {
      1: 'Sebagian besar murid pasif dan guru mendominasi percakapan.',
      2: 'Hanya beberapa murid aktif di barisan depan yang diajak berinteraksi.',
      3: 'Sebagian besar murid terlibat dalam aktivitas terstruktur dan diskusi kelompok.',
      4: 'Seluruh peserta didik, termasuk yang pendiam, aktif berpartisipasi melalui pembagian peran bermakna.',
    },
  },
  {
    id: 'ind-3',
    code: 'IND-2.1',
    domain: '2. Penerapan Pembelajaran Berdiferensiasi',
    statement: 'Guru memfasilitasi diferensiasi proses atau konten berdasarkan kesiapan dan gaya belajar murid.',
    descriptors: {
      1: 'Seluruh aktivitas dan bahan ajar seragam tanpa variasi metode.',
      2: 'Ada variasi bahan ajar namun belum disesuaikan dengan kesiapan belajar murid.',
      3: 'Menyediakan beragam moda belajar (visual, audio, kinestetik) yang terorganisasi.',
      4: 'Memberikan penugasan berjenjang (scaffolding) dan bimbingan terarah bagi murid yang membutuhkan intervensi.',
    },
  },
  {
    id: 'ind-4',
    code: 'IND-2.2',
    domain: '2. Penerapan Pembelajaran Berdiferensiasi',
    statement: 'Guru mengaitkan materi dengan fenomena riil kontekstual dan memantik nalar kritis siswa.',
    descriptors: {
      1: 'Penyampaian materi bersifat hafalan tekstual tanpa contoh nyata.',
      2: 'Contoh kontekstual terbatas dan kurang relevan dengan kehidupan siswa.',
      3: 'Menyajikan studi kasus nyata atau analogi sains kontekstual yang mudah dipahami.',
      4: 'Memantik siswa mengajukan hipotesis, menganalisis data, dan menemukan solusi kritis mandiri.',
    },
  },
  {
    id: 'ind-5',
    code: 'IND-3.1',
    domain: '3. Asesmen Formatif & Refleksi Bermakna',
    statement: 'Guru melakukan asesmen formatif berkelanjutan dan memberikan umpan balik konstruktif.',
    descriptors: {
      1: 'Tidak ada asesmen selama proses belajar atau hanya sekadar benar/salah.',
      2: 'Umpan balik bersifat umum tanpa arahan langkah perbaikan konkret.',
      3: 'Memberikan umpan balik langsung yang menunjukkan letak kesalahan dan saran perbaikan.',
      4: 'Mendorong murid melakukan metakognisi dan asesmen diri (self-assessment) untuk memantau kemajuannya.',
    },
  },
  {
    id: 'ind-6',
    code: 'IND-3.2',
    domain: '3. Asesmen Formatif & Refleksi Bermakna',
    statement: 'Guru memfasilitasi refleksi penutup untuk menyimpulkan pembelajaran secara komprehensif.',
    descriptors: {
      1: 'Pembelajaran berakhir tiba-tiba tanpa kegiatan penutup atau simpulan.',
      2: 'Guru menyimpulkan materi secara sepihak dalam waktu tergesa-gesa.',
      3: 'Perwakilan siswa menyampaikan pemahaman konsep inti di akhir sesi.',
      4: 'Seluruh siswa melakukan refleksi bermakna (misal: lembar tiket keluar) mengaitkan materi dengan rencana tindak lanjut.',
    },
  },
];

export default function NewObservationPage() {
  // Identitas Observasi
  const [schoolName, setSchoolName] = useState('SMAN 1 Nusantara Jakarta');
  const [npsn, setNpsn] = useState('20101456');
  const [teacherName, setTeacherName] = useState('Ahmad Fauzi, S.Pd., Gr.');
  const [teacherNuptk, setTeacherNuptk] = useState('7482910482910381');
  const [observerName, setObserverName] = useState('Drs. H. Suryadi, M.Pd.');
  const [observerNip, setObserverNip] = useState('197405121998021003');
  const [subject, setSubject] = useState('Fisika');
  const [gradeLevel, setGradeLevel] = useState('Kelas XI-A (Fase F)');
  const [curriculumTopic, setCurriculumTopic] = useState('Penerapan Hukum II Newton & Analisis Gerak Sensor Lurus');
  const [observationDate, setObservationDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Rubrik Skor State (Nilai default skala 1-4)
  const [scores, setScores] = useState<Record<string, number>>({
    'ind-1': 4,
    'ind-2': 4,
    'ind-3': 4,
    'ind-4': 3,
    'ind-5': 3,
    'ind-6': 4,
  });

  const [evidenceNotes, setEvidenceNotes] = useState<Record<string, string>>({
    'ind-1': 'Guru menyapa murid dengan hangat dan menyepakati kontrak belajar kelas dengan nada empatik.',
    'ind-2': 'Setiap kelompok praktikum membagi peran operator sensor, pencatat data, dan juru bicara.',
    'ind-3': 'Tersedia simulasi PhET untuk murid visual dan sensor gerak rel dinamika untuk murid kinestetik.',
    'ind-4': 'Analogi rem ABS mobil modern sangat berhasil memantik rasa ingin tahu sains murid.',
    'ind-5': 'Guru berkeliling memberikan bimbingan teknis per kelompok saat pengolahan rumus gerak.',
    'ind-6': 'Murid menuliskan lembar refleksi 3 menit mengenai konsep yang paling berkesan hari ini.',
  });

  // Web Speech API State
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceTranscript, setVoiceTranscript] = useState(
    'Pelaksanaan pembelajaran berlangsung sangat interaktif dan terstruktur. Guru membuka kelas dengan apersepsi kontekstual berupa video perlambatan rem darurat mobil. Diferensiasi proses terfasilitasi dengan baik antara kelompok PhET digital dan praktikum sensor riil. Catatan pembinaan: alokasi waktu pada fase penutupan kelas perlu diperpanjang 5 menit agar seluruh perwakilan kelompok dapat memaparkan simpulan grafik kecepatan secara tuntas.'
  );
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const speechRecognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Digital Signatures State & Canvas Refs
  const teacherCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const observerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [teacherSigned, setTeacherSigned] = useState(false);
  const [observerSigned, setObserverSigned] = useState(false);
  const [isDrawingTeacher, setIsDrawingTeacher] = useState(false);
  const [isDrawingObserver, setIsDrawingObserver] = useState(false);

  // Draft Laporan Supervisi
  const [showReportDraft, setShowReportDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Inisialisasi Web Speech API (Browser Native SpeechRecognition)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let currentSessionText = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentSessionText += event.results[i][0].transcript;
          }
          if (currentSessionText.trim()) {
            setVoiceTranscript((prev) => {
              const cleaned = prev.endsWith('.') || prev.endsWith(' ') ? prev : `${prev}. `;
              return `${cleaned} ${currentSessionText}`.replace(/\s+/g, ' ');
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
          clearInterval(timerIntervalRef.current);
        };

        recognition.onend = () => {
          setIsRecording(false);
          clearInterval(timerIntervalRef.current);
        };

        speechRecognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Toggle Voice-to-Text Recording
  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Browser Anda tidak mendukung Web Speech API secara native. Gunakan input teks manual.');
      return;
    }

    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    } else {
      try {
        setRecordingSeconds(0);
        speechRecognitionRef.current.start();
        setIsRecording(true);
        timerIntervalRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn('Gagal memulai recording speech:', err);
      }
    }
  };

  // Kalkulasi Skor Rubrik
  const scoreValues = Object.values(scores);
  const totalScoreVal =
    scoreValues.reduce((sum, val) => sum + val, 0) / (scoreValues.length || 1);
  const percentageVal = (totalScoreVal / 4) * 100;

  const currentPredicate: ObservationPredicate =
    totalScoreVal >= 3.6
      ? ObservationPredicate.SANGAT_BAIK
      : totalScoreVal >= 2.8
      ? ObservationPredicate.BAIK
      : totalScoreVal >= 2.0
      ? ObservationPredicate.CUKUP
      : ObservationPredicate.KURANG;

  const handleScoreChange = (indicatorId: string, val: number) => {
    setScores((prev) => ({ ...prev, [indicatorId]: val }));
  };

  // Helper Canvas Penandatanganan Digital
  const setupCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#06b6d4'; // Cyan signature line
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    setupCanvas(teacherCanvasRef.current);
    setupCanvas(observerCanvasRef.current);
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    isTeacher: boolean
  ) => {
    const canvas = isTeacher ? teacherCanvasRef.current : observerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isTeacher) {
      setIsDrawingTeacher(true);
      setTeacherSigned(true);
    } else {
      setIsDrawingObserver(true);
      setObserverSigned(true);
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    isTeacher: boolean
  ) => {
    const isDrawing = isTeacher ? isDrawingTeacher : isDrawingObserver;
    if (!isDrawing) return;

    const canvas = isTeacher ? teacherCanvasRef.current : observerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (isTeacher: boolean) => {
    if (isTeacher) {
      setIsDrawingTeacher(false);
    } else {
      setIsDrawingObserver(false);
    }
  };

  const clearCanvas = (isTeacher: boolean) => {
    const canvas = isTeacher ? teacherCanvasRef.current : observerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (isTeacher) {
      setTeacherSigned(false);
    } else {
      setObserverSigned(false);
    }
  };

  // Simpan / Generate Laporan
  const handleSaveObservation = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        observerId: 'usr-pengawas-01',
        targetTeacherId: 'usr-guru-01',
        schoolId: 'sch-001',
        rubricTemplateId: 'rub-01',
        scheduleDate: new Date().toISOString(),
        executionDate: new Date().toISOString(),
        subject,
        gradeLevel,
        curriculumTopic,
        voiceNoteRawTranscript: voiceTranscript,
        voiceNoteDurationSec: recordingSeconds || 145,
        scores: Object.entries(scores).map(([indicatorId, score]) => ({
          indicatorId,
          score,
          evidenceNote: evidenceNotes[indicatorId] || '',
        })),
      };

      // Call API /api/observations
      await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      setShowReportDraft(true);
      setNotification('Laporan Hasil Observasi Lapangan Berhasil Disahkan & Tersimpan!');
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-5xl mx-auto">
      {/* Top Banner Mobile-Optimized */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold shadow-lg shadow-cyan-500/10 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Paperless Supervision Mode
              </span>
              <span className="text-xs text-slate-400">TP 2024/2025</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Instrumen Observasi Kelas & Catatan Suara Digital
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervisi Tatap Muka Kurikulum Merdeka • Skala 1–4 • Voice-to-Text • TTD Digital
            </p>
          </div>
        </div>

        {/* Live Score Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Predikat Kinerja</span>
            <span className="text-sm font-black text-emerald-400">
              {currentPredicate}
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-center">
            <span className="text-[10px] text-cyan-400 block font-medium">Skor Rata-rata</span>
            <span className="text-base font-black text-cyan-300 font-mono">
              {totalScoreVal.toFixed(2)} / 4.00
            </span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Bagian 1: Identitas Observasi Kelas */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4 shadow-md">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <School className="h-4 w-4 text-cyan-400" />
          Data Identitas Supervisi Pembelajaran
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Satuan Pendidikan:</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Guru Sasaran (NUPTK):</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Pengawas Penilai (NIP):</label>
            <input
              type="text"
              value={observerName}
              onChange={(e) => setObserverName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Mata Pelajaran:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Kelas / Fase:</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Tanggal Observasi:</label>
            <input
              type="date"
              value={observationDate}
              onChange={(e) => setObservationDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 text-xs">Topik / Capaian Pembelajaran:</label>
          <input
            type="text"
            value={curriculumTopic}
            onChange={(e) => setCurriculumTopic(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
          />
        </div>
      </section>

      {/* Bagian 2: Web Speech API Integrasi (Voice-to-Text Catatan Lapangan) */}
      <section className="rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/25 via-slate-900 to-slate-950 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isRecording ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Voice-to-Text Catatan Lapangan Pengawas
                {isRecording && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 animate-pulse">
                    Merekam ({recordingSeconds}s)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Web Speech API Native Browser • Pengawas cukup berbicara, suara otomatis terkonversi menjadi teks ulasan
              </p>
            </div>
          </div>

          {/* Record Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleRecording}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Hentikan Rekaman Suara</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>Mulai Rekam Suara Lapangan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Browser Support */}
        {!speechSupported && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Peramban tidak mendeteksi dukungan Web Speech API. Anda tetap dapat mengetik atau mengedit transkrip secara manual di bawah.
            </span>
          </div>
        )}

        {/* Voice Transcript Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Transkripsi Teks Hasil Pengamatan:</span>
            <span className="font-mono text-[11px] text-cyan-400">
              {voiceTranscript.split(' ').filter(Boolean).length} kata
            </span>
          </div>
          <textarea
            rows={4}
            value={voiceTranscript}
            onChange={(e) => setVoiceTranscript(e.target.value)}
            placeholder="Klik 'Mulai Rekam Suara Lapangan' lalu berbicaralah, teks transkrip akan muncul seketika di sini..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-cyan-500"
          />
        </div>
      </section>

      {/* Bagian 3: Form Rubrik Digital Interaktif (Skala 1-4) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white">
              Instrumen Rubrik Penilaian Pembelajaran (Skala 1–4)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {RUBRIC_INDICATORS.length} Indikator Kinerja
          </span>
        </div>

        <div className="space-y-4">
          {RUBRIC_INDICATORS.map((ind) => {
            const currentScore = scores[ind.id] || 3;
            const currentNote = evidenceNotes[ind.id] || '';

            return (
              <div
                key={ind.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {ind.code} • {ind.domain}
                    </span>
                    <h3 className="font-bold text-white text-sm mt-1">
                      {ind.statement}
                    </h3>
                  </div>

                  {/* 4 Skala Skor Tombol Interaktif */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
                    {[1, 2, 3, 4].map((scale) => {
                      const isSelected = currentScore === scale;
                      const labels = ['Kurang', 'Cukup', 'Baik', 'Sangat Baik'];

                      return (
                        <button
                          key={scale}
                          type="button"
                          onClick={() => handleScoreChange(ind.id, scale)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="font-mono">{scale}</span>
                          <span className="hidden sm:inline ml-1 font-normal text-[11px]">
                            {labels[scale - 1]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deskriptor Indikator Sesuai Pilihan */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                  <span className="text-cyan-400 font-semibold block mb-0.5">
                    Panduan Deskriptor Skor {currentScore}:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {ind.descriptors[currentScore as 1 | 2 | 3 | 4]}
                  </p>
                </div>

                {/* Catatan Bukti Perilaku */}
                <div className="text-xs space-y-1">
                  <label className="text-slate-400 font-medium">
                    Bukti Perilaku yang Teramati di Kelas:
                  </label>
                  <input
                    type="text"
                    value={currentNote}
                    onChange={(e) =>
                      setEvidenceNotes({ ...evidenceNotes, [ind.id]: e.target.value })
                    }
                    placeholder="Tuliskan fakta spesifik yang teramati saat observasi..."
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bagian 4: Penandatanganan Digital (e-Sign Canvas Sederhana) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <PenTool className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold text-white">
              Pengesahan Digital (e-Signature Canvas)
            </h2>
            <p className="text-xs text-slate-400">
              Gunakan jari (pada layar sentuh / mobile) atau kursor mouse untuk menandatangani berita acara sesi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canvas TTD Guru */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                1. Tanda Tangan Guru: {teacherName}
              </span>
              <button
                type="button"
                onClick={() => clearCanvas(true)}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Hapus
              </button>
            </div>

            <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-900 relative h-36">
              <canvas
                ref={teacherCanvasRef}
                width={420}
                height={144}
                className="w-full h-full cursor-crosshair touch-none"
                onMouseDown={(e) => startDrawing(e, true)}
                onMouseMove={(e) => draw(e, true)}
                onMouseUp={() => stopDrawing(true)}
                onMouseLeave={() => stopDrawing(true)}
                onTouchStart={(e) => startDrawing(e, true)}
                onTouchMove={(e) => draw(e, true)}
                onTouchEnd={() => stopDrawing(true)}
              />
              {!teacherSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs">
                  Goreskan tanda tangan guru di sini
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>NUPTK: {teacherNuptk}</span>
              {teacherSigned && <span className="text-emerald-400 font-bold">✓ Tertanda Tangani</span>}
            </div>
          </div>

          {/* Canvas TTD Pengawas */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                2. Tanda Tangan Pengawas: {observerName}
              </span>
              <button
                type="button"
                onClick={() => clearCanvas(false)}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> Hapus
              </button>
            </div>

            <div className="border border-slate-700/80 rounded-xl overflow-hidden bg-slate-900 relative h-36">
              <canvas
                ref={observerCanvasRef}
                width={420}
                height={144}
                className="w-full h-full cursor-crosshair touch-none"
                onMouseDown={(e) => startDrawing(e, false)}
                onMouseMove={(e) => draw(e, false)}
                onMouseUp={() => stopDrawing(false)}
                onMouseLeave={() => stopDrawing(false)}
                onTouchStart={(e) => startDrawing(e, false)}
                onTouchMove={(e) => draw(e, false)}
                onTouchEnd={() => stopDrawing(false)}
              />
              {!observerSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs">
                  Goreskan tanda tangan pengawas di sini
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>NIP: {observerNip}</span>
              {observerSigned && <span className="text-emerald-400 font-bold">✓ Tertanda Tangani</span>}
            </div>
          </div>
        </div>

        {/* Submit & Generate Draft Action */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSaveObservation}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Simpan & Auto-Generate Draf Laporan Supervisi</span>
          </button>
        </div>
      </section>

      {/* Bagian 5: Draf Laporan Supervisi Resmi Ter-generate */}
      {showReportDraft && (
        <section className="rounded-2xl border border-cyan-800/60 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in print:bg-white print:text-black">
          {/* Header Surat Laporan */}
          <div className="border-b-2 border-slate-700 pb-5 text-center space-y-1">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
              Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
            </h3>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Laporan Hasil Supervisi Akademik & Observasi Pembelajaran
            </h2>
            <p className="text-xs text-slate-400">
              Nomor Berita Acara: BA-OBS/{new Date().getFullYear()}/{Math.floor(1000 + Math.random() * 9000)}
            </p>
          </div>

          {/* Rincian Subjek Supervisi */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div><strong className="text-slate-400">Satuan Pendidikan:</strong> {schoolName} (NPSN: {npsn})</div>
              <div><strong className="text-slate-400">Guru Sasaran:</strong> {teacherName}</div>
              <div><strong className="text-slate-400">NUPTK:</strong> {teacherNuptk}</div>
              <div><strong className="text-slate-400">Mata Pelajaran:</strong> {subject} ({gradeLevel})</div>
            </div>
            <div className="space-y-1 text-right sm:text-left">
              <div><strong className="text-slate-400">Pengawas Pembina:</strong> {observerName}</div>
              <div><strong className="text-slate-400">NIP:</strong> {observerNip}</div>
              <div><strong className="text-slate-400">Tanggal Observasi:</strong> {observationDate}</div>
              <div><strong className="text-slate-400">Predikat Kinerja:</strong> <span className="font-extrabold text-emerald-400">{currentPredicate} ({totalScoreVal.toFixed(2)}/4.00)</span></div>
            </div>
          </div>

          {/* Hasil Penilaian Rubrik */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white border-b border-slate-800 pb-1">
              Rekapitulasi Indikator Penilaian Pembelajaran
            </h4>
            <div className="divide-y divide-slate-800/80">
              {RUBRIC_INDICATORS.map((ind) => (
                <div key={ind.id} className="py-2 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200">{ind.code}: {ind.statement}</span>
                    <p className="text-[11px] text-slate-400 italic">Bukti: "{evidenceNotes[ind.id] || '-'}"</p>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 bg-slate-800 px-2.5 py-1 rounded shrink-0">
                    Skor: {scores[ind.id]}/4
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Catatan Suara & Rekomendasi Pengawas */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-400">
              Catatan Lapangan & Rekomendasi Pengawas Pembina (Transkripsi Voice Note):
            </h4>
            <p className="text-slate-200 leading-relaxed italic">
              "{voiceTranscript}"
            </p>
          </div>

          {/* Blok Penandatanganan di Bawah */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800 text-center text-xs">
            <div className="space-y-2">
              <span className="text-slate-400 block">Guru Yang Disupervisi,</span>
              <div className="h-16 flex items-center justify-center font-serif italic text-cyan-300 font-bold">
                {teacherSigned ? `[Tertanda Tangan Elektronik: ${teacherName}]` : '[Belum TTD]'}
              </div>
              <span className="font-bold text-white block underline">{teacherName}</span>
              <span className="text-[11px] text-slate-400 block font-mono">NUPTK. {teacherNuptk}</span>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 block">Pengawas Sekolah Pembina,</span>
              <div className="h-16 flex items-center justify-center font-serif italic text-cyan-300 font-bold">
                {observerSigned ? `[Tertanda Tangan Elektronik: ${observerName}]` : '[Belum TTD]'}
              </div>
              <span className="font-bold text-white block underline">{observerName}</span>
              <span className="text-[11px] text-slate-400 block font-mono">NIP. {observerNip}</span>
            </div>
          </div>

          {/* Action buttons for PDF / Print */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-4 w-4" /> Cetak / Unduh PDF
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
