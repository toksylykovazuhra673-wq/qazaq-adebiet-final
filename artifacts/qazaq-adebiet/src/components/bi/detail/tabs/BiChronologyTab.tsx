import React from 'react';
import BiTimelineTab from './BiTimelineTab';
import type { BiSheshen } from '@/types/bi';

export default function BiChronologyTab({ bi }: { bi: BiSheshen }) {
  return <BiTimelineTab bi={bi} />;
}
