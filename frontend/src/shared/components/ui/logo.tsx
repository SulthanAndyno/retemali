import Image from 'next/image';

export function Logo({
  size = 40,
  showName = true,
}: {
  size?: number;
  showName?: boolean;
}) {
  const height = Math.round(size / 1.48);

  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/images/retemali-logo.png"
        alt="Logo Taman Baca ReteMali"
        width={size}
        height={height}
        className="h-auto object-contain"
        style={{ width: size, height }}
        priority
      />
      {showName ? (
        <span className="text-lg font-extrabold tracking-tight text-primary-deep">
          ReteMali
        </span>
      ) : null}
    </span>
  );
}
