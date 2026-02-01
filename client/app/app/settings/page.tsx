'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi, rolesApi, type TenantUser, type Role } from '@/lib/api';
import { Loader2, UserPlus, Mail, Shield, CheckCircle2, XCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function SettingsPage() {
    const [users, setUsers] = useState<TenantUser[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [email, setEmail] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                authApi.listTenantUsers(),
                rolesApi.list(),
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setInviteLoading(true);

        try {
            await authApi.inviteUser({
                email,
                roleId: selectedRoleId || undefined,
            });
            setSuccess('User invited successfully!');
            setEmail('');
            setSelectedRoleId('');
            setShowInviteDialog(false);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to invite user');
        } finally {
            setInviteLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                    </span>
                );
            case 'INVITED':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Mail className="h-3 w-3" />
                        Invited
                    </span>
                );
            case 'DISABLED':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                        <XCircle className="h-3 w-3" />
                        Disabled
                    </span>
                );
            default:
                return <span className="text-xs text-gray-500">{status}</span>;
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage team members and roles
                            </p>
                        </div>
                        <Button onClick={() => setShowInviteDialog(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                            {success}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>
                                Users who have access to this tenant
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {users.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-500">
                                    No team members yet. Invite your first user!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((user) => (
                                        <div
                                            key={user.membershipId}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                                                    <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.email}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {getStatusBadge(user.status)}
                                                        {user.roles.length > 0 && (
                                                            <div className="flex items-center gap-1">
                                                                <Shield className="h-3 w-3 text-gray-400" />
                                                                <span className="text-xs text-gray-500">
                                                                    {user.roles.map((r) => r.name).join(', ')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Joined {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite User to Tenant</DialogTitle>
                                <DialogDescription>
                                    Add a new user to your tenant. They will receive an invitation.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={inviteLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role (Optional)</Label>
                                    <select
                                        id="role"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900"
                                        value={selectedRoleId}
                                        onChange={(e) => setSelectedRoleId(e.target.value)}
                                        disabled={inviteLoading}
                                    >
                                        <option value="">No role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name} {role.isSystem && '(System)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowInviteDialog(false)}
                                        disabled={inviteLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={inviteLoading}>
                                        {inviteLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Invite User
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
