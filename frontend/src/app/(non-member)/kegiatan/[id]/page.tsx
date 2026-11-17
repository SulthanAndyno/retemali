import { EventDetailPage } from '@/features/events';

export const metadata = { title: 'Detail Kegiatan — Rete Mali' };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventDetailPage eventId={id} />;
}
