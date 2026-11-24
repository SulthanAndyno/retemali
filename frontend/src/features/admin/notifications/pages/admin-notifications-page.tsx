'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Input, Textarea } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { ApiError, get, post } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';

interface BroadcastItem {
  id: string;
  title: string;
  description: string;
  target: string;
  sentAt: string;
  createdAt: string;
}

export function AdminNotificationsPage() {
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('Semua Anggota & Relawan');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get<ApiEnvelope<BroadcastItem[]>>(
        '/notifications/broadcasts?limit=30'
      );
      setBroadcasts(res.data ?? []);
    } catch {
      setBroadcasts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      await post<ApiEnvelope<BroadcastItem>>('/notifications/broadcast', {
        title: title.trim(),
        description: description.trim(),
        target,
      });
      setTitle('');
      setDescription('');
      await load();
      toast('Siaran pengumuman berhasil dikirim.', 'success');
    } catch (err) {
      toast(
        err instanceof ApiError
          ? err.message
          : 'Gagal mengirim siaran pengumuman.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Notifikasi & Siaran"
        description="Kirim pengumuman ke seluruh anggota dan relawan serta pantau riwayat siaran."
      />

      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-primary-deep">
          Broadcast Pengumuman Baru
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="broadcast-title"
              label="Judul Pengumuman"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Jadwal Operasional Akhir Pekan"
            />
            <label className="text-sm font-semibold text-ink">
              Target Penerima
              <select
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="mt-1.5 w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="Semua Anggota & Relawan">
                  Semua Anggota & Relawan
                </option>
                <option value="Anggota">Anggota</option>
                <option value="Relawan">Relawan</option>
              </select>
            </label>
          </div>
          <Textarea
            id="broadcast-desc"
            label="Isi Pengumuman"
            required
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tuliskan pesan pengumuman untuk anggota dan relawan..."
          />
          <Button type="submit" size="sm" loading={submitting}>
            Kirim Broadcast
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="h-32 animate-pulse rounded-card bg-white" />
      ) : broadcasts.length === 0 ? (
        <EmptyState title="Belum ada riwayat siaran pengumuman" />
      ) : (
        <div className="space-y-2">
          {broadcasts.map((broadcast) => (
            <Card
              key={broadcast.id}
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink">
                  {broadcast.title}
                </p>
                <p className="text-xs text-ink-soft">{broadcast.description}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {broadcast.sentAt}
                </p>
              </div>
              <Badge tone="info">{broadcast.target}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
