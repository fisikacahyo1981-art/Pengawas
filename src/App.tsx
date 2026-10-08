/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from './types';
import { RAW_PRISMA_SCHEMA, RAW_TYPESCRIPT_CODE } from './data/rawCode';
import { Header } from './components/Header';
import { RoleDashboard } from './components/RoleDashboard';
import { SchemaViewer } from './components/SchemaViewer';
import { TypesViewer } from './components/TypesViewer';
import { DocumentsView } from './components/DocumentsView';
import { ObservationsView } from './components/ObservationsView';
import { VirtualClinicView } from './components/VirtualClinicView';
import { IntegrationSyncView } from './components/IntegrationSyncView';
import { ApiExplorerView } from './components/ApiExplorerView';
import NewObservationPage from '../app/observations/new/page';
import WorkspacePortalPage from '../app/portal/page';
import {
  Database,
  Code2,
  FileText,
  Mic,
  Video,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.PENGAWAS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-900">
      {/* Top Header with Role Switcher & Navigation Tabs */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <RoleDashboard
            currentRole={currentRole}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'portal' && (
          <WorkspacePortalPage />
        )}

        {activeTab === 'observasi-lapangan' && (
          <NewObservationPage />
        )}

        {activeTab === 'api-explorer' && (
          <ApiExplorerView />
        )}

        {activeTab === 'prisma-schema' && (
          <SchemaViewer rawPrismaSchema={RAW_PRISMA_SCHEMA} />
        )}

        {activeTab === 'typescript-types' && (
          <TypesViewer rawTypesCode={RAW_TYPESCRIPT_CODE} />
        )}

        {activeTab === 'documents' && (
          <DocumentsView currentRole={currentRole} />
        )}

        {activeTab === 'observations' && (
          <ObservationsView
            currentRole={currentRole}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'virtual-clinic' && (
          <VirtualClinicView currentRole={currentRole} />
        )}

        {activeTab === 'integrations' && (
          <IntegrationSyncView currentRole={currentRole} />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              SW
            </div>
            <div>
              <p className="font-bold text-slate-200">
                SiWasPro — Sistem Informasi Pengawas Profesional
              </p>
              <p className="text-[11px] text-slate-500">
                TAHAP 1: PostgreSQL Prisma Schema (`schema.prisma`) & TypeScript Interfaces (`types/index.ts`)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="h-3.5 w-3.5 text-cyan-400" /> 18 Model Entitas PostgreSQL
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Code2 className="h-3.5 w-3.5 text-purple-400" /> TypeScript Type-Safe
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Layers className="h-3.5 w-3.5 text-emerald-400" /> 4 Peran (RBAC Terintegrasi)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
