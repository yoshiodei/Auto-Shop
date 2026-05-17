import { timeAgo } from '@/utils/timeAgo';
import React from 'react'

export default function OnlineIndicator({
  isOnline, lastSeen
}: {
  isOnline: boolean; lastSeen: any;
}) {
  if (isOnline) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-green-600 font-medium">Online</span>
      </div>
    );
  }

  return (
    <span className="text-xs text-gray-400">
      Last seen {lastSeen ? timeAgo(lastSeen) : 'a while ago'}
    </span>
  );

}

