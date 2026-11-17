import { CheckCircle } from 'lucide-react';
import { PUBLIC_BENEFITS } from '../lib/auth-options';

export function LoginPublicBenefits() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        Sebagai pengunjung publik tanpa akun, Anda dapat:
      </h2>
      <div className="space-y-2">
        {PUBLIC_BENEFITS.map((benefit) => (
          <div
            key={benefit}
            className="flex items-center gap-2.5 border border-gray-100 rounded-xl px-3 py-2.5"
          >
            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
