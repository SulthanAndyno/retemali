'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/shared/lib/api';
import { getImageUrl } from '@/shared/lib/utils';
import {
  createPaymentAccount,
  deletePaymentAccount,
  getAdminPaymentAccounts,
  updatePaymentAccount,
} from '../api/admin.api';
import type { PaymentAccount, PaymentAccountType } from '../types/admin.types';

export interface PaymentAccountFormValues {
  type: PaymentAccountType;
  providerName: string;
  accountNumber: string;
  accountName: string;
  qrisNmid: string;
}

export type PaymentAccountActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

export interface UsePaymentAccountsResult {
  accounts: PaymentAccount[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  formOpen: boolean;
  editingId: string | null;
  form: PaymentAccountFormValues;
  qrisPreview: string | null;
  saving: boolean;
  busyId: string | null;
  openCreate: () => void;
  openEdit: (account: PaymentAccount) => void;
  closeForm: () => void;
  updateField: <K extends keyof PaymentAccountFormValues>(
    field: K,
    value: PaymentAccountFormValues[K]
  ) => void;
  selectQrisFile: (file: File | null) => void;
  submit: () => Promise<PaymentAccountActionResult>;
  toggle: (account: PaymentAccount) => Promise<PaymentAccountActionResult>;
  remove: (account: PaymentAccount) => Promise<PaymentAccountActionResult>;
}

const EMPTY_FORM: PaymentAccountFormValues = {
  type: 'BANK_TRANSFER',
  providerName: '',
  accountNumber: '',
  accountName: '',
  qrisNmid: '',
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function usePaymentAccounts(): UsePaymentAccountsResult {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PaymentAccountFormValues>(EMPTY_FORM);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const objectUrlRef = useRef<string | null>(null);

  const revokeObjectUrl = useCallback(() => {
    if (!objectUrlRef.current) return;
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  }, []);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const response = await getAdminPaymentAccounts();
      if (requestId !== requestIdRef.current) return;
      setAccounts(response.data);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;
      setError(errorMessage(loadError, 'Gagal memuat kanal pembayaran.'));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    return () => {
      requestIdRef.current += 1;
      revokeObjectUrl();
    };
  }, [load, revokeObjectUrl]);

  const resetForm = useCallback(() => {
    revokeObjectUrl();
    setEditingId(null);
    setForm(EMPTY_FORM);
    setQrisFile(null);
    setQrisPreview(null);
  }, [revokeObjectUrl]);

  const openCreate = useCallback(() => {
    resetForm();
    setFormOpen(true);
  }, [resetForm]);

  const openEdit = useCallback(
    (account: PaymentAccount) => {
      revokeObjectUrl();
      setEditingId(account.id);
      setForm({
        type: account.type,
        providerName: account.providerName,
        accountNumber: account.accountNumber ?? '',
        accountName: account.accountName ?? '',
        qrisNmid: account.qrisNmid ?? '',
      });
      setQrisFile(null);
      setQrisPreview(account.qrisImageUrl ? getImageUrl(account.qrisImageUrl) : null);
      setFormOpen(true);
    },
    [revokeObjectUrl]
  );

  const closeForm = useCallback(() => {
    setFormOpen(false);
    resetForm();
  }, [resetForm]);

  const updateField = useCallback(
    <K extends keyof PaymentAccountFormValues>(
      field: K,
      value: PaymentAccountFormValues[K]
    ) => {
      setForm((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const selectQrisFile = useCallback(
    (file: File | null) => {
      revokeObjectUrl();
      setQrisFile(file);
      if (!file) {
        setQrisPreview(null);
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setQrisPreview(objectUrl);
    },
    [revokeObjectUrl]
  );

  const submit = useCallback(async (): Promise<PaymentAccountActionResult> => {
    if (form.providerName.trim().length < 2) {
      return { ok: false, message: 'Nama kanal / bank minimal 2 karakter' };
    }
    if (form.type === 'BANK_TRANSFER' && !form.accountNumber.trim()) {
      return { ok: false, message: 'Nomor rekening wajib diisi untuk transfer bank' };
    }

    const body = new FormData();
    body.append('type', form.type);
    body.append('providerName', form.providerName.trim());
    if (form.accountNumber.trim()) body.append('accountNumber', form.accountNumber.trim());
    if (form.accountName.trim()) body.append('accountName', form.accountName.trim());
    if (form.type === 'QRIS' && form.qrisNmid.trim()) {
      body.append('qrisNmid', form.qrisNmid.trim());
    }
    if (qrisFile) body.append('qrisImage', qrisFile);

    setSaving(true);
    try {
      if (editingId) {
        await updatePaymentAccount(editingId, body);
      } else {
        await createPaymentAccount(body);
      }
      await load();
      closeForm();
      return {
        ok: true,
        message: editingId
          ? 'Kanal pembayaran diperbarui'
          : 'Kanal pembayaran ditambahkan',
      };
    } catch (submitError) {
      return {
        ok: false,
        message: errorMessage(submitError, 'Gagal menyimpan kanal pembayaran.'),
      };
    } finally {
      setSaving(false);
    }
  }, [closeForm, editingId, form, load, qrisFile]);

  const toggle = useCallback(
    async (account: PaymentAccount): Promise<PaymentAccountActionResult> => {
      setBusyId(account.id);
      try {
        const body = new FormData();
        body.append('isActive', String(!account.isActive));
        await updatePaymentAccount(account.id, body);
        await load();
        return {
          ok: true,
          message: account.isActive
            ? 'Kanal dinonaktifkan'
            : 'Kanal diaktifkan kembali',
        };
      } catch (toggleError) {
        return {
          ok: false,
          message: errorMessage(toggleError, 'Gagal mengubah status kanal.'),
        };
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  const remove = useCallback(
    async (account: PaymentAccount): Promise<PaymentAccountActionResult> => {
      setBusyId(account.id);
      try {
        await deletePaymentAccount(account.id);
        await load();
        return { ok: true, message: 'Kanal pembayaran dihapus' };
      } catch (deleteError) {
        return {
          ok: false,
          message: errorMessage(deleteError, 'Gagal menghapus kanal.'),
        };
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  return {
    accounts,
    loading,
    error,
    reload: load,
    formOpen,
    editingId,
    form,
    qrisPreview,
    saving,
    busyId,
    openCreate,
    openEdit,
    closeForm,
    updateField,
    selectQrisFile,
    submit,
    toggle,
    remove,
  };
}
