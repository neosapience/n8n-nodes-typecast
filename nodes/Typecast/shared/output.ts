import type { IDataObject } from 'n8n-workflow';

export function silenceOutput(value: unknown): IDataObject {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 1000) {
    throw new Error('Remaining Silence must be an integer between 0 and 1000 ms');
  }
  return { remove_silence_ms: value };
}
