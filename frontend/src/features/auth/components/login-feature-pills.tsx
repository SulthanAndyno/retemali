import { CheckCircle } from 'lucide-react';
import { LOGIN_FEATURES } from '../lib/auth-options';

export function LoginFeaturePills() {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {LOGIN_FEATURES.map((feature) => (
        <span
          key={feature}
          className="inline-flex items-center gap-1.5 bg-white border border-blue-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
        >
          <CheckCircle size={12} className="text-blue-500" />
          {feature}
        </span>
      ))}
    </div>
  );
}
