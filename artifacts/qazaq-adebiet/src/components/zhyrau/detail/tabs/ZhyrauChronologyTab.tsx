import React from 'react';
import ZhyrauTimelineTab from './ZhyrauTimelineTab';
import type { Zhyrau } from '@/types/zhyrau';

// Chronology tab — same data source as Timeline tab
export default function ZhyrauChronologyTab({ zhyrau }: { zhyrau: Zhyrau }) {
  return <ZhyrauTimelineTab zhyrau={zhyrau} />;
}
