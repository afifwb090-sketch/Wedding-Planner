import { getSupabaseClient } from './supabase';

export interface SyncPayload {
  sourceDeviceId: string;
  timestamp: number;
  roomCode: string;
  type: 'FULL_SYNC' | 'CHECKLIST_UPDATE' | 'GUEST_UPDATE' | 'BUDGET_UPDATE' | 'VENDOR_UPDATE' | 'PROFILE_UPDATE' | 'WISH_ADDED';
  data: any;
}

const DEVICE_ID_KEY = 'wedding_device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// 1. BroadcastChannel for fast local cross-tab / cross-window sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('satucerita_wedding_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment');
}

// 2. Active listeners
type SyncCallback = (payload: SyncPayload) => void;
const listeners: Set<SyncCallback> = new Set();

if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    if (event.data && event.data.sourceDeviceId !== getDeviceId()) {
      listeners.forEach((cb) => cb(event.data));
    }
  };
}

// Also listen to storage events across tabs as fallback
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'satucerita_wedding_cross_device_signal' && e.newValue) {
      try {
        const payload: SyncPayload = JSON.parse(e.newValue);
        if (payload.sourceDeviceId !== getDeviceId()) {
          listeners.forEach((cb) => cb(payload));
        }
      } catch (err) {
        // ignore
      }
    }
  });
}

// 3. Supabase Realtime Channel
let supabaseChannelInstance: any = null;

export function initSupabaseRealtime(roomCode: string, onUpdate: SyncCallback) {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    if (supabaseChannelInstance) {
      supabaseChannelInstance.unsubscribe();
    }

    const channelName = `wedding_room_${roomCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    supabaseChannelInstance = client.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    supabaseChannelInstance
      .on('broadcast', { event: 'wedding_state_sync' }, (payload: any) => {
        if (payload.payload && payload.payload.sourceDeviceId !== getDeviceId()) {
          onUpdate(payload.payload);
        }
      })
      .subscribe((status: string) => {
        console.log(`Supabase Realtime status for [${channelName}]:`, status);
      });
  } catch (err) {
    console.warn('Error setting up Supabase Realtime channel:', err);
  }
}

export function broadcastWeddingUpdate(
  roomCode: string,
  type: SyncPayload['type'],
  data: any
) {
  const payload: SyncPayload = {
    sourceDeviceId: getDeviceId(),
    timestamp: Date.now(),
    roomCode,
    type,
    data,
  };

  // Broadcast to other tabs/windows
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (err) {
      // ignore
    }
  }

  // Set localStorage signal for storage event listener fallback
  try {
    localStorage.setItem('satucerita_wedding_cross_device_signal', JSON.stringify(payload));
  } catch (err) {
    // ignore
  }

  // Broadcast to Supabase Realtime channel if active
  if (supabaseChannelInstance) {
    try {
      supabaseChannelInstance.send({
        type: 'broadcast',
        event: 'wedding_state_sync',
        payload,
      });
    } catch (err) {
      console.warn('Could not send Supabase broadcast:', err);
    }
  }
}

export function subscribeWeddingUpdates(callback: SyncCallback): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}
