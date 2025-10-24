'use client';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';

interface SubscriptionButtonProps {
  className?: string;
}

export default function SubscriptionButton({ className = '' }: SubscriptionButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/subscription')}
      className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${className}`}
    >
      <Crown className="w-4 h-4" />
      Upgrade to Premium
    </button>
  );
}
