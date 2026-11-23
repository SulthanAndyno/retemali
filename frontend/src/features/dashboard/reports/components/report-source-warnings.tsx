import type { CashReport } from '../types/report.types';

interface ReportSourceWarningsProps {
  dataSources: CashReport['dataSources'] | undefined;
}

export function ReportSourceWarnings({ dataSources }: ReportSourceWarningsProps) {
  if (!dataSources) return null;

  return (
    <>
      {!dataSources.events && (
        <p className="text-[10px] text-amber-700 text-center">
          Data tiket masuk kegiatan tidak dapat dimuat — laporan ditampilkan tanpa komponen
          tersebut.
        </p>
      )}
      {!dataSources.loans && (
        <p className="text-[10px] text-amber-700 text-center">
          Data denda sirkulasi tidak dapat dimuat — laporan ditampilkan tanpa komponen
          tersebut.
        </p>
      )}
    </>
  );
}
