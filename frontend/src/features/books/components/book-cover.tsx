import { BookOpen } from 'lucide-react';
import { getImageUrl } from '@/shared/lib/utils';

interface BookCoverProps {
  title: string;
  coverImage: string | null;
}

export function BookCover({ title, coverImage }: BookCoverProps) {
  return (
    <>
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getImageUrl(coverImage)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <>
          <BookOpen size={32} className="text-blue-500 mb-1" />
          <span className="text-[11px] font-extrabold text-slate-800 line-clamp-2 px-1">
            {title}
          </span>
        </>
      )}
    </>
  );
}
