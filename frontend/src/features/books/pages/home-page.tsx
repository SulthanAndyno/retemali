'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button, LinkButton } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { usePublicHome } from '../hooks/use-public-home';
import { PublicBookCard } from '../components/public-book-card';

function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export function HomePage() {
  const { data, loading, error, reload } = usePublicHome();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-card border border-surface-soft bg-surface-blue/60 p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:p-8">
        <Image
          src="/images/retemali-logo.png"
          alt="Logo Taman Baca ReteMali"
          width={120}
          height={82}
          className="h-auto w-24 object-contain lg:w-28"
          priority
        />
        <div>
          <h1 className="text-2xl font-extrabold text-primary-deep lg:text-3xl">
            Ruang belajar, membaca, dan bertumbuh bersama
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft lg:text-base">
            ReteMali hadir untuk masyarakat melalui katalog buku, kegiatan
            literasi komunitas, dan jalur donasi yang terbuka.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/katalog">Jelajahi Buku</LinkButton>
          <LinkButton href="/kegiatan" variant="secondary">
            Lihat Kegiatan
          </LinkButton>
        </div>
      </section>

      {loading && !data ? (
        <div className="h-56 animate-pulse rounded-card bg-white" />
      ) : error && !data ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{error.message}</p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            Coba Lagi
          </Button>
        </div>
      ) : (
        <>
          <section>
            <SectionTitle
              title="Koleksi Buku Terpopuler"
              description="Pilihan koleksi yang paling sering dibaca warga."
              action={
                <LinkButton href="/katalog" variant="secondary" size="sm">
                  Lihat Semua Buku
                </LinkButton>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(data?.popularBooks ?? []).slice(0, 4).map((book) => (
                <PublicBookCard
                  key={book.id}
                  book={book}
                  href={`/katalog/${book.id}`}
                />
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              title="Kegiatan Terdekat"
              description="Menampilkan kegiatan terpublikasi terdekat."
              action={
                <LinkButton href="/kegiatan" variant="secondary" size="sm">
                  Lihat Kegiatan
                </LinkButton>
              }
            />
            {(data?.featuredEvents ?? []).length === 0 ? (
              <div className="rounded-card border border-dashed border-surface-soft bg-white px-6 py-10 text-center">
                <p className="font-semibold text-ink">
                  Belum ada kegiatan terdekat
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Kegiatan tampil di sini begitu admin mempublikasikannya.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {(data?.featuredEvents ?? []).slice(0, 3).map((event) => {
                  const free = event.feeType === 'FREE';

                  return (
                    <Link key={event.id} href={`/kegiatan/${event.id}`}>
                      <Card className="h-full transition-shadow hover:shadow-drawer">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-ink">{event.title}</p>
                          <Badge tone={free ? 'success' : 'warning'}>
                            {free ? 'Gratis' : 'Berbayar'}
                          </Badge>
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-soft">
                          <CalendarDays
                            className="h-4 w-4 shrink-0"
                            aria-hidden
                          />
                          {formatEventDate(event.eventDate)}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                          {event.location}
                        </p>
                        <p className="mt-3 text-xs text-ink-soft">
                          Kuota sisa:{' '}
                          {Math.max(0, event.quota - event.registeredCount)}/
                          {event.quota}
                        </p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Card className="bg-surface-blue/60">
              <h3 className="font-bold text-primary-deep">Donasi Finansial</h3>
              <p className="mt-1 text-sm text-ink-soft">
                Dukungan literasi melalui QRIS atau transfer bank resmi — detail
                instruksinya tersedia di halaman donasi.
              </p>
              <LinkButton href="/donasi" size="sm" className="mt-3">
                Lihat Halaman Donasi
              </LinkButton>
            </Card>
            <Card className="bg-surface-blue/60">
              <h3 className="font-bold text-primary-deep">
                Donasi Buku Fisik
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Buku diserahkan langsung (drop-off) di Taman Baca ReteMali
                sesuai jadwal yang dipilih.
              </p>
              <LinkButton
                href="/donasi"
                size="sm"
                variant="secondary"
                className="mt-3"
              >
                Ketahui Cara Drop-Off
              </LinkButton>
            </Card>
          </section>

          <section>
            <SectionTitle
              title="Lokasi dan Jam Layanan"
              description="Informasi komunitas dari data publik ReteMali."
            />
            {data?.communityInfo ? (
              <Card className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Lokasi
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.communityInfo.area}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Hari buka
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.communityInfo.openDays}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Jam buka
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.communityInfo.openHours}
                  </p>
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-sm text-ink-soft">
                  Informasi lokasi dan jam layanan belum tersedia.
                </p>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}
