'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { tokenStorage } from '@/lib/api';
import type { Tenant } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface TenantSelectionModalProps {
  open: boolean;
  tenants: Tenant[];
  userId: string;
  onClose: () => void;
}

export function TenantSelectionModal({
  open,
  tenants,
  userId,
  onClose,
}: TenantSelectionModalProps) {
  const { selectTenant } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectTenant = async (tenantId: string) => {
    setLoading(tenantId);
    try {
      await selectTenant(userId, tenantId);
      onClose();
    } catch (error) {
      console.error('Error selecting tenant:', error);
      alert('Failed to select tenant. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Tenant</DialogTitle>
          <DialogDescription>
            You have access to multiple tenants. Please select one to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {tenants.map((tenant) => (
            <Button
              key={tenant.tenantId}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleSelectTenant(tenant.tenantId)}
              disabled={loading === tenant.tenantId}
            >
              {loading === tenant.tenantId && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{tenant.tenantName}</span>
                <span className="text-xs text-gray-500">{tenant.tenantSlug}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
