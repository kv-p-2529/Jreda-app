import { useEffect, useRef, useState } from 'react';
import {
  useWatch,
  type Control,
  type UseFormGetValues,
} from 'react-hook-form';
import axios from 'axios';

import authApi from '@/api/authApi';
import throwError from '@/api/throwError';
import {
  isSectionValid,
  SECTION_NUMBERS,
  type PersonalDetailsValues,
} from '../registrationSchemas';
import { buildSectionPayload } from './personalDetailsPayload';

type Params = {
  control: Control<PersonalDetailsValues>;
  getValues: UseFormGetValues<PersonalDetailsValues>;
  token: string | null;
  // Recomputes the value→label map at save time (option lists load async).
  buildLabelMap: () => Record<string, string>;
  aadhaarLast4?: string;
};

// Auto-saves the PersonalDetails form one section at a time, as each section
// passes validation. Returns `saving` so the screen can disable its button
// while a section PUT is in flight.
//
// Saving is debounced (~700ms after the last edit) and deduped (a section is
// only re-sent when its payload actually changed). Runs are serialized via
// `savingRef`/`pendingRef`: only one section saves at a time, and any change
// that lands mid-save queues a single re-run afterwards.
export function useSectionAutosave({
  control,
  getValues,
  token,
  buildLabelMap,
  aadhaarLast4,
}: Params): { saving: boolean } {
  const { registerSectionUpdateApi } = authApi();

  const [saving, setSaving] = useState(false);
  const lastSavedRef = useRef<Record<number, string>>({});
  const savingRef = useRef(false);
  const pendingRef = useRef(false);

  // PUT a single section's payload. The backend advances `current_section` on
  // each success, so sections must be sent one at a time, in order — never in
  // parallel. Retries twice (3 attempts total) before surfacing the error.
  const updateFormStatus = (
    section: number,
    payload: Record<string, any>,
    retriesLeft = 2,
  ): Promise<void> =>
    axios
      .put(registerSectionUpdateApi(token ?? '', section), payload)
      .then(res => {
        console.log(`Section ${section} updated`, res.data);
      })
      .catch(err => {
        if (retriesLeft > 0) {
          return updateFormStatus(section, payload, retriesLeft - 1);
        }
        throwError(err);
        throw err;
      });

  // Save every section that is valid AND has changed since its last save, one
  // at a time, in order. Re-entrant: if the form changes while a save is in
  // flight, we loop once more so the latest values land.
  const runAutosave = async () => {
    if (!token) return;
    if (savingRef.current) {
      pendingRef.current = true;
      return;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      do {
        pendingRef.current = false;
        const values = getValues();
        const labels = buildLabelMap();

        for (const section of SECTION_NUMBERS) {
          if (!isSectionValid(section, values)) continue;

          const payload = buildSectionPayload(
            section,
            values,
            labels,
            aadhaarLast4,
          );
          const serialized = JSON.stringify(payload);
          // Skip sections whose payload hasn't changed since we last saved them.
          if (lastSavedRef.current[section] === serialized) continue;

          try {
            await updateFormStatus(section, payload);
            lastSavedRef.current[section] = serialized;
          } catch {
            // updateFormStatus already surfaced the error. Stop here so we don't
            // save later sections out of order; a later edit retries this one.
            break;
          }
        }
      } while (pendingRef.current);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  // Debounced trigger: fire ~700ms after the user stops editing. The dedupe in
  // runAutosave makes extra runs cheap, so we don't need to diff here.
  const watchedValues = useWatch({ control });
  useEffect(() => {
    if (!token) return;
    const id = setTimeout(runAutosave, 700);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues, token]);

  return { saving };
}
