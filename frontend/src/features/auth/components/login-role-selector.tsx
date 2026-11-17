import type { ReactNode } from 'react';
import { BookOpen, Heart, Shield, User } from 'lucide-react';
import { ACCESS_MODES } from '../lib/auth-options';
import type { AccessMode } from '../types';

const ROLE_ICONS: Record<AccessMode, ReactNode> = {
  NON_MEMBER: <BookOpen size={22} />,
  MEMBER: <User size={22} />,
  VOLUNTEER: <Heart size={22} />,
  ADMIN: <Shield size={22} />,
};

interface LoginRoleSelectorProps {
  selectedRole: AccessMode | null;
  onSelect: (role: AccessMode) => void;
}

export function LoginRoleSelector({ selectedRole, onSelect }: LoginRoleSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Pilih mode akses
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {ACCESS_MODES.map((role) => {
          const isSelected = selectedRole === role.key;
          const isNonMember = role.key === 'NON_MEMBER';

          return (
            <button
              key={role.key}
              onClick={() => onSelect(role.key)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                isNonMember && selectedRole === null
                  ? 'border-blue-500 bg-blue-50'
                  : isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 bg-gray-50 hover:border-blue-200'
              }`}
            >
              <div
                className={`mb-2 w-9 h-9 rounded-lg flex items-center justify-center ${
                  isSelected || (isNonMember && selectedRole === null)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {ROLE_ICONS[role.key]}
              </div>
              {role.badge && (
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 ${role.badgeColor}`}
                >
                  {role.badge}
                </span>
              )}
              <p className="text-sm font-semibold text-gray-800">{role.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{role.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
