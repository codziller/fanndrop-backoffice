import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ColumnDef } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, CheckCircle2 } from 'lucide-react';
import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from '@/api/hooks/useStaff';
import type { CreateStaffInput } from '@/api/hooks/useStaff';
import type { Staff, StaffRole } from '@/types/models';
import { STAFF_ROLE_OPTIONS } from '@/utils/constants';
import { formatRelativeDate } from '@/utils/format';
import { generatePassword } from '@/utils/helpers';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { UserAvatar } from '@/components/shared/UserAvatar';
import type { BadgeVariant } from '@/types/common';

// ─── Role badge map ──────────────────────────────────────────────────────────

const ROLE_BADGE_MAP: Record<StaffRole, BadgeVariant> = {
  Admin: 'gold',
  Moderator: 'info',
  Marketing: 'warning',
  Support: 'success',
};

// ─── Permissions matrix data ─────────────────────────────────────────────────

const PERMISSIONS_ROWS = [
  { label: 'View Dashboard',         admin: true,  moderator: true,  marketing: true,  support: true  },
  { label: 'Manage Artists / Fans',  admin: true,  moderator: true,  marketing: false, support: true  },
  { label: 'Delete Content',         admin: true,  moderator: true,  marketing: false, support: false },
  { label: 'Send Notifications',     admin: true,  moderator: false, marketing: true,  support: false },
  { label: 'Manage Staff',           admin: true,  moderator: false, marketing: false, support: false },
  { label: 'Manage Settings',        admin: true,  moderator: false, marketing: false, support: false },
] as const;

// ─── Add staff form schema ────────────────────────────────────────────────────

const addStaffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['Admin', 'Moderator', 'Marketing', 'Support'] as const),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  sendInvite: z.boolean(),
});

type AddStaffFormValues = z.infer<typeof addStaffSchema>;

// ─── Actions dropdown ─────────────────────────────────────────────────────────

interface StaffActionsProps {
  member: Staff;
  onEdit: (member: Staff) => void;
  onDeactivate: (member: Staff) => void;
  onDelete: (member: Staff) => void;
}

function StaffActions({ member, onEdit, onDeactivate, onDelete }: StaffActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Staff actions"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center text-t-subtle hover:text-t-default hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 z-20 mt-1 w-40 bg-bg-surface border border-border-subtle shadow-elevated"
          >
            <button
              type="button"
              className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
              onClick={() => { setOpen(false); onEdit(member); }}
            >
              Edit
            </button>
            <button
              type="button"
              className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
              onClick={() => { setOpen(false); onDeactivate(member); }}
            >
              {member.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button
              type="button"
              className="w-full px-4 py-2.5 text-left text-text-sm text-danger hover:bg-danger-bg transition-colors"
              onClick={() => { setOpen(false); onDelete(member); }}
            >
              Delete
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

// ─── Add staff modal ──────────────────────────────────────────────────────────

interface AddStaffModalProps {
  open: boolean;
  onClose: () => void;
}

function AddStaffModal({ open, onClose }: AddStaffModalProps) {
  const createStaff = useCreateStaff();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddStaffFormValues>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Support',
      password: '',
      sendInvite: false,
    },
  });

  const passwordValue = watch('password');

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(values: AddStaffFormValues) {
    const input: CreateStaffInput = {
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
      sendInvite: values.sendInvite,
    };
    await createStaff.mutateAsync(input);
    handleClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Staff Member"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={createStaff.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="add-staff-form"
            loading={createStaff.isPending}
          >
            Add Staff
          </Button>
        </>
      }
    >
      <form
        id="add-staff-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {/* Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Name"
              placeholder="Full name"
              value={field.value}
              onChange={field.onChange}
              error={errors.name?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email"
              type="email"
              placeholder="staff@fanndrop.com"
              value={field.value}
              onChange={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        {/* Role */}
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              label="Role"
              options={[...STAFF_ROLE_OPTIONS]}
              value={field.value}
              onChange={(v) => field.onChange(v as StaffRole)}
              error={errors.role?.message}
            />
          )}
        />

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <label className="text-text-sm text-t-subtle font-medium">Password</label>
            <button
              type="button"
              onClick={() => setValue('password', generatePassword())}
              className="text-text-xs text-brand hover:text-brand-hover transition-colors"
            >
              Generate
            </button>
          </div>
          <Input
            type="password"
            placeholder="Min. 8 characters"
            value={passwordValue}
            onChange={(v) => setValue('password', v)}
            error={errors.password?.message}
          />
        </div>

        {/* Send invite */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('sendInvite')}
            className="w-4 h-4 accent-brand cursor-pointer"
          />
          <span className="text-text-sm text-t-default">Send invite email</span>
        </label>
      </form>
    </Modal>
  );
}

// ─── Permissions matrix ───────────────────────────────────────────────────────

function PermissionsMatrix() {
  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="text-text-md font-semibold text-t-bold">Role Permissions Matrix</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="px-4 py-3 text-left text-text-xs font-semibold text-t-subtle whitespace-nowrap">
                Permission
              </th>
              {(['Admin', 'Moderator', 'Marketing', 'Support'] as const).map((role) => (
                <th
                  key={role}
                  className="px-4 py-3 text-center text-text-xs font-semibold text-t-subtle whitespace-nowrap"
                >
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS_ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors"
              >
                <td className="px-4 py-3 text-text-sm text-t-default whitespace-nowrap">
                  {row.label}
                </td>
                {(
                  [
                    { key: 'admin', value: row.admin },
                    { key: 'moderator', value: row.moderator },
                    { key: 'marketing', value: row.marketing },
                    { key: 'support', value: row.support },
                  ] as const
                ).map(({ key, value }) => (
                  <td key={key} className="px-4 py-3 text-center">
                    {value ? (
                      <CheckCircle2 size={16} className="text-success inline-block" />
                    ) : (
                      <span className="text-t-disabled text-text-sm">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const { data: staff = [], isLoading } = useStaff();
  const deleteStaff = useDeleteStaff();
  const updateStaff = useUpdateStaff();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);

  function handleDeactivate(member: Staff) {
    updateStaff.mutate({
      id: member.id,
      status: member.status === 'active' ? 'inactive' : 'active',
    });
  }

  function handleDelete(member: Staff) {
    setDeleteTarget(member);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteStaff.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  const columns = useMemo<ColumnDef<Staff>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <UserAvatar
            name={row.original.name}
            sub={row.original.email}
            avatar={`https://picsum.photos/seed/${row.original.name.replace(/\s+/g, '')}/40/40`}
            size="sm"
          />
        ),
        size: 240,
      },
      {
        id: 'role',
        header: 'Role',
        accessorKey: 'role',
        cell: ({ getValue }) => {
          const role = getValue<StaffRole>();
          return <Badge variant={ROLE_BADGE_MAP[role]}>{role}</Badge>;
        },
        size: 120,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue<'active' | 'inactive'>();
          return (
            <Badge variant={status === 'active' ? 'success' : 'default'}>
              {status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          );
        },
        size: 100,
      },
      {
        id: 'lastLogin',
        header: 'Last Login',
        accessorKey: 'lastLogin',
        cell: ({ getValue }) => {
          const val = getValue<string>();
          return (
            <span className="text-text-sm text-t-subtle">
              {val && val !== '-' ? formatRelativeDate(val) : 'Never'}
            </span>
          );
        },
        size: 140,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 48,
        cell: ({ row }) => (
          <StaffActions
            member={row.original}
            onEdit={() => {/* edit flow handled inline */}}
            onDeactivate={handleDeactivate}
            onDelete={handleDelete}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <PageHeader title="Staff" count={staff.length}>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Staff
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={staff}
        isLoading={isLoading}
        emptyMessage="No staff members found."
      />

      <PermissionsMatrix />

      {/* Add staff modal */}
      <AddStaffModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Remove Staff Member"
        message={`This will permanently remove ${deleteTarget?.name ?? 'this staff member'} from the platform.`}
        confirmLabel="Remove"
        isLoading={deleteStaff.isPending}
        variant="danger"
      />
    </motion.div>
  );
}
