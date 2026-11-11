import { useConfig } from '@/config/config';
import { useEffect, useState } from 'react';
import type { DwcExtension, InterpretationRemark } from './types';

const EXTENSIONS_URL = 'https://rs.gbif.org/extensions.json';

export type ValidatorLookups = {
  remarks: Record<string, InterpretationRemark>;
  categoryOrder?: string[];
  extensions: Record<string, DwcExtension>;
  // issues that make a file non-indexable; the endpoint that listed them is gone, so it stays empty
  nonIndexableIssues: Set<string>;
};

export const emptyLookups: ValidatorLookups = {
  remarks: {},
  extensions: {},
  nonIndexableIssues: new Set(),
};

// module scope: the lookups are public, static and shared by every report in the session
const cache = new Map<string, Promise<unknown>>();

function getJson<T>(url: string): Promise<T | undefined> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url)
        .then((response) => (response.ok ? response.json() : undefined))
        .catch(() => undefined)
        .then((body) => {
          if (body === undefined) cache.delete(url);
          return body;
        })
    );
  }
  return cache.get(url) as Promise<T | undefined>;
}

export function toRemarkMap(body: unknown): Record<string, InterpretationRemark> {
  if (!Array.isArray(body)) return {};
  const remarks: Record<string, InterpretationRemark> = {};
  for (const remark of body) {
    if (typeof remark?.id === 'string') remarks[remark.id] = remark;
  }
  return remarks;
}

export function toCategoryOrder(body: unknown): string[] | undefined {
  if (!Array.isArray(body)) return undefined;
  const order = body.filter((x): x is string => typeof x === 'string');
  return order.length > 0 ? order : undefined;
}

// extensions.json lists every version of an extension; prefer the latest
export function toExtensionMap(body: unknown): Record<string, DwcExtension> {
  const list = (body as { extensions?: unknown } | undefined)?.extensions;
  if (!Array.isArray(list)) return {};
  const extensions: Record<string, DwcExtension & { isLatest?: boolean }> = {};
  for (const extension of list) {
    const identifier = extension?.identifier;
    if (typeof identifier !== 'string') continue;
    if (!extensions[identifier] || (extension.isLatest && !extensions[identifier].isLatest)) {
      extensions[identifier] = extension;
    }
  }
  return extensions;
}

export function useValidatorLookups(): ValidatorLookups {
  const { v1Endpoint } = useConfig();
  const [lookups, setLookups] = useState<ValidatorLookups>(emptyLookups);

  useEffect(() => {
    let cancelled = false;
    const update = (patch: Partial<ValidatorLookups>) => {
      if (!cancelled) setLookups((current) => ({ ...current, ...patch }));
    };
    getJson(`${v1Endpoint}/enumeration/interpretationRemark`).then((body) =>
      update({ remarks: toRemarkMap(body) })
    );
    getJson(`${v1Endpoint}/validation/enumeration/EvaluationCategory`).then((body) =>
      update({ categoryOrder: toCategoryOrder(body) })
    );
    getJson(EXTENSIONS_URL).then((body) => update({ extensions: toExtensionMap(body) }));
    return () => {
      cancelled = true;
    };
  }, [v1Endpoint]);

  return lookups;
}
