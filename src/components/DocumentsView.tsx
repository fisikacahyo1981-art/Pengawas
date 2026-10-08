import React, { useState } from 'react';
import {
  DocumentType,
  DocumentStatus,
  CommentStatus,
  UserRole,
  DocumentWithDetails,
  DocumentCommentWithAuthor,
} from '../types';
import { MOCK_DOCUMENTS } from '../data/mockData';
import {
  FileText,
  CheckCircle,
  Clock,
  MessageSquare,
  History,
  FileCheck,
  Send,
  Eye,
  Plus,
  Shield,
  Calendar,
} from 'lucide-react';

interface DocumentsViewProps {
  currentRole: UserRole;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ currentRole }) => {
  const [documents, setDocuments] = useState<DocumentWithDetails[]>(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<DocumentWithDetails>(MOCK_DOCUMENTS[0]);
  const [newComment, setNewComment] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj: DocumentCommentWithAuthor = {
      id: `com-${Date.now()}`,
      documentId: selectedDoc.id,
      authorId: 'current-user',
      parentCommentId: null,
      versionNumber: selectedDoc.currentVersionNumber,
      pageNumber: 12,
      sectionKey: 'Bab Catatan Telaah Pengawas',
      content: newComment,
      status: CommentStatus.OPEN,
      resolvedAt: null,
      resolvedById: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        id: 'current-user',
        name: currentRole === UserRole.PENGAWAS ? 'Drs. H. Suryadi, M.Pd.' : 'User Aktif',
        role: currentRole,
        avatarUrl: null,
      },
    };

    const updatedDoc = {
      ...selectedDoc,
      comments: [newCommentObj, ...selectedDoc.comments],
    };

    setSelectedDoc(updatedDoc);
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    setNewComment('');
    setNotification('Catatan telaah berhasil ditambahkan!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApproveDocument = () => {
    const updatedDoc = {
      ...selectedDoc,
      status: DocumentStatus.APPROVED,
      approvalNotes: 'Telah disetujui resmi oleh Pengawas Pembina.',
      lastReviewedAt: new Date().toISOString(),
    };
    setSelectedDoc(updatedDoc);
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    setNotification('Dokumen berhasil disahkan (Approved)!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="h-4 w-4" /> Manajemen Dokumen Kurikulum
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            KOSP, RKAS BOS & Modul Ajar (Versioning & Audit Trail)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Mendukung pelacakan riwayat versi, verifikasi SHA-256 berkas, dan umpan balik berjenjang.
          </p>
        </div>

        {notification && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="h-4 w-4" />
            {notification}
          </div>
        )}
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>Daftar Dokumen Satuan ({documents.length})</span>
            <span className="text-slate-500 font-mono">TP 2024/2025</span>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDoc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500/60 bg-slate-800/90 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {doc.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === DocumentStatus.APPROVED
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : doc.status === DocumentStatus.IN_REVIEW
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 mt-2 line-clamp-2">
                    {doc.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>Versi {doc.currentVersionNumber}.0</span>
                    <span>Oleh: {doc.uploadedBy.name.split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Document Detail & Thread (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedDoc.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedDoc.id}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mt-2">
                {selectedDoc.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedDoc.description}
              </p>
            </div>

            {/* Approval Action for Pengawas */}
            {currentRole === UserRole.PENGAWAS && selectedDoc.status !== DocumentStatus.APPROVED && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-4">
                <div className="text-xs text-amber-300">
                  Dokumen ini membutuhkan verifikasi pengawas pembina.
                </div>
                <button
                  onClick={handleApproveDocument}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/20 whitespace-nowrap flex items-center gap-1.5"
                >
                  <FileCheck className="h-4 w-4" /> Sahkan Dokumen
                </button>
              </div>
            )}

            {/* Version History Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <History className="h-4 w-4 text-cyan-400" />
                Riwayat Versi Berkas ({selectedDoc.versions.length} Versi)
              </h4>

              <div className="space-y-2">
                {selectedDoc.versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400 font-mono">
                          v{ver.versionNumber}.0
                        </span>
                        <span className="text-slate-200 font-medium">{ver.fileName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{ver.changeSummary}</p>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[10px] text-slate-500 block font-mono">
                        {(ver.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & Review Thread */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                Catatan Telaah Pengawas ({selectedDoc.comments.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedDoc.comments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    Belum ada catatan telaah untuk dokumen ini.
                  </p>
                ) : (
                  selectedDoc.comments.map((com) => (
                    <div
                      key={com.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-300">
                          {com.author.name} ({com.author.role})
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                          {com.sectionKey || 'Umum'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {com.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ketik catatan telaah pengawas atau tanggapan..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Kirim
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
