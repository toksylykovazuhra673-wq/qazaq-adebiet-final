import React from 'react';
import ZhyrauQuotesTab from './ZhyrauQuotesTab';
import type { Zhyrau } from '@/types/zhyrau';

// "Қанатты сөздері" tab — same data as "Нақыл сөздері", different label
export default function ZhyrauSayingsTab({ zhyrau }: { zhyrau: Zhyrau }) {
  return <ZhyrauQuotesTab zhyrau={zhyrau} />;
}
