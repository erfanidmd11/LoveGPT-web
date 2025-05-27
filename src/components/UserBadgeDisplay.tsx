import React from 'react';
import Image from 'next/image';
import { badgeImageMap } from '@/lib/badges';

type UserBadgeDisplayProps = {
  badge: string;
  showLabel?: boolean;
  size?: number;
};

const UserBadgeDisplay: React.FC<UserBadgeDisplayProps> = ({
  badge,
  showLabel = false,
  size = 32,
}) => {
  if (!badge || !badgeImageMap[badge]) return null;

  return (
    <div className="flex items-center gap-2">
      <Image
        src={badgeImageMap[badge]}
        alt={badge}
        width={size}
        height={size}
        className="rounded"
      />
      {showLabel && <span className="text-sm text-gray-700">{badge}</span>}
    </div>
  );
};

export default UserBadgeDisplay;
