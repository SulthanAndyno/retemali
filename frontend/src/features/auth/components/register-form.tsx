import type { FormEvent } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import type { RegisterFormValues } from '../types';

interface RegisterFormProps {
  form: RegisterFormValues;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: string;
  onChange: (field: keyof RegisterFormValues, value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function RegisterForm({
  form,
  showPassword,
  showConfirmPassword,
  loading,
  error,
  onChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Data Diri
        </h3>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="Nama sesuai KTP"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Nomor HP <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            placeholder="08xxxxxxxxxx"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            RT/RW <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rtRw"
            value={form.rtRw}
            onChange={(event) => onChange('rtRw', event.target.value)}
            placeholder="Contoh: 05/14"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Akun
        </h3>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="email@contoh.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              placeholder="Min. 8 karakter"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              placeholder="Ulangi password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Daftar Sekarang
      </button>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <a href="/login" className="text-blue-600 font-semibold hover:underline">
          Masuk di sini
        </a>
      </p>
    </form>
  );
}
