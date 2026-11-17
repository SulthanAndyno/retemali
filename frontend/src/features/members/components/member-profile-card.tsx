import { QrCode } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';

interface MemberProfileCardProps {
  name: string;
  memberCode: string;
  email: string;
  active: boolean;
  points?: number;
  readingTarget?: number;
}

export function MemberProfileCard({
  name,
  memberCode,
  email,
  active,
  points,
  readingTarget,
}: MemberProfileCardProps) {
  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="font-bold text-ink">{name}</p>
          <p className="text-sm text-ink-soft">
            ID Member {memberCode} • {email}
          </p>
          {typeof points === 'number' && typeof readingTarget === 'number' ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
              <QrCode className="h-3.5 w-3.5" aria-hidden />
              {points} poin • target baca {readingTarget} buku
            </p>
          ) : null}
        </div>
      </div>
      <Badge tone={active ? 'success' : 'warning'}>
        {active
          ? 'Member ReteMali — aktif'
          : 'Member ReteMali — menunggu verifikasi admin'}
      </Badge>
    </Card>
  );
}
