import {
  IntegrationSource,
  SyncStatus,
  SyncType,
  IntegrationSyncLog,
  SchoolRaporPendidikan,
  TeacherPmmProgress,
} from '../../../types';

/**
 * Next.js Route Handler: app/api/integrations/route.ts
 * Simulasi Sync Data dari API Dapodik, Rapor Pendidikan, dan PMM
 * Standard Next.js App Router (GET & POST)
 */

interface SyncRequestBody {
  sourceSystem: IntegrationSource;
  syncType: SyncType;
  schoolId?: string;
  schoolNpsn?: string;
  academicYear?: string;
  semester?: number;
  triggeredById?: string;
  forceRefresh?: boolean;
}

// Simulasi in-memory sync log history
const syncLogsHistory: IntegrationSyncLog[] = [
  {
    id: 'log-hist-001',
    sourceSystem: IntegrationSource.DAPODIK,
    syncType: SyncType.SCHEDULED_FULL,
    status: SyncStatus.SUCCESS,
    triggeredById: 'system-scheduler',
    startedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 12 + 252000).toISOString(),
    durationMs: 252000,
    totalRecordsFetched: 1420,
    totalRecordsSynced: 1420,
    totalErrors: 0,
    syncSummaryPayload: {
      message: 'Sinkronisasi berkala Dapodik wilayah berhasil',
      schoolsUpdated: 24,
      teachersSynced: 512,
      studentsCount: 14250,
      semester: '2024/2025 Ganjil',
      apiVersion: 'v3.2.0-dapodik-prod',
    },
    errorDetails: null,
    endpointUrl: 'https://api.kemdikbud.go.id/dapodik/v3/sync/batch',
    ipAddress: '10.24.120.4',
  },
  {
    id: 'log-hist-002',
    sourceSystem: IntegrationSource.RAPOR_PENDIDIKAN,
    syncType: SyncType.INCREMENTAL,
    status: SyncStatus.SUCCESS,
    triggeredById: 'usr-dinas-01',
    startedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 6 + 105000).toISOString(),
    durationMs: 105000,
    totalRecordsFetched: 24,
    totalRecordsSynced: 24,
    totalErrors: 0,
    syncSummaryPayload: {
      message: 'Penarikan indikator mutu Rapor Pendidikan Satuan Pendidikan',
      academicYear: '2024',
      indicatorsUpdated: [
        'A.1 Kemampuan Literasi',
        'A.2 Kemampuan Numerasi',
        'A.3 Karakter',
        'D.4 Iklim Keamanan Belajar',
        'D.8 Iklim Kebinekaan',
        'D.1 Kualitas Pembelajaran',
        'D.3 Kepemimpinan Instruksional',
      ],
      apiVersion: 'v2.1-rapor-pendidikan-gateway',
    },
    errorDetails: null,
    endpointUrl: 'https://raporpendidikan.kemdikbud.go.id/api/v2/satuan-pendidikan/wilayah',
    ipAddress: '10.24.120.5',
  },
  {
    id: 'log-hist-003',
    sourceSystem: IntegrationSource.PMM,
    syncType: SyncType.MANUAL_TRIGGER,
    status: SyncStatus.SUCCESS,
    triggeredById: 'usr-pengawas-01',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2 + 75000).toISOString(),
    durationMs: 75000,
    totalRecordsFetched: 68,
    totalRecordsSynced: 68,
    totalErrors: 0,
    syncSummaryPayload: {
      message: 'Sinkronisasi pengelolaan kinerja guru & aksi nyata PMM',
      schoolNpsn: '20101456',
      totalAksiNyataDivalidasi: 42,
      sertifikatBaru: 14,
      guruTerverifikasi: 68,
      apiVersion: 'v1.4.0-guru-kemdikbud-pmm',
    },
    errorDetails: null,
    endpointUrl: 'https://guru.kemdikbud.go.id/api/v1/pengelolaan-kinerja/guru',
    ipAddress: '10.24.120.9',
  },
];

/**
 * Helper generator data Rapor Pendidikan per sekolah
 */
function generateMockRaporPendidikan(schoolId: string, academicYear: string): SchoolRaporPendidikan {
  return {
    id: `rp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    schoolId: schoolId || 'sch-001',
    academicYear: academicYear || '2024',
    capaianLiterasi: 88.4,
    kategoriLiterasi: 'Mahir (Mencapai Standar Tertinggi)',
    capaianNumerasi: 81.2,
    kategoriNumerasi: 'Cakap',
    iklimKeamananBelajar: 86.8,
    iklimKebhinekaan: 91.5,
    kualitasPembelajaran: 82.0,
    kepemimpinanInstruksional: 78.4,
    penyerapanAnggaranRkas: 94.2,
    prioritasRekomendasi: [
      'Peningkatan kompetensi guru dalam menyusun asesmen diagnostik numerasi',
      'Penguatan program bimbingan guru dan supervisi klinis pengawas pembina',
      'Penyediaan referensi bacaan ilmiah terapan di perpustakaan digital sekolah',
      'Peningkatan pemanfaatan Platform Merdeka Mengajar (PMM) dalam komunitas belajar',
    ],
    syncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Helper generator data PMM Guru
 */
function generateMockPmmProgress(schoolId: string): TeacherPmmProgress[] {
  return [
    {
      id: `pmm-prog-01`,
      userId: 'usr-guru-01',
      schoolId: schoolId || 'sch-001',
      nuptk: '7482910482910381',
      totalTopikPelatihan: 8,
      topikDiselesaikan: 6,
      aksiNyataDivalidasi: 42,
      sertifikatDiperoleh: 14,
      terakhirAksesPmm: new Date().toISOString(),
      statusKinerjaPmm: 'RHK Disetujui Kepala Sekolah & Siap Observasi',
      syncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: `pmm-prog-02`,
      userId: 'usr-guru-02',
      schoolId: schoolId || 'sch-001',
      nuptk: '8392019482710492',
      totalTopikPelatihan: 6,
      topikDiselesaikan: 4,
      aksiNyataDivalidasi: 28,
      sertifikatDiperoleh: 9,
      terakhirAksesPmm: new Date(Date.now() - 86400000).toISOString(),
      statusKinerjaPmm: 'Menunggu Pengunggahan Bukti Karya',
      syncedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

/**
 * GET Handler: Mengambil status koneksi sistem & riwayat sinkronisasi
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    let filteredLogs = [...syncLogsHistory];

    if (source) {
      filteredLogs = filteredLogs.filter(
        (log) => log.sourceSystem.toUpperCase() === source.toUpperCase()
      );
    }

    filteredLogs = filteredLogs.slice(0, limit);

    const integrationStatuses = {
      dapodik: {
        source: IntegrationSource.DAPODIK,
        status: 'CONNECTED',
        name: 'DAPODIK (Data Pokok Pendidikan)',
        lastSync: syncLogsHistory.find((l) => l.sourceSystem === IntegrationSource.DAPODIK)?.completedAt || null,
        endpoint: 'https://api.kemdikbud.go.id/dapodik/v3/sync/batch',
        healthCheck: 'UP (HTTP 200 OK)',
        totalRecords: 1420,
      },
      raporPendidikan: {
        source: IntegrationSource.RAPOR_PENDIDIKAN,
        status: 'CONNECTED',
        name: 'Rapor Pendidikan Indonesia (Kemendikbudristek)',
        lastSync: syncLogsHistory.find((l) => l.sourceSystem === IntegrationSource.RAPOR_PENDIDIKAN)?.completedAt || null,
        endpoint: 'https://raporpendidikan.kemdikbud.go.id/api/v2/satuan-pendidikan/wilayah',
        healthCheck: 'UP (HTTP 200 OK)',
        totalRecords: 24,
      },
      pmm: {
        source: IntegrationSource.PMM,
        status: 'CONNECTED',
        name: 'Platform Merdeka Mengajar (PMM)',
        lastSync: syncLogsHistory.find((l) => l.sourceSystem === IntegrationSource.PMM)?.completedAt || null,
        endpoint: 'https://guru.kemdikbud.go.id/api/v1/pengelolaan-kinerja/guru',
        healthCheck: 'UP (HTTP 200 OK)',
        totalRecords: 68,
      },
    };

    return Response.json(
      {
        success: true,
        message: 'Data integrasi berhasil diambil',
        data: {
          integrations: integrationStatuses,
          totalLogs: syncLogsHistory.length,
          logs: filteredLogs,
        },
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: 'Gagal mengambil riwayat integrasi data',
        error: error?.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

/**
 * POST Handler: Memicu sinkronisasi data (ETL Simulation)
 */
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    let body: SyncRequestBody;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: 'Format request body tidak valid (harus berupa JSON)',
        },
        { status: 400 }
      );
    }

    // Validasi Field Wajib
    if (!body.sourceSystem) {
      return Response.json(
        {
          success: false,
          message: 'Field "sourceSystem" wajib diisi (DAPODIK | RAPOR_PENDIDIKAN | PMM | SIAP_SEKOLAH)',
        },
        { status: 400 }
      );
    }

    const validSources = Object.values(IntegrationSource);
    if (!validSources.includes(body.sourceSystem)) {
      return Response.json(
        {
          success: false,
          message: `Nilai "sourceSystem" tidak valid. Pilihan yang tersedia: ${validSources.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const syncType = body.syncType || SyncType.MANUAL_TRIGGER;
    const academicYear = body.academicYear || '2024/2025';
    const schoolId = body.schoolId || 'sch-001';
    const schoolNpsn = body.schoolNpsn || '20101456';
    const triggeredById = body.triggeredById || 'current-user-session';

    // Eksekusi Simulasi Sinkronisasi sesuai Sumber Data
    let totalFetched = 0;
    let totalSynced = 0;
    let totalErrors = 0;
    let summaryPayload: Record<string, unknown> = {};
    let endpointUrl = '';
    let extraData: Record<string, unknown> = {};

    switch (body.sourceSystem) {
      case IntegrationSource.DAPODIK:
        endpointUrl = 'https://api.kemdikbud.go.id/dapodik/v3/sync/batch';
        totalFetched = 540;
        totalSynced = 540;
        totalErrors = 0;
        summaryPayload = {
          syncMode: syncType,
          schoolNpsn,
          academicYear,
          satuanPendidikan: 'SMAN 1 Nusantara Jakarta',
          pendidikDanTenagaKependidikan: 68,
          rombonganBelajar: 30,
          pesertaDidikAktif: 1042,
          saranaPrasaranaRuang: 48,
          timestamp: new Date().toISOString(),
          statusKoneksi: '200 OK Verified with Pusdatin Kemendikbud',
        };
        break;

      case IntegrationSource.RAPOR_PENDIDIKAN:
        endpointUrl = 'https://raporpendidikan.kemdikbud.go.id/api/v2/satuan-pendidikan/wilayah';
        totalFetched = 28;
        totalSynced = 28;
        totalErrors = 0;
        const raporResult = generateMockRaporPendidikan(schoolId, academicYear.split('/')[0]);
        summaryPayload = {
          syncMode: syncType,
          schoolId,
          academicYear: raporResult.academicYear,
          capaianLiterasi: raporResult.capaianLiterasi,
          kategoriLiterasi: raporResult.kategoriLiterasi,
          capaianNumerasi: raporResult.capaianNumerasi,
          kategoriNumerasi: raporResult.kategoriNumerasi,
          iklimKeamananBelajar: raporResult.iklimKeamananBelajar,
          iklimKebhinekaan: raporResult.iklimKebhinekaan,
          kualitasPembelajaran: raporResult.kualitasPembelajaran,
          kepemimpinanInstruksional: raporResult.kepemimpinanInstruksional,
          penyerapanAnggaranRkas: raporResult.penyerapanAnggaranRkas,
          totalRekomendasiPrioritas: raporResult.prioritasRekomendasi.length,
          timestamp: new Date().toISOString(),
        };
        extraData.raporPendidikan = raporResult;
        break;

      case IntegrationSource.PMM:
        endpointUrl = 'https://guru.kemdikbud.go.id/api/v1/pengelolaan-kinerja/guru';
        const pmmGuruData = generateMockPmmProgress(schoolId);
        totalFetched = 68;
        totalSynced = 68;
        totalErrors = 0;
        summaryPayload = {
          syncMode: syncType,
          schoolId,
          totalGuruDiproses: pmmGuruData.length,
          totalAksiNyataTerverifikasi: pmmGuruData.reduce((acc, g) => acc + g.aksiNyataDivalidasi, 0),
          totalSertifikatDiterbitkan: pmmGuruData.reduce((acc, g) => acc + g.sertifikatDiperoleh, 0),
          statusSinkronisasiKinerja: 'Sinkronisasi RHK dan Observasi Praktik Kinerja Selesai',
          timestamp: new Date().toISOString(),
        };
        extraData.pmmProgressList = pmmGuruData;
        break;

      default:
        endpointUrl = 'https://api.kemdikbud.go.id/gateway/v1/sync';
        totalFetched = 10;
        totalSynced = 10;
        totalErrors = 0;
        summaryPayload = {
          syncMode: syncType,
          status: 'General Sync Completed',
        };
        break;
    }

    const executionDuration = Date.now() - startTime;

    // Buat entitas log hasil sinkronisasi
    const syncLogRecord: IntegrationSyncLog = {
      id: `log-sync-${Date.now()}`,
      sourceSystem: body.sourceSystem,
      syncType,
      status: SyncStatus.SUCCESS,
      triggeredById,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: executionDuration,
      totalRecordsFetched: totalFetched,
      totalRecordsSynced: totalSynced,
      totalErrors,
      syncSummaryPayload: summaryPayload,
      errorDetails: null,
      endpointUrl,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
    };

    // Tambahkan ke riwayat memori log sistem
    syncLogsHistory.unshift(syncLogRecord);

    return Response.json(
      {
        success: true,
        message: `Sinkronisasi data dari ${body.sourceSystem} berhasil dilaksanakan.`,
        data: {
          syncLog: syncLogRecord,
          ...extraData,
        },
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    const failedDuration = Date.now() - startTime;
    return Response.json(
      {
        success: false,
        message: 'Terjadi kesalahan sistem saat memproses sinkronisasi data',
        error: error?.message || 'Internal Server Error',
        durationMs: failedDuration,
      },
      { status: 500 }
    );
  }
}
