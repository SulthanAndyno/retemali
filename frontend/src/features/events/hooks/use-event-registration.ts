'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api';
import { registerEvent } from '../api/events.api';
import { isPaidEvent } from '../lib/event-options';
import type { EventActionResult, EventItem } from '../types/event.types';

export interface UseEventRegistrationResult {
  registerTarget: EventItem | null;
  proofFile: File | null;
  proofPreview: string | null;
  registeringId: string | null;
  register: (event: EventItem) => Promise<EventActionResult | null>;
  submitPaid: () => Promise<EventActionResult | null>;
  selectProof: (file: File | null) => void;
  closeModal: () => void;
}

interface UseEventRegistrationOptions {
  loggedIn: boolean;
  onRequireLogin: () => void;
  onRegistered: (eventId: string) => void;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return 'Gagal mendaftar acara';
}

export function useEventRegistration({
  loggedIn,
  onRequireLogin,
  onRegistered,
}: UseEventRegistrationOptions): UseEventRegistrationResult {
  const [registerTarget, setRegisterTarget] = useState<EventItem | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokePreview = () => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  };

  useEffect(() => {
    return () => {
      revokePreview();
    };
  }, []);

  const submit = async (
    event: EventItem,
    proof: File | null
  ): Promise<EventActionResult> => {
    setRegisteringId(event.id);

    try {
      const response = await registerEvent(event.id, proof);
      const isPending = response.data?.paymentStatus === 'PENDING';
      onRegistered(event.id);
      setRegisterTarget(null);
      revokePreview();
      setProofFile(null);
      setProofPreview(null);

      return {
        ok: true,
        message: isPending
          ? `Pendaftaran "${event.title}" diterima. Bukti pembayaran menunggu verifikasi admin.`
          : `Pendaftaran acara "${event.title}" BERHASIL! E-Tiket diterbitkan.`,
      };
    } catch (error) {
      return { ok: false, message: errorMessage(error) };
    } finally {
      setRegisteringId(null);
    }
  };

  const register = async (event: EventItem): Promise<EventActionResult | null> => {
    if (!loggedIn) {
      onRequireLogin();
      return null;
    }

    if (isPaidEvent(event)) {
      revokePreview();
      setProofFile(null);
      setProofPreview(null);
      setRegisterTarget(event);
      return null;
    }

    return submit(event, null);
  };

  const submitPaid = async (): Promise<EventActionResult | null> => {
    if (!registerTarget) return null;
    return submit(registerTarget, proofFile);
  };

  const selectProof = (file: File | null) => {
    revokePreview();
    setProofFile(file);
    if (!file || !file.type.startsWith('image/')) {
      setProofPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setProofPreview(objectUrl);
  };

  const closeModal = () => {
    setRegisterTarget(null);
    revokePreview();
    setProofFile(null);
    setProofPreview(null);
  };

  return {
    registerTarget,
    proofFile,
    proofPreview,
    registeringId,
    register,
    submitPaid,
    selectProof,
    closeModal,
  };
}
