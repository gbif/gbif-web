// Shapes returned by the gbif-org server's /api/admin/* fan-out endpoints.
// Each entry is the result for one GraphQL instance.

export type PoolStats = {
  waiting: number;
  running: number;
  currentQueueSize: number;
  largestSeenQueueSize: number;
  concurrencyLimit: number;
  maxQueueSize: number;
  served: number;
  failed: number;
  aborted: number;
  rejected: number;
  timeoutMs: number;
};

export type Health = {
  nagiosString?: string;
  uptimeSeconds?: number;
  inflight?: number;
  requestPools?: Record<string, PoolStats>;
  overload?: {
    enabled?: boolean;
    eventLoopDelayMs?: number;
    eventLoopDelayMaxMs?: number;
    peakEventLoopDelayMs?: number;
    slowEventLoopCount?: number;
    lastSlowEventLoop?: string | null;
    inflight?: number;
    heapUsedMb?: number;
    heapUsedPercent?: number;
    thresholds?: {
      maxEventLoopDelayMs?: number;
      maxInFlight?: number;
      maxHeapUsedFraction?: number;
    };
  };
};

export type PoolSettings = {
  concurrency: number;
  maxQueueDepth: number;
  timeoutMs: number;
  perRequestConcurrency: number;
};

export type Settings = {
  logLevel: string;
  overload: {
    enabled: boolean;
    maxEventLoopDelayMs: number;
    maxInFlight: number;
    maxHeapUsedFraction: number;
    retryAfterSeconds: number;
  };
  pools: Record<string, PoolSettings>;
};

// One instance's result within a fan-out response.
export type NodeResult<T> = {
  node: string; // label (host)
  url: string;
  ok: boolean;
  status?: number;
  error?: unknown;
  skipped?: boolean;
} & T;

export type HealthResult = NodeResult<{ health?: Health }>;
export type SettingsResult = NodeResult<{ settings?: Settings }>;

// --- es-api (monitoring only) ----------------------------------------------
// The es-api exposes a different /health shape: `queues` (not requestPools),
// `eventLoop` (not overload), plus priority shedding info per queue.

export type EsShedding = {
  rejecting?: boolean;
  bands?: unknown[];
};

export type EsQueue = {
  waiting: number;
  running: number;
  currentQueueSize: number;
  largestSeenQueueSize: number;
  concurrencyLimit: number;
  maxQueueSize: number;
  served: number;
  failed: number;
  aborted: number;
  rejected: number;
  queueFullNow?: boolean;
  shedding?: EsShedding;
};

export type EsHealth = {
  status?: string;
  nagiosString?: string;
  uptimeSeconds?: number;
  inflight?: number;
  rejecting?: boolean;
  priorityCounts?: Record<string, number>;
  queues?: Record<string, EsQueue>;
  eventLoop?: {
    eventLoopDelayMs?: number;
    eventLoopDelayMaxMs?: number;
    peakEventLoopDelayMs?: number;
    slowEventLoopCount?: number;
    lastSlowEventLoop?: string | null;
  };
};

export type EsHealthResult = NodeResult<{ health?: EsHealth }>;

export type EsBand = { queueAbove: number; maxPriority: number };
export type EsQueueLimits = { concurrencyLimit: number; maxQueueSize: number };
export type EsShedConfig = { defaultPriority: number; bands: EsBand[] };

export type EsSettings = {
  logLevel: string;
  queues: Record<string, EsQueueLimits>;
  shedding: Record<string, EsShedConfig>;
};

export type EsSettingsResult = NodeResult<{ settings?: EsSettings }>;
