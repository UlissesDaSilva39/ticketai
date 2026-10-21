'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

// Only 3x interest-free plan is legally safe under FCA merchant exemption
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

  // Only show for instalment plans
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
          I agree to the <span style={s.link}>GRID Payment Plan Terms</span> and understand that:
          <br />
          <br />
          <strong>1. Deposit & Non-Refundable:</strong> I will pay a deposit of £{depositAmount} today. This deposit is <strong>non-refundable</strong> if I miss any future payment.
          <br />
          <strong>2. Payment Schedule:</strong> I will be charged 2 additional payments of £{monthlyAmount} on the same date each month until the balance is cleared. This is an <strong>interest-free</strong> plan.
          <br />
          <strong>3. Ticket Hold:</strong> My ticket will remain <strong>PENDING</strong> and will not be released until the full balance is paid. I understand I cannot resell or transfer this ticket while a payment plan is active.
          <br />
          <strong>4. Default Policy:</strong> If I miss a payment by more than 5 days, my ticket will be void, my deposit will be forfeited, and I will be barred from future instalment plans.
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
