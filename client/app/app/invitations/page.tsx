'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authApi, type Invitation } from '@/lib/api';
import { Loader2, Mail, CheckCircle2, XCircle, Building2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { refreshUser } = useAuth();

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        try {
            setLoading(true);
            const data = await authApi.getInvitations();
            setInvitations(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load invitations');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (membershipId: string) => {
        try {
            setProcessing(membershipId);
            setError(null);
            const result = await authApi.acceptInvitation({ membershipId });
            await refreshUser();
            await loadInvitations();
            
            // If user accepted, they might want to switch to that tenant
            // For now, just show success message
            alert(`Invitation accepted! You can now access ${result.tenantName}.`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to accept invitation');
        } finally {
            setProcessing(null);
        }
    };

    const handleDecline = async (membershipId: string) => {
        if (!confirm('Are you sure you want to decline this invitation?')) {
            return;
        }

        try {
            setProcessing(membershipId);
            setError(null);
            await authApi.declineInvitation({ membershipId });
            await loadInvitations();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to decline invitation');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invitations</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your tenant invitations
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Invitations</CardTitle>
                            <CardDescription>
                                You have been invited to join these tenants
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invitations.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-sm text-gray-500">
                                        No pending invitations
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {invitations.map((invitation) => (
                                        <div
                                            key={invitation.membershipId}
                                            className="rounded-lg border border-gray-200 p-6 dark:border-gray-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                                            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{invitation.tenantName}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {invitation.tenantSlug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {invitation.roles.length > 0 && (
                                                        <div className="mt-4 flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                Roles: {invitation.roles.map((r) => r.name).join(', ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Invited on {new Date(invitation.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDecline(invitation.membershipId)}
                                                        disabled={processing === invitation.membershipId}
                                                    >
                                                        {processing === invitation.membershipId ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Decline
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAccept(invitation.membershipId)}
                                                        disabled={processing === invitation.membershipId}
                                                    >
                                                        {processing === invitation.membershipId ? (
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Accept
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
