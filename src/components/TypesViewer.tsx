import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { UserRole, ROLE_CAPABILITIES, PermissionAction } from '../types';

interface TypesViewerProps {
  rawTypesCode: string;
}

export const TypesViewer: React.FC<TypesViewerProps> = ({ rawTypesCode }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'CODE' | 'RBAC'>('CODE');

  const allActions: { key: PermissionAction; label: string; desc: string }[] = [
    { key: 'VIEW_REGIONAL_HEATMAP', label: 'Lihat Heatmap Regional', desc: 'Akses peta mutu & risiko sekolah' },
    { key: 'EXPORT_DINAS_ANALYTICS', label: 'Ekspor Data Dinas', desc: 'Unduh laporan agregat mutu' },
    { key: 'ASSIGN_PENGAWAS', label: 'Penugasan Pengawas', desc: 'Penerbitan SK sekolah binaan' },
    { key: 'MANAGE_RUBRIC_TEMPLATES', label: 'Kelola Templat Rubrik', desc: 'Konfigurasi instrumen penilaian' },
    { key: 'CONDUCT_SUPERVISION', label: 'Lakukan Supervisi', desc: 'Pelaksanaan observasi kelas/sekolah' },
    { key: 'SUBMIT_VOICE_NOTE', label: 'Voice Note Pengawas', desc: 'Audio rekaman & transkrip otomatis' },
    { key: 'REVIEW_DOCUMENTS', label: 'Telaah Dokumen', desc: 'Pemberian catatan dan komentar berkas' },
    { key: 'APPROVE_DOCUMENTS', label: 'Sahkan Dokumen', desc: 'Verifikasi & pengesahan KOSP/RKAS' },
    { key: 'UPLOAD_KOSP', label: 'Unggah KOSP', desc: 'Kurikulum Operasional Satuan' },
    { key: 'UPLOAD_RKAS', label: 'Unggah RKAS', desc: 'Rencana Anggaran & Belanja BOS' },
    { key: 'UPLOAD_MODUL_AJAR', label: 'Unggah Modul Ajar', desc: 'Perangkat pembelajaran berdiferensiasi' },
    { key: 'BOOK_VIRTUAL_CLINIC', label: 'Booking Klinik Pengawas', desc: 'Pengajuan sesi bimbingan klinis' },
    { key: 'HOST_VIRTUAL_CLINIC', label: 'Host Klinik Pengawas', desc: 'Memandu sesi coaching 1-on-1' },
    { key: 'WRITE_TEACHER_REFLECTION', label: 'Jurnal Refleksi Guru', desc: 'Catatan mingguan guru mata pelajaran' },
    { key: 'WRITE_HEADMASTER_REFLECTION', label: 'Jurnal Refleksi Kepsek', desc: 'Evaluasi manajerial & budaya kombel' },
    { key: 'TRIGGER_DAPODIK_SYNC', label: 'Sinkronisasi Dapodik', desc: 'Tarik data guru, siswa, rombel' },
    { key: 'TRIGGER_PMM_SYNC', label: 'Sinkronisasi PMM', desc: 'Tarik aksi nyata & sertifikat pelatihan' },
    { key: 'VIEW_RAPOR_PENDIDIKAN', label: 'Lihat Rapor Pendidikan', desc: 'Analisis capaian literasi & numerasi' },
  ];

  const roles = [
    UserRole.PENGAWAS,
    UserRole.KEPALA_SEKOLAH,
    UserRole.GURU,
    UserRole.DINAS_PENDIDIKAN,
    UserRole.SUPER_ADMIN,
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(rawTypesCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([rawTypesCode], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'types_index.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Code2 className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                TypeScript Interfaces & Types (`types/index.ts`)
              </h1>
              <p className="text-sm text-slate-400">
                Kontrak Type-Safe Lengkap: Enums, Domain Models, DTO Payloads, dan RBAC Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-colors shadow-sm"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin types/index.ts'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/20"
            >
              <Download className="h-4 w-4" />
              <span>Unduh .ts</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('CODE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CODE'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            Kode Sumber Lengkap (types/index.ts)
          </button>
          <button
            onClick={() => setActiveTab('RBAC')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'RBAC'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Matriks Hak Akses (RBAC Matrix)
          </button>
        </div>
      </div>

      {activeTab === 'CODE' ? (
        /* Full TypeScript Code Block */
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-semibold text-slate-300 ml-2">
                types/index.ts (100% Utuh & Komprehensif)
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs leading-relaxed text-slate-300 selection:bg-purple-900/60 selection:text-white">
            <pre className="whitespace-pre">
              {rawTypesCode}
            </pre>
          </div>
        </div>
      ) : (
        /* Role Permissions Matrix Table */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">
              Matriks Izin Operasional Berbasis Peran (RBAC Matrix)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Menjamin kepatuhan data governance antara Pengawas, Kepala Sekolah, Guru, dan Dinas Pendidikan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-72">Aksi / Operasi Sistem</th>
                  {roles.map((role) => (
                    <th key={role} className="py-3 px-4 text-center">
                      <span className="font-bold text-white block">
                        {ROLE_CAPABILITIES[role]?.title.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {allActions.map((action) => (
                  <tr key={action.key} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">
                        {action.label}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {action.desc}
                      </div>
                    </td>
                    {roles.map((role) => {
                      const allowed = ROLE_CAPABILITIES[role]?.allowedActions.includes(action.key);
                      return (
                        <td key={role} className="py-3 px-4 text-center">
                          {allowed ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-800/80 text-slate-600">
                              <XCircle className="h-4 w-4" />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
