import React, { useState } from 'react';
import {
  IntegrationSource,
  SyncStatus,
  SyncType,
  IntegrationSyncLog,
  UserRole,
} from '../types';
import { MOCK_SYNC_LOGS, MOCK_RAPOR_PENDIDIKAN } from '../data/mockData';
import {
  RefreshCw,
  Database,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  Server,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface IntegrationSyncViewProps {
  currentRole: UserRole;
}

export const IntegrationSyncView: React.FC<IntegrationSyncViewProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState<IntegrationSyncLog[]>(MOCK_SYNC_LOGS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [activeSyncSystem, setActiveSyncSystem] = useState<IntegrationSource | null>(null);

  const handleTriggerSync = (source: IntegrationSource) => {
    setIsSyncing(true);
    setActiveSyncSystem(source);
    setSyncProgress(15);

    setTimeout(() => setSyncProgress(45), 600);
    setTimeout(() => setSyncProgress(85), 1400);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);

      const newLog: IntegrationSyncLog = {
        id: `log-${Date.now()}`,
        sourceSystem: source,
        syncType: SyncType.MANUAL_TRIGGER,
        status: SyncStatus.SUCCESS,
        triggeredById: 'usr-current',
        startedAt: new Date(Date.now() - 3200).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: 3200,
        totalRecordsFetched: source === IntegrationSource.DAPODIK ? 540 : 28,
        totalRecordsSynced: source === IntegrationSource.DAPODIK ? 540 : 28,
        totalErrors: 0,
        syncSummaryPayload: {
          manualTriggered: true,
          triggeredByRole: currentRole,
          timestamp: new Date().toISOString(),
          status: 'OK 200 SUCCESS',
        },
        errorDetails: null,
        endpointUrl: `https://api.kemdikbud.go.id/${source.toLowerCase()}/v2/sync`,
        ipAddress: '10.24.120.18',
      };

      setLogs([newLog, ...logs]);
      setActiveSyncSystem(null);
    }, 2100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Server className="h-4 w-4" /> Integrasi Eksternal & ETL Sync Engine
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Sinkronisasi Dapodik, Rapor Pendidikan & Platform Merdeka Mengajar (PMM)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Menyerap data master PTK, nilai rapor mutu otomatis, dan rekam jejak pelatihan guru PMM.
          </p>
        </div>

        {isSyncing && (
          <div className="px-4 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold flex items-center gap-2.5">
            <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
            <span>Sinkronisasi {activeSyncSystem} ({syncProgress}%)</span>
          </div>
        )}
      </div>

      {/* 3 Source Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dapodik */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" /> DAPODIK Kemdikbud
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Terhubung (Aktif)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sinkronisasi data sekolah, NIP/NUPTK guru, data rombongan belajar, dan jumlah murid per semester.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Terakhir Sinkron:</span>
              <span className="text-slate-200 font-mono">07 Okt 02:04 WIB</span>
            </div>
            <button
              onClick={() => handleTriggerSync(IntegrationSource.DAPODIK)}
              disabled={isSyncing}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && activeSyncSystem === IntegrationSource.DAPODIK ? 'animate-spin' : ''}`} />
              Tarik Data Dapodik Sekarang
            </button>
          </div>
        </div>

        {/* Rapor Pendidikan */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" /> Rapor Pendidikan
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Terhubung (Aktif)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penarikan otomatis indikator ANBK (Literasi, Numerasi, Karakter, Iklim Keamanan) & rekomendasi Benahi.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Terakhir Sinkron:</span>
              <span className="text-slate-200 font-mono">06 Okt 18:31 WIB</span>
            </div>
            <button
              onClick={() => handleTriggerSync(IntegrationSource.RAPOR_PENDIDIKAN)}
              disabled={isSyncing}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && activeSyncSystem === IntegrationSource.RAPOR_PENDIDIKAN ? 'animate-spin' : ''}`} />
              Update Rapor Pendidikan
            </button>
          </div>
        </div>

        {/* PMM */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-400" /> Platform PMM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                Terhubung (Aktif)
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pemantauan pengelolaan kinerja guru, perencanaan RHK, modul pelatihan mandiri, dan sertifikat aksi nyata.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Terakhir Sinkron:</span>
              <span className="text-slate-200 font-mono">05 Okt 14:11 WIB</span>
            </div>
            <button
              onClick={() => handleTriggerSync(IntegrationSource.PMM)}
              disabled={isSyncing}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && activeSyncSystem === IntegrationSource.PMM ? 'animate-spin' : ''}`} />
              Sinkron Kinerja Guru PMM
            </button>
          </div>
        </div>
      </div>

      {/* Sync Log Audit History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">
              Log Audit Riwayat Sinkronisasi Sistem (`integration_sync_logs`)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Setiap panggilan API eksternal dicatat lengkap dengan durasi eksekusi dan summary payload.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{logs.length} Log Tercatat</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Sistem Sumber</th>
                <th className="py-3 px-4">Tipe Sinkronisasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Data Tersinkron</th>
                <th className="py-3 px-4">Durasi Eksekusi</th>
                <th className="py-3 px-4">Waktu Mulai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">
                    {log.sourceSystem}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {log.syncType}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {log.totalRecordsSynced} / {log.totalRecordsFetched} records
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {log.durationMs ? `${(log.durationMs / 1000).toFixed(2)} detik` : '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.startedAt).toLocaleString('id-ID', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
