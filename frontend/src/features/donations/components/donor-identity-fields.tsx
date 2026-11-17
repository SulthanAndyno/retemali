interface DonorIdentityFieldsProps {
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
  onAnonymousChange: (value: boolean) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export function DonorIdentityFields({
  isAnonymous,
  donorName,
  donorEmail,
  onAnonymousChange,
  onNameChange,
  onEmailChange,
}: DonorIdentityFieldsProps) {
  return (
    <div className="space-y-2 pt-1 border-t border-slate-100">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700">Identitas Donatur</label>
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => onAnonymousChange(event.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Anonim (Hamba Allah)</span>
        </label>
      </div>

      {!isAnonymous && (
        <>
          <input
            type="text"
            placeholder="Nama Lengkap Donatur"
            value={donorName}
            onChange={(event) => onNameChange(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
          />
          <input
            type="email"
            placeholder="Alamat Email (opsional untuk kuitansi)"
            value={donorEmail}
            onChange={(event) => onEmailChange(event.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
          />
        </>
      )}
    </div>
  );
}
