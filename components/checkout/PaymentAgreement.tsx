'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

export type PaymentPlan = 'full' | '3x';

const s: Record<string, CSSProperties> = {
  box: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    cursor: 'pointer',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginTop: 2,
    cursor: 'pointer',
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 1.6,
    cursor: 'pointer',
  },
  link: {
    color: '#7c5cff',
    textDecoration: 'underline',
    fontWeight: 600,
    cursor: 'pointer',
  },
  warning: {
    marginTop: 12,
    padding: 12,
    background: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: 8,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 1.5,
  },
};

export default function PaymentAgreement({
  plan,
  total,
  onAgreeChange,
}: {
  plan: PaymentPlan;
  total: number;
  onAgreeChange: (agreed: boolean) => void;
}) {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
    onAgreeChange(e.target.checked);
  };

  if (plan === 'full') {
    return null;
  }

  const monthlyAmount = (total / 3).toFixed(2);
  const depositAmount = (total * 0.3).toFixed(2);

  return (
    <div style={s.box}>
      <label style={s.checkboxRow}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={handleChange}
          style={s.checkbox}
        />
        <span style={s.label}>
          I agree to pay a <strong>30% deposit (£{depositAmount})</strong> today and <strong>2 monthly payments of £{monthlyAmount}</strong> starting in 30 days. This is an interest-free plan. The deposit is non-refundable if I default. My ticket will be held until the balance is paid. <span style={s.link}>Read full terms</span>.
        </span>
      </label>

      {!agreed && (
        <div style={s.warning}>
          ⚠️ You must agree to the payment terms before you can proceed.
        </div>
      )}

      {agreed && (
        <div style={{ ...s.warning, background: '#f0fdf4', borderColor: '#10b981', color: '#065f46' }}>
          ✓ You have agreed to the payment plan terms.
        </div>
      )}
    </div>
  );
}
