import React, { useState } from 'react';
import {
  ClinicType,
  ClinicStatus,
  UserRole,
  VirtualClinicWithParties,
} from '../types';
import { MOCK_CLINIC_BOOKINGS, MOCK_USERS } from '../data/mockData';
import {
  Video,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle,
  Plus,
  Send,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface VirtualClinicViewProps {
  currentRole: UserRole;
}

export const VirtualClinicView: React.FC<VirtualClinicViewProps> = ({ currentRole }) => {
  const [clinics, setClinics] = useState<VirtualClinicWithParties[]>(MOCK_CLINIC_BOOKINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [clinicType, setClinicType] = useState<ClinicType>(ClinicType.INDIVIDUAL_COACHING);
  const [scheduledDate, setScheduledDate] = useState('2026-10-15T10:00');
  const [notification, setNotification] = useState<string | null>(null);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const user = MOCK_USERS[currentRole];
    const newBooking: VirtualClinicWithParties = {
      id: `cln-${Date.now()}`,
      bookingCode: `KLINIK-202410-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterId: user.id,
      pengawasId: 'usr-pengawas-01',
      schoolId: 'sch-001',
      clinicType,
      topic,
      description,
      scheduledAt: new Date(scheduledDate).toISOString(),
      durationMinutes: 45,
      meetingPlatform: 'Google Meet',
      meetingJoinUrl: 'https://meet.google.com/new-session-pengawas',
      meetingPasscode: 'SIWAS2026',
      status: ClinicStatus.CONFIRMED,
      rejectionReason: null,
      discussionSummary: null,
      actionItems: ['Menyiapkan bahan diskusi sebelum sesi berlangsung'],
      followUpDate: null,
      satisfactionRating: null,
      feedbackNote: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requester: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phoneNumber: user.phoneNumber,
      },
      pengawas: {
        id: 'usr-pengawas-01',
        name: 'Drs. H. Suryadi, M.Pd.',
        nip: '197405121998021003',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phoneNumber: '0812-9876-5432',
      },
      school: {
        id: 'sch-001',
        name: 'SMAN 1 Nusantara Jakarta',
        npsn: '20101456',
        level: 'SMA' as any,
        kecamatan: 'Pulo Gadung',
      },
    };

    setClinics([newBooking, ...clinics]);
    setIsModalOpen(false);
    setTopic('');
    setDescription('');
    setNotification('Sesi Klinik Virtual berhasil dijadwalkan!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Video className="h-4 w-4" /> Bimbingan & Konsultasi Jarak Jauh
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Klinik Virtual Pengawas (Virtual Clinic Bookings)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Layanan coaching interaktif 1-on-1 antara Pengawas Pembina dengan Guru & Kepala Sekolah.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notification && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {notification}
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-lg shadow-cyan-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Booking Klinik Baru</span>
          </button>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-sm">
          Jadwal Klinik Aktif & Riwayat Bimbingan ({clinics.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {clinic.clinicType}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {clinic.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">
                    {clinic.topic}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {clinic.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Pemohon:</span>
                    <span className="font-semibold text-slate-200">{clinic.requester.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Pengawas:</span>
                    <span className="font-semibold text-slate-200">{clinic.pengawas.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5 font-mono text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    {new Date(clinic.scheduledAt).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                  <span>{clinic.durationMinutes} Menit</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href={clinic.meetingJoinUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  <Video className="h-4 w-4" />
                  Masuk Google Meet ({clinic.meetingPlatform})
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-cyan-400" />
                Form Pengajuan Klinik Virtual
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Jenis Layanan Klinik:
                </label>
                <select
                  value={clinicType}
                  onChange={(e) => setClinicType(e.target.value as ClinicType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={ClinicType.INDIVIDUAL_COACHING}>Coaching 1-on-1</option>
                  <option value={ClinicType.KLINIK_KOSP}>Klinik Kurikulum (KOSP)</option>
                  <option value={ClinicType.KLINIK_RKAS}>Klinik Anggaran & RKAS</option>
                  <option value={ClinicType.SUPERVISI_KLINIS}>Supervisi Klinis Pembelajaran</option>
                  <option value={ClinicType.BEDAH_RAPOR_PENDIDIKAN}>Bedah Rapor Pendidikan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Topik / Pokok Bahasan:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskusi Rubrik Asesmen Diagnostik Numerasi..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deskripsi & Kebutuhan Bimbingan:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan kendala konkret yang ingin dibahas bersama pengawas pembina..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Waktu & Tanggal Sesi:
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30"
                >
                  Ajukan Jadwal Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
