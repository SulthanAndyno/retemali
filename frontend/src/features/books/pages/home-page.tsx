'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { useAuth } from '@/features/auth';
import { usePublicHome } from '../hooks/use-public-home';
import { HomeHero } from '../components/home-hero';
import { HomeSearch } from '../components/home-search';
import { HomeCategoryPills } from '../components/home-category-pills';
import { HomePopularBooks } from '../components/home-popular-books';
import { HomeFeaturedEvent } from '../components/home-featured-event';
import { HomeSupport } from '../components/home-support';
import { HomeVenue } from '../components/home-venue';
import { HomeFooter } from '../components/home-footer';
import { HomeLoading } from '../components/home-loading';
import { HomeError } from '../components/home-error';
import type { Book } from '../types/book.types';
import type { HomeCategoryValue } from '../types/home.types';

export function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, loading, error, reload } = usePublicHome();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HomeCategoryValue>('ALL');

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/katalog?search=${encodeURIComponent(query)}` : '/katalog');
  };

  const handleCategorySelect = (category: HomeCategoryValue) => {
    setActiveCategory(category);
    router.push(
      category === 'ALL'
        ? '/katalog'
        : `/katalog?category=${encodeURIComponent(category)}`
    );
  };

  const handleOpenBook = (book: Book) => {
    router.push(`/katalog?search=${encodeURIComponent(book.title)}`);
  };

  const handleBookmark = (book: Book) => {
    router.push(
      user
        ? `/katalog?search=${encodeURIComponent(book.title)}`
        : '/login'
    );
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-blue-50/50 pb-24 text-slate-800 relative">
      <Header />

      <main className="px-4 pt-3 space-y-4">
        {loading && !data ? (
          <HomeLoading />
        ) : error && !data ? (
          <HomeError message={error.message} onRetry={() => void reload()} />
        ) : (
          <>
            <HomeHero
              community={data?.communityInfo ?? null}
              metrics={data?.metrics ?? null}
              onBrowseCatalog={() => router.push('/katalog')}
              onViewEvents={() => router.push('/kegiatan')}
            />
            <HomeSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
            />
            <HomeCategoryPills
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
            />
            <HomePopularBooks
              books={data?.popularBooks ?? []}
              onViewAll={() => router.push('/katalog')}
              onOpenBook={handleOpenBook}
              onBookmark={handleBookmark}
            />
            <HomeFeaturedEvent
              event={data?.featuredEvents?.[0] ?? null}
              onViewEvents={() => router.push('/kegiatan')}
            />
            <HomeSupport
              onDonate={() => router.push('/donasi')}
              onJoinVolunteer={() =>
                router.push(user ? '/member' : '/login')
              }
            />
            <HomeVenue community={data?.communityInfo ?? null} />
            <HomeFooter />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
