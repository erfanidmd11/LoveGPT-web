import React from 'react';
import { HStack, Text, Image, Tooltip } from '@chakra-ui/react';

interface UserBadgeDisplayProps {
  badge?: string;
  showLabel?: boolean;
  size?: number;
}

const badgeImageMap: Record<string, string> = {
  '🌱 Seed Planter': '/badges/seed-planter.png',
  '💞 Spark Spreader': '/badges/spark-spreader.png',
  "💌 Cupid's Assistant": '/badges/cupids-assistant.png',
  '💖 Matchmaker Elite': '/badges/matchmaker-elite.png',
  '🧠 LoveGPT Luminary': '/badges/lovegpt-luminary.png',
};

const UserBadgeDisplay: React.FC<UserBadgeDisplayProps> = ({ badge, showLabel = false, size = 32 }) => {
  if (!badge || !badgeImageMap[badge]) return null;

  return (
    <Tooltip label={badge} hasArrow>
      <HStack spacing={1} align="center">
        <Image
          src={badgeImageMap[badge]}
          alt={badge}
          boxSize={`${size}px`}
          borderRadius="full"
        />
        {showLabel && <Text fontSize="sm" color="gray.700">{badge}</Text>}
      </HStack>
    </Tooltip>
  );
};

export default UserBadgeDisplay;
