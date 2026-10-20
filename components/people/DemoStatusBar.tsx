'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

export type DemoStatus = 'submitted' | 'in_review' | 'feedback' | 'decision' | 'signed' | 'passed';

export interface DemoSubmission {
  trackName: string;
  submittedAt: string;
  tier: 'standard' | 'priority' | 'session';
  tierPrice: string;
  slaHours: number;
  status: DemoStatus;
  events: { date: string; text: string; completed: boolean }[];
}

const s: Record<string, CSSProperties> = {
  strip: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 24,
  },
  stripHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  stripTitle: { margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' },
  viewBtn: { fontSize: 13, color: '#111827', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' },

  // Timeline mini (collapsed)
  timelineMini: { display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12 },
  stepDot: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0 },
  stepLine: { flex: 1, height: 2, background: '#e5e7eb', minWidth: 20 },
  stepLineDone: { flex: 1, height: 2, background: '#111827', minWidth: 20 },
  stepLabels: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginTop: 6 },

  statusText: { fontSize: 13, color: '#374151', margin: 0 },

  // Modal
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modal: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' as const },
  modalTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111827' },
  meta: { margin: '0 0 4px', fontSize: 13, color: '#6b7280' },

  timeline: { marginTop: 24, display: 'flex', flexDirection: 'column' as const, gap: 0 },
  event: { display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' as const },
  eventDot: {
    width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center',
    fontSize: 12, fontWeight: 700, flexShrink: 0, zIndex: 2,
  },
  eventContent: { flex: 1, paddingBottom: 4 },
  eventDate: { fontSize: 12, fontWeight: 600, color: '#111827', margin: '0 0 4px' },
  eventText: { fontSize: 14, color: '#4b5563', margin: '0 0 4px', lineHeight: 1.5 },
  eventNote: { fontSize: 12, color: '#10b981', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: 4 },

  actions: { display: 'flex', gap: 12, marginTop: 24 },
  btnSecondary: { flex: 1, padding: '10px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #d1d5db', color: '#111827', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  btnPrimary: { flex: 1, padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
};

const STEP_LABELS = ['Submitted', 'In Review', 'Feedback', 'Decision'];

export default function DemoStatusBar({ demo }: { demo: DemoSubmission }) {
  const [open, setOpen] = useState(false);

  // Determine current step (0 = submitted, 1 = in_review, 2 = feedback, 3 = decision)
  const currentStep =
    demo.status === 'submitted' ? 0 :
    demo.status === 'in_review' ? 1 :
    demo.status === 'feedback' ? 2 :
    demo.status === 'decision' || demo.status === 'signed' || demo.status === 'passed' ? 3 : 0;

  return (
    <>
      {/* Collapsed strip */}
      <div style={s.strip}>
        <div style={s.stripHeader}>
          <h3 style={s.stripTitle}>Your demo — "{demo.trackName}"</h3>
          <button style={s.viewBtn} onClick={() => setOpen(true)}>View Details →</button>
        </div>

        <div style={s.timelineMini}>
          {STEP_LABELS.map((_, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div style={{ ...s.stepDot, background: i <= currentStep ? '#111827' : '#e5e7eb' }} />
              {i < STEP_LABELS.length - 1 && (
                <div style={i < currentStep ? s.stepLineDone : s.stepLine} />
              )}
            </div>
          ))}
        </div>
        <div style={s.stepLabels}>
          {STEP_LABELS.map((label, i) => (
            <span key={i} style={{ color: i <= currentStep ? '#111827' : '#9ca3af', fontWeight: i === currentStep ? 600 : 400 }}>
              {label}
            </span>
          ))}
        </div>

        <p style={{ ...s.statusText, marginTop: 16 }}>
          {currentStep === 0 && 'Demo received. Waiting for Sarah to open it.'}
          {currentStep === 1 && 'Sarah is listening. You\'ll hear back within the SLA.'}
          {currentStep === 2 && 'Feedback is being prepared.'}
          {currentStep === 3 && 'Final decision ready — check details.'}
        </p>
      </div>

      {/* Full timeline modal */}
      {open && (
        <div style={s.overlay} onClick={() => setOpen(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Submission to Sarah Jenkins</h2>
            <p style={s.meta}>Track: "{demo.trackName}"</p>
            <p style={s.meta}>Submitted: {demo.submittedAt}</p>
            <p style={s.meta}>Tier: {demo.tier} ({demo.tierPrice}) — {demo.slaHours}h SLA</p>

            <div style={s.timeline}>
              {demo.events.map((ev, i) => (
                <div key={i} style={s.event}>
                  <div style={{
                    ...s.eventDot,
                    background: ev.completed ? '#111827' : '#f3f4f6',
                    color: ev.completed ? '#ffffff' : '#9ca3af',
                  }}>
                    {ev.completed ? '✓' : '○'}
                  </div>
                  <div style={s.eventContent}>
                    <p style={s.eventDate}>{ev.date}</p>
                    <p style={s.eventText}>{ev.text}</p>
                    {ev.completed && (
                      <p style={s.eventNote}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Completed
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={s.actions}>
              <button style={s.btnSecondary} onClick={() => setOpen(false)}>Close</button>
              <button style={s.btnPrimary}>Send Follow-up</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
