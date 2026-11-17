'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import {
  getEventPaymentRegistrations,
  verifyEventPayment,
} from '../api/admin.api';
import type {
  EventPaymentRegistration,
  VerifyEventPaymentInput,
} from '../types/admin.types';

export type EventPaymentActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export interface UseEventPaymentVerificationResult {
  registrations: EventPaymentRegistration[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  verifyingId: string | null;
  proofPreview: string | null;
  openProof: (paymentProofUrl: string | null) => void;
  closeProof: () => void;
  verify: (
    id: string,
    input: VerifyEventPaymentInput
  ) => Promise<EventPaymentActionResult>;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useEventPaymentVerification(): UseEventPaymentVerificationResult {
  const [registrations, setRegistrations] = useState<EventPaymentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getEventPaymentRegistrations();
      if (requestId !== requestIdRef.current) return;
      setRegistrations(response.data.filter((row) => row.paymentStatus !== null));
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setRegistrations([]);
      setError(errorMessage(loadError, 'Gagal memuat pembayaran kegiatan.'));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [load]);

  const openProof = useCallback((paymentProofUrl: string | null) => {
    setProofPreview(paymentProofUrl ? getImageUrl(paymentProofUrl) : null);
  }, []);

  const closeProof = useCallback(() => setProofPreview(null), []);

  const verify = useCallback(
    async (
      id: string,
      input: VerifyEventPaymentInput
    ): Promise<EventPaymentActionResult> => {
      setVerifyingId(id);
      try {
        const response = await verifyEventPayment(id, input);
        setRegistrations((current) =>
          current.map((row) => (row.id === id ? response.data : row))
        );
        return {
          ok: true,
          message:
            input.status === 'VERIFIED'
              ? 'Pembayaran peserta disetujui'
              : 'Pembayaran peserta ditolak, pendaftaran dibatalkan',
        };
      } catch (verifyError) {
        return {
          ok: false,
          message: errorMessage(verifyError, 'Gagal memverifikasi pembayaran.'),
        };
      } finally {
        setVerifyingId(null);
      }
    },
    []
  );

  return {
    registrations,
    loading,
    error,
    reload: load,
    verifyingId,
    proofPreview,
    openProof,
    closeProof,
    verify,
  };
}
