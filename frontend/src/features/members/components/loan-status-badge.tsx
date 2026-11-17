import { Badge } from '@/shared/components/ui/badge';
import type { MemberLoan } from '../types/member-page.types';
import { resolveLoanState } from '../lib/member-loans';

export function LoanStatusBadge({
  loan,
  now,
}: {
  loan: MemberLoan;
  now?: number;
}) {
  const state = resolveLoanState(loan, now);

  return (
    <Badge tone={state.tone}>
      {state.label.charAt(0).toUpperCase() + state.label.slice(1)}
    </Badge>
  );
}
