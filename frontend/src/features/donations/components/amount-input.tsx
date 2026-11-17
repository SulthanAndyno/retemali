interface AmountInputProps {
  amount: number;
  onChange: (value: number) => void;
}

export function AmountInput({ amount, onChange }: AmountInputProps) {
  return (
    <div>
      <label className="font-semibold text-slate-700 block mb-1">
        Atau Masukkan Nominal Bebas
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
          Rp
        </span>
        <input
          type="number"
          value={amount}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 font-mono font-bold text-slate-900"
        />
      </div>
    </div>
  );
}
