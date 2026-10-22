import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  RoleDefinition,
  SYSTEM_PERMISSIONS,
  DEFAULT_SYSTEM_ROLES,
  AuditLog,
  AccountStatus,
} from '../../types';
import {
  getUsersList,
  updateUserRole,
  updateUserAccountStatus,
  getRoles,
  saveRole,
  deleteRole,
  logAuditEvent,
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Shield,
  Key,
  Search,
  Filter,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Edit2,
  Lock,
  Unlock,
  Check,
  History,
  Info,
  Save,
  X,
  UserCheck,
  UserX,
} from 'lucide-react';

interface UserManagementSectionProps {
  onRefreshData: () => void;
  showNotice: (msg: string) => void;
  onRequestDeleteUser: (user: UserProfile) => void;
}

export const UserManagementSection: React.FC<UserManagementSectionProps> = ({
  onRefreshData,
  showNotice,
  onRequestDeleteUser,
}) => {
  const { currentUser, refreshRoles } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_SYSTEM_ROLES);
  const [loading, setLoading] = useState(true);

  // Search and Filter states for users
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');

  // Role creation/edit modal state
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [roleModalError, setRoleModalError] = useState<string | null>(null);

  // User detail/role assignment modal state
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  const [assignedRoleForUser, setAssignedRoleForUser] = useState<string>('customer');
  const [savingUserRole, setSavingUserRole] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uList, rList] = await Promise.all([getUsersList(), getRoles()]);
      setUsers(uList || []);
      setRoles(rList || DEFAULT_SYSTEM_ROLES);
    } catch (err) {
      console.warn('User management load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (u.displayName && u.displayName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      u.uid.toLowerCase().includes(query) ||
      (u.company && u.company.toLowerCase().includes(query));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesVerification =
      verificationFilter === 'all' ||
      (verificationFilter === 'verified' && u.emailVerified) ||
      (verificationFilter === 'unverified' && !u.emailVerified);

    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  // Handle direct account status toggle (Enable/Disable)
  const handleToggleStatus = async (user: UserProfile) => {
    const isProtectedAdmin =
      user.email === 'arabsafashion@gmail.com' || user.uid === currentUser?.uid;
    if (isProtectedAdmin) {
      showNotice('Administrative safety lock: Cannot disable primary system administrator.');
      return;
    }

    const nextStatus: AccountStatus = user.status === 'active' ? 'disabled' : 'active';
    try {
      await updateUserAccountStatus(user.uid, nextStatus);
      await logAuditEvent(
        'TOGGLE_ACCOUNT_STATUS',
        'User',
        user.uid,
        `Changed account status of ${user.email} from ${user.status} to ${nextStatus}`,
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      setUsers((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, status: nextStatus } : u))
      );
      showNotice(`User account ${user.email} is now ${nextStatus}.`);
      onRefreshData();
    } catch (err: any) {
      alert(`Failed to update user status: ${err?.message || 'Database error'}`);
    }
  };

  // Handle saving assigned role to user
  const handleSaveAssignedRole = async () => {
    if (!selectedUserForEdit) return;
    const isProtectedAdmin =
      selectedUserForEdit.email === 'arabsafashion@gmail.com' && assignedRoleForUser !== 'admin';
    if (isProtectedAdmin) {
      alert('Cannot revoke administrator status from the primary system owner.');
      return;
    }

    setSavingUserRole(true);
    try {
      await updateUserRole(selectedUserForEdit.uid, assignedRoleForUser);
      await logAuditEvent(
        'ASSIGN_USER_ROLE',
        'User',
        selectedUserForEdit.uid,
        `Assigned role "${assignedRoleForUser}" to ${selectedUserForEdit.email} (Previous: ${selectedUserForEdit.role})`,
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === selectedUserForEdit.uid ? { ...u, role: assignedRoleForUser } : u
        )
      );
      showNotice(`Assigned role "${assignedRoleForUser}" to ${selectedUserForEdit.email}.`);
      setSelectedUserForEdit(null);
      onRefreshData();
    } catch (err: any) {
      alert(`Failed to assign role: ${err?.message || 'Database error'}`);
    } finally {
      setSavingUserRole(false);
    }
  };

  // Handle open create new role
  const handleOpenCreateRole = () => {
    setEditingRole({
      id: '',
      name: '',
      description: '',
      isSystem: false,
      permissions: ['profile.view', 'profile.edit', 'consultation.view', 'consultation.create'],
      createdAt: new Date().toISOString(),
    });
    setIsCreatingRole(true);
    setRoleModalError(null);
  };

  // Handle open edit role
  const handleOpenEditRole = (role: RoleDefinition) => {
    setEditingRole({ ...role, permissions: [...role.permissions] });
    setIsCreatingRole(false);
    setRoleModalError(null);
  };

  // Toggle permission in role modal
  const handleTogglePermission = (permKey: string) => {
    if (!editingRole) return;
    const exists = editingRole.permissions.includes(permKey);
    const updated = exists
      ? editingRole.permissions.filter((p) => p !== permKey)
      : [...editingRole.permissions, permKey];
    setEditingRole({ ...editingRole, permissions: updated });
  };

  // Handle save role
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    if (!editingRole.name.trim()) {
      setRoleModalError('Role display name is required.');
      return;
    }

    let roleId = editingRole.id.trim();
    if (isCreatingRole) {
      if (!roleId) {
        roleId = editingRole.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      }
      if (!roleId) {
        setRoleModalError('A valid alphanumeric Role ID identifier is required.');
        return;
      }
      // Check if roleId already exists
      if (roles.some((r) => r.id === roleId)) {
        setRoleModalError(`A role with ID "${roleId}" already exists. Please pick a unique identifier.`);
        return;
      }
    }

    setSavingRole(true);
    setRoleModalError(null);

    const payload: RoleDefinition = {
      ...editingRole,
      id: roleId,
      name: editingRole.name.trim(),
      description: editingRole.description.trim(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveRole(payload);
      await logAuditEvent(
        isCreatingRole ? 'CREATE_ROLE' : 'UPDATE_ROLE',
        'RoleDefinition',
        payload.id,
        `${isCreatingRole ? 'Created' : 'Updated'} role "${payload.name}" with ${payload.permissions.length} permissions`,
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      await refreshRoles();
      await loadData();
      showNotice(`Role "${payload.name}" saved successfully.`);
      setEditingRole(null);
    } catch (err: any) {
      setRoleModalError(err?.message || 'Failed to save role definition to Firestore.');
    } finally {
      setSavingRole(false);
    }
  };

  // Handle delete custom role
  const handleDeleteRole = async (role: RoleDefinition) => {
    if (role.isSystem || role.id === 'admin' || role.id === 'customer') {
      alert('System critical roles cannot be deleted.');
      return;
    }

    const assignedCount = users.filter((u) => u.role === role.id).length;
    if (assignedCount > 0) {
      alert(
        `Cannot delete role "${role.name}": There are currently ${assignedCount} user(s) assigned to this role. Reassign them before deleting.`
      );
      return;
    }

    if (!window.confirm(`Are you sure you want to delete role "${role.name}" (${role.id})?`)) {
      return;
    }

    try {
      await deleteRole(role.id);
      await logAuditEvent(
        'DELETE_ROLE',
        'RoleDefinition',
        role.id,
        `Permanently deleted role "${role.name}" (${role.id})`,
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      await refreshRoles();
      await loadData();
      showNotice(`Role "${role.name}" deleted successfully.`);
    } catch (err: any) {
      alert(`Failed to delete role: ${err?.message || 'Database error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and SubTab Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-[#D5A13A] mb-1">
            <Shield className="w-5 h-5 text-[#b88528]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Access Control & RBAC
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F]">
            User Management & Permissions
          </h2>
          <p className="text-xs text-slate-500">
            Control registered customer identities, assign roles, configure permissions, and enforce data isolation.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 font-semibold rounded-md flex items-center space-x-1.5 transition-colors ${
              activeSubTab === 'users'
                ? 'bg-white text-[#10283F] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Users ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-3 py-1.5 font-semibold rounded-md flex items-center space-x-1.5 transition-colors ${
              activeSubTab === 'roles'
                ? 'bg-white text-[#10283F] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Roles & Permissions ({roles.length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: USER DIRECTORY & ACCESS                       */}
      {/* ======================================================== */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or UID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:border-[#b88528] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Role Filter */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Role:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#b88528]"
                >
                  <option value="all">All Roles</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#b88528]"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Email Verification Filter */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Email:</span>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-[#b88528]"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </div>

              {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || verificationFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setVerificationFilter('all');
                  }}
                  className="text-xs text-rose-600 hover:underline px-2 py-1"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User & Identity</th>
                    <th className="py-3 px-4">Email & Verification</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#D5A13A]" />
                        <span>Loading user accounts and permissions...</span>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No registered users match the search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSystemAdmin =
                        u.email === 'arabsafashion@gmail.com' || u.uid === currentUser?.uid;
                      const roleDef = roles.find((r) => r.id === u.role);
                      const roleName = roleDef ? roleDef.name : u.role;

                      return (
                        <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                          {/* User info */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#10283F] text-[#D5A13A] font-bold text-xs flex items-center justify-center shrink-0">
                                {(u.displayName || u.email || 'U')[0].toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">
                                  {u.displayName || 'Unnamed Client'}
                                </p>
                                <p className="font-mono text-[10px] text-slate-400 truncate">
                                  UID: {u.uid.substring(0, 14)}...
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Email & Verification */}
                          <td className="py-3 px-4">
                            <p className="text-slate-800 font-medium truncate max-w-[200px]">{u.email}</p>
                            <div className="mt-0.5">
                              {u.emailVerified ? (
                                <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                                  Unverified
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Assigned Role */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  u.role === 'admin'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : u.role === 'consultation_user'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                                }`}
                              >
                                {roleName}
                              </span>
                              {!isSystemAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedUserForEdit(u);
                                    setAssignedRoleForUser(u.role);
                                  }}
                                  className="text-slate-400 hover:text-[#10283F] p-1 rounded hover:bg-slate-100"
                                  title="Change User Role"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Account Status */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                u.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {u.status === 'active' ? (
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                              ) : (
                                <Lock className="w-3 h-3 mr-1 text-rose-600" />
                              )}
                              {u.status}
                            </span>
                          </td>

                          {/* Registered Date */}
                          <td className="py-3 px-4 text-slate-500 text-[11px]">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right space-x-2">
                            {!isSystemAdmin ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(u)}
                                  className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors inline-flex items-center space-x-1 ${
                                    u.status === 'active'
                                      ? 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100'
                                      : 'text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                  }`}
                                  title={u.status === 'active' ? 'Deactivate user' : 'Reactivate user'}
                                >
                                  {u.status === 'active' ? (
                                    <>
                                      <Lock className="w-3 h-3 mr-1" />
                                      <span>Disable</span>
                                    </>
                                  ) : (
                                    <>
                                      <Unlock className="w-3 h-3 mr-1" />
                                      <span>Enable</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onRequestDeleteUser(u)}
                                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors inline-flex items-center"
                                  title="Permanently Delete User Account"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  <span>Delete</span>
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                Protected Admin
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: ROLES & PERMISSIONS MATRIX                    */}
      {/* ======================================================== */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#10283F]">
                Configured Application Roles
              </h3>
              <p className="text-xs text-slate-500">
                Grant or revoke module access and fine-grained permissions. Changes take effect on subsequent user requests.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateRole}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md shadow flex items-center space-x-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D5A13A]" />
              <span>Create Custom Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((r) => {
              const assignedCount = users.filter((u) => u.role === r.id).length;
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded">
                          slug: {r.id}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-[#10283F]">
                          {r.name}
                        </h4>
                      </div>
                      {r.isSystem && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                          System Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{r.description}</p>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 pt-1 border-t border-slate-100">
                      <span>Assigned users: <strong className="text-slate-900">{assignedCount}</strong></span>
                      <span>&bull;</span>
                      <span>Permissions: <strong className="text-slate-900">{r.permissions.length}</strong></span>
                    </div>
                  </div>

                  {/* Permissions Pills Preview */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded border border-slate-100">
                    {r.permissions.map((pKey) => {
                      const meta = SYSTEM_PERMISSIONS.find((sp) => sp.key === pKey);
                      return (
                        <span
                          key={pKey}
                          className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-700 font-mono"
                          title={meta?.description || pKey}
                        >
                          {pKey}
                        </span>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenEditRole(r)}
                      className="text-[#b88528] hover:text-[#916215] font-semibold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Permissions</span>
                    </button>
                    {!r.isSystem && r.id !== 'admin' && r.id !== 'customer' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(r)}
                        className="text-rose-600 hover:text-rose-800 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Role</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ASSIGN ROLE TO USER                               */}
      {/* ======================================================== */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#b88528]" />
                <h3 className="font-serif text-lg font-bold text-[#10283F]">
                  Assign User Role
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900 text-sm">{selectedUserForEdit.displayName || 'Client'}</p>
              <p className="text-slate-600 font-mono text-[11px]">{selectedUserForEdit.email}</p>
              <p className="text-slate-400 text-[10px]">UID: {selectedUserForEdit.uid}</p>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Select Assigned Role:</label>
              <select
                value={assignedRoleForUser}
                onChange={(e) => setAssignedRoleForUser(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-[#b88528]"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.id}) — {r.permissions.length} permissions
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Assigning a role updates the user's authorization tier immediately for all protected requests and database access.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="px-4 py-2 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingUserRole}
                onClick={handleSaveAssignedRole}
                className="px-4 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded flex items-center space-x-1.5 shadow"
              >
                {savingUserRole ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Role Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ROLE DEFINITION & PERMISSIONS MATRIX               */}
      {/* ======================================================== */}
      {editingRole && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-[#b88528]" />
                <h3 className="font-serif text-lg font-bold text-[#10283F]">
                  {isCreatingRole ? 'Create New Role' : `Edit Role: ${editingRole.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {roleModalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{roleModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Role Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    placeholder="e.g. Senior Advisory Partner"
                    className="w-full p-2 border rounded bg-slate-50 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Role Identifier Slug <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreatingRole}
                    value={editingRole.id}
                    onChange={(e) => setEditingRole({ ...editingRole, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    placeholder="e.g. senior_partner"
                    className="w-full p-2 border rounded bg-slate-50 focus:bg-white text-slate-900 font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  placeholder="Define the scope and responsibilities of this role..."
                  className="w-full p-2 border rounded bg-slate-50 focus:bg-white text-slate-900"
                />
              </div>

              {/* PERMISSION CHECKBOX MATRIX */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 text-sm">
                    Configure Permissions ({editingRole.permissions.length} selected)
                  </label>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingRole({
                          ...editingRole,
                          permissions: SYSTEM_PERMISSIONS.map((p) => p.key),
                        })
                      }
                      className="text-slate-500 hover:text-[#10283F] underline text-[11px]"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRole({ ...editingRole, permissions: [] })}
                      className="text-slate-500 hover:text-rose-600 underline text-[11px]"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200/60">
                  {/* Group permissions by category */}
                  {Array.from(new Set(SYSTEM_PERMISSIONS.map((p) => p.category))).map((cat) => (
                    <div key={cat} className="py-2.5 first:pt-0 last:pb-0">
                      <h5 className="font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
                        {cat}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SYSTEM_PERMISSIONS.filter((p) => p.category === cat).map((p) => {
                          const isChecked = editingRole.permissions.includes(p.key);
                          return (
                            <label
                              key={p.key}
                              className={`flex items-start space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-amber-50/70 border-amber-300 text-slate-900'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(p.key)}
                                className="mt-0.5 rounded text-[#b88528] focus:ring-[#b88528]"
                              />
                              <div className="min-w-0">
                                <p className="font-semibold text-xs leading-tight">{p.label}</p>
                                <p className="text-[10px] font-mono text-slate-400">{p.key}</p>
                                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                  {p.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="px-4 py-2 text-slate-600 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRole}
                  className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded flex items-center space-x-1.5 shadow"
                >
                  {savingRole ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Role Definition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
