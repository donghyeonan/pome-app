'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks';
import { useSavedItems } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SaveButtonProps {
  itemType: 'clinic' | 'treatment';
  itemId: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function SaveButton({
  itemType,
  itemId,
  variant = 'outline',
  size = 'default',
  className,
}: SaveButtonProps) {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { isAuthenticated, user } = useAuth();
  const { saveItem, unsaveItem, isSaved } = useSavedItems(user?.id);
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const saved = isSaved(itemId);

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (saved) {
      unsaveItem(itemId);
    } else {
      saveItem(itemType, itemId);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <Button
      variant={saved ? 'default' : variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      <Bookmark
        className={`h-4 w-4 mr-2 transition-transform ${
          isAnimating ? 'scale-125' : ''
        } ${saved ? 'fill-current' : ''}`}
      />
      {saved ? t('saved') : t('save')}
    </Button>
  );
}
