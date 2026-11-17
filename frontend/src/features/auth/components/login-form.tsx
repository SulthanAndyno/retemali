import type { FormEvent } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';

interface LoginFormProps {
  roleLabel: string;
  email: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function LoginForm({
  roleLabel,
  email,
  password,
  showPassword,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onClose,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">
          Masuk sebagai <span className="text-blue-600">{roleLabel}</span>
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="email@contoh.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="••••••••"
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

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Masuk
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Belum punya akun?{' '}
        <a href="/register" className="text-blue-600 font-semibold hover:underline">
          Daftar di sini
        </a>
      </p>
    </div>
  );
}
