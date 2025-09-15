'use client';

import { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'neon';
  hover?: boolean;
}

export function ModernCard({
  children,
  className = '',
  variant = 'default',
  hover = true
}: ModernCardProps) {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300';

  const variants = {
    default: 'bg-gray-800/50 border border-gray-700 backdrop-blur-sm',
    gradient: 'bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm',
    glass: 'bg-white/5 border border-white/10 backdrop-blur-md',
    neon: 'bg-gray-900/50 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20'
  };

  const hoverClasses = hover ?
    'hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-400/50 cursor-pointer' :
    '';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

export function GlowingButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'neon';
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-500/25',
    neon: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-400/50 text-black font-bold'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full text-white font-semibold
        transition-all duration-300 transform
        hover:scale-105 hover:shadow-xl
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function AnimatedCounter({
  value,
  suffix = '',
  className = ''
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <div className={`font-bold text-4xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent ${className}`}>
      {value.toLocaleString()}{suffix}
    </div>
  );
}

export function StatusBadge({
  status,
  className = ''
}: {
  status: 'success' | 'failure' | 'pending' | 'active' | 'inactive';
  className?: string;
}) {
  const variants = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    failure: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-medium border
      ${variants[status]} ${className}
    `}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}