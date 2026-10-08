import React, { useState } from 'react';
import {
  ObservationPredicate,
  UserRole,
  ObservationWithDetails,
} from '../types';
import { MOCK_OBSERVATIONS } from '../data/mockData';
import {
  Mic,
  Play,
  Pause,
  Award,
  CheckCircle2,
  Calendar,
  UserCheck,
  FileCheck2,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface ObservationsViewProps {
  currentRole: UserRole;
  onNavigateTab?: (tab: string) => void;
}

export const ObservationsView: React.FC<ObservationsViewProps> = ({ currentRole, onNavigateTab }) => {
  const [observation, setObservation] = useState<ObservationWithDetails>(MOCK_OBSERVATIONS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [scores, setScores] = useState<Record<string, number>>({
    'ind-01': 4,
    'ind-02': 4,
    'ind-03': 4,
    'ind-04': 3,
  });

  // Calculate dynamic average score and predicate
  const totalScoreVal =
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;

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

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4" /> Supervisi & Penilaian Observasi Kelas
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Rubrik Penilaian Kinerja Guru & Rekaman Suara (Voice Note)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrasi speech-to-text otomatis, rubrik Kurikulum Merdeka 4-level, dan predikat mutu objektif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('observasi-lapangan')}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2"
            >
              <span>📝 Buka Form Lapangan Paperless</span>
            </button>
          )}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Predikat Kinerja</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {currentPredicate}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-800 text-center">
            <span className="text-[10px] text-cyan-400 block font-medium">Skor Rata-rata</span>
            <span className="text-sm font-extrabold text-cyan-300 font-mono">
              {totalScoreVal.toFixed(2)} / 4.00
            </span>
          </div>
        </div>
      </div>

      {/* Observation Meta Info Card */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block">Guru yang Diobservasi</span>
          <span className="font-bold text-white text-sm mt-0.5 block">
            {observation.targetTeacher.name}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            NUPTK: {observation.targetTeacher.nuptk}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Pengawas Penilai</span>
          <span className="font-bold text-white text-sm mt-0.5 block">
            {observation.observer.name}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            NIP: {observation.observer.nip}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Mata Pelajaran & Kelas</span>
          <span className="font-bold text-slate-200 mt-0.5 block">
            {observation.subject} • {observation.gradeLevel}
          </span>
          <span className="text-[11px] text-cyan-400 line-clamp-1">
            {observation.curriculumTopic}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block">Tanggal Pelaksanaan</span>
          <span className="font-bold text-slate-200 mt-0.5 block">
            03 Oktober 2026 (08:15 WIB)
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Berita Acara Ditandatangani
          </span>
        </div>
      </div>

      {/* Voice Note & Speech-to-Text Player Section */}
      <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Mic className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-white text-sm">
                Catatan Suara Pengawas (Supervisory Voice Note)
              </h3>
              <p className="text-xs text-slate-400">
                Direkam langsung di ruang kelas saat supervisi • Transkripsi AI Akurasi 96%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-700">
              Durasi: 02:25 Menit
            </span>
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="h-10 w-10 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-cyan-600/30 transition-transform active:scale-95"
          >
            {isPlayingAudio ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{isPlayingAudio ? '00:51' : '00:00'}</span>
              <span>02:25</span>
            </div>
            {/* Waveform graphic bars */}
            <div className="flex items-center gap-1 h-6">
              {[40, 65, 30, 80, 95, 60, 45, 90, 75, 55, 35, 85, 90, 70, 50, 65, 80, 40, 60, 75, 90, 55, 45, 80, 60].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all ${
                    i < 10
                      ? 'bg-cyan-400'
                      : isPlayingAudio
                      ? 'bg-cyan-600/60 animate-pulse'
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Transcript Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Hasil Transkripsi Teks (Speech-to-Text):
            </span>
            <span className="text-[11px] text-slate-500">Keyakinan AI: 96.0%</span>
          </div>
          <p className="text-slate-200 leading-relaxed italic">
            "{observation.voiceNoteTranscript}"
          </p>
        </div>
      </div>

      {/* Rubric Evaluation Domains & Indicators */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base">
          Pengisian Rubrik Observasi Pembelajaran (Kurikulum Merdeka)
        </h3>

        {observation.rubricTemplate.domains.map((domain) => (
          <div
            key={domain.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
          >
            <div className="border-b border-slate-800 pb-2">
              <h4 className="font-bold text-sm text-cyan-300">
                {domain.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {domain.description}
              </p>
            </div>

            <div className="space-y-4">
              {domain.indicators.map((ind) => {
                const currentScore = scores[ind.id] || 3;
                return (
                  <div
                    key={ind.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {ind.code}
                        </span>
                        <p className="font-semibold text-slate-100 text-sm mt-1">
                          {ind.statement}
                        </p>
                      </div>

                      {/* 4-Scale Score Buttons */}
                      <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0">
                        {[1, 2, 3, 4].map((scale) => {
                          const isSelected = currentScore === scale;
                          const labels = ['Kurang', 'Cukup', 'Baik', 'Sangat Baik'];
                          return (
                            <button
                              key={scale}
                              onClick={() => handleScoreChange(ind.id, scale)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                isSelected
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {scale} - {labels[scale - 1]}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Level Guidance text based on selected score */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                      <span className="font-semibold text-cyan-400">
                        Panduan Deskriptor Skor {currentScore}:{' '}
                      </span>
                      {currentScore === 1 && ind.guidanceTextLevel1}
                      {currentScore === 2 && ind.guidanceTextLevel2}
                      {currentScore === 3 && ind.guidanceTextLevel3}
                      {currentScore === 4 && ind.guidanceTextLevel4}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
