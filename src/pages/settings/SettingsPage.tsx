import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil } from 'lucide-react';
import {
  useSettings,
  useUpdateSettings,
  useUpdateFeatureFlag,
  useUpdateDropPackage,
} from '@/api/hooks/useSettings';
import type { AppSettings, DropPackage, FeatureFlags } from '@/types/models';
import { formatCurrencyFull } from '@/utils/format';
import { cn } from '@/utils/helpers';
import { Tabs } from '@/components/ui/Tabs';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  { id: 'versions', label: 'App Version & Updates' },
  { id: 'flags', label: 'Feature Flags' },
  { id: 'packages', label: 'Drop Packages' },
  { id: 'general', label: 'General' },
];

// ─── Tab 1: App Version & Updates ─────────────────────────────────────────────

const appVersionSchema = z.object({
  ios: z.string().min(1, 'iOS version required'),
  android: z.string().min(1, 'Android version required'),
});

type AppVersionValues = z.infer<typeof appVersionSchema>;

const forceUpdateSchema = z.object({
  enabled: z.boolean(),
  iosMinVersion: z.string(),
  androidMinVersion: z.string(),
  updateMessage: z.string(),
  iosUpdateUrl: z.string(),
  androidUpdateUrl: z.string(),
});

type ForceUpdateValues = z.infer<typeof forceUpdateSchema>;

const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z.string(),
});

type MaintenanceValues = z.infer<typeof maintenanceSchema>;

interface VersionTabProps {
  settings: AppSettings;
}

function VersionTab({ settings }: VersionTabProps) {
  const updateSettings = useUpdateSettings();

  // App version form
  const appVersionForm = useForm<AppVersionValues>({
    resolver: zodResolver(appVersionSchema),
    defaultValues: {
      ios: settings.appVersion.ios,
      android: settings.appVersion.android,
    },
  });

  // Force update form
  const forceUpdateForm = useForm<ForceUpdateValues>({
    resolver: zodResolver(forceUpdateSchema),
    defaultValues: {
      enabled: settings.forceUpdate.enabled,
      iosMinVersion: settings.forceUpdate.iosMinVersion,
      androidMinVersion: settings.forceUpdate.androidMinVersion,
      updateMessage: settings.forceUpdate.updateMessage ?? '',
      iosUpdateUrl: settings.forceUpdate.iosUpdateUrl ?? '',
      androidUpdateUrl: settings.forceUpdate.androidUpdateUrl ?? '',
    },
  });

  // Maintenance mode form
  const maintenanceForm = useForm<MaintenanceValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      enabled: settings.maintenanceMode.enabled,
      message: settings.maintenanceMode.message,
    },
  });

  const forceEnabled = forceUpdateForm.watch('enabled');
  const maintenanceEnabled = maintenanceForm.watch('enabled');

  function saveAppVersion(values: AppVersionValues) {
    updateSettings.mutate({ appVersion: values });
  }

  function saveForceUpdate(values: ForceUpdateValues) {
    updateSettings.mutate({ forceUpdate: values });
  }

  function saveMaintenance(values: MaintenanceValues) {
    updateSettings.mutate({ maintenanceMode: { ...settings.maintenanceMode, ...values } });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* App Version Card */}
      <Card>
        <h3 className="text-text-md font-semibold text-t-bold mb-5">App Version</h3>
        <form
          onSubmit={appVersionForm.handleSubmit(saveAppVersion)}
          noValidate
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="ios"
              control={appVersionForm.control}
              render={({ field }) => (
                <Input
                  label="iOS Version"
                  placeholder="e.g. 2.4.1"
                  value={field.value}
                  onChange={field.onChange}
                  error={appVersionForm.formState.errors.ios?.message}
                />
              )}
            />
            <Controller
              name="android"
              control={appVersionForm.control}
              render={({ field }) => (
                <Input
                  label="Android Version"
                  placeholder="e.g. 2.4.1"
                  value={field.value}
                  onChange={field.onChange}
                  error={appVersionForm.formState.errors.android?.message}
                />
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={updateSettings.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </Card>

      {/* Force Update Card */}
      <Card>
        <h3 className="text-text-md font-semibold text-t-bold mb-5">Force Update</h3>
        <form
          onSubmit={forceUpdateForm.handleSubmit(saveForceUpdate)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Controller
            name="enabled"
            control={forceUpdateForm.control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={field.onChange}
                label="Force Update"
              />
            )}
          />

          <AnimatePresence>
            {forceEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="iosMinVersion"
                    control={forceUpdateForm.control}
                    render={({ field }) => (
                      <Input
                        label="iOS Min Version"
                        placeholder="e.g. 2.0.0"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    name="androidMinVersion"
                    control={forceUpdateForm.control}
                    render={({ field }) => (
                      <Input
                        label="Android Min Version"
                        placeholder="e.g. 2.0.0"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-sm text-t-subtle font-medium">
                    Update Message
                  </label>
                  <textarea
                    {...forceUpdateForm.register('updateMessage')}
                    placeholder="Message shown to users who need to update"
                    className={cn(
                      'w-full h-24 bg-bg-surface border border-border text-t-default text-text-sm',
                      'placeholder:text-t-subtle rounded-none px-3 py-2.5 resize-none',
                      'transition-colors duration-150 focus:outline-none',
                      'focus:border-border-focus focus:shadow-focus-brand',
                    )}
                  />
                </div>

                <Controller
                  name="iosUpdateUrl"
                  control={forceUpdateForm.control}
                  render={({ field }) => (
                    <Input
                      label="iOS App Store URL"
                      placeholder="https://apps.apple.com/…"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  name="androidUpdateUrl"
                  control={forceUpdateForm.control}
                  render={({ field }) => (
                    <Input
                      label="Android Play Store URL"
                      placeholder="https://play.google.com/…"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={updateSettings.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </Card>

      {/* Maintenance Mode Card */}
      <Card>
        <h3 className="text-text-md font-semibold text-t-bold mb-1">Maintenance Mode</h3>
        <p className="text-text-sm text-t-subtle mb-5">
          Shows maintenance screen to all users
        </p>
        <form
          onSubmit={maintenanceForm.handleSubmit(saveMaintenance)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Controller
            name="enabled"
            control={maintenanceForm.control}
            render={({ field }) => (
              <Toggle
                checked={field.value}
                onChange={field.onChange}
                label="Maintenance Mode"
              />
            )}
          />

          <AnimatePresence>
            {maintenanceEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-text-sm text-t-subtle font-medium">
                    Maintenance Message
                  </label>
                  <textarea
                    {...maintenanceForm.register('message')}
                    placeholder="Message shown to users during maintenance"
                    className={cn(
                      'w-full h-24 bg-bg-surface border border-border text-t-default text-text-sm',
                      'placeholder:text-t-subtle rounded-none px-3 py-2.5 resize-none',
                      'transition-colors duration-150 focus:outline-none',
                      'focus:border-border-focus focus:shadow-focus-brand',
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={updateSettings.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// ─── Tab 2: Feature Flags ─────────────────────────────────────────────────────

const FLAG_META: Record<keyof FeatureFlags, { label: string; description: string }> = {
  enable_stories: {
    label: 'Stories',
    description: 'Enable/disable Stories feature',
  },
  enable_polls: {
    label: 'Polls',
    description: 'Enable/disable Polls',
  },
  enable_campaigns: {
    label: 'Campaigns',
    description: 'Enable/disable Campaigns',
  },
  enable_video_feed: {
    label: 'Video Feed',
    description: 'Enable/disable Video Reel Feed',
  },
};

interface FeatureFlagsTabProps {
  settings: AppSettings;
}

function FeatureFlagsTab({ settings }: FeatureFlagsTabProps) {
  const updateFeatureFlag = useUpdateFeatureFlag();

  const flagKeys = Object.keys(settings.featureFlags) as Array<keyof FeatureFlags>;

  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="text-text-md font-semibold text-t-bold">Feature Flags</h3>
      </div>
      <div className="divide-y divide-border-subtle">
        {flagKeys.map((flag) => {
          const meta = FLAG_META[flag];
          const enabled = settings.featureFlags[flag];

          return (
            <div
              key={flag}
              className="flex items-center justify-between px-6 py-4 gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-text-sm font-medium text-t-bold">{meta.label}</p>
                <p className="text-text-xs text-t-subtle mt-0.5">{meta.description}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-text-xs text-t-subtle hidden sm:block">
                  Last updated: today
                </span>
                <Toggle
                  checked={enabled}
                  onChange={(val) =>
                    updateFeatureFlag.mutate({ flag, enabled: val })
                  }
                  id={`flag-${flag}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Tab 3: Drop Packages ─────────────────────────────────────────────────────

const editPackageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  drops: z.number({ error: 'Enter a valid number' }).int().positive('Must be positive'),
  priceNaira: z.number({ error: 'Enter a valid number' }).positive('Must be positive'),
  chargesNaira: z.number({ error: 'Enter a valid number' }).nonnegative('Must be 0 or more'),
  active: z.boolean(),
});

type EditPackageValues = z.infer<typeof editPackageSchema>;

interface EditPackageModalProps {
  pkg: DropPackage;
  onClose: () => void;
}

function EditPackageModal({ pkg, onClose }: EditPackageModalProps) {
  const updateDropPackage = useUpdateDropPackage();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditPackageValues>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: {
      name: pkg.name,
      drops: pkg.drops,
      priceNaira: pkg.priceNaira,
      chargesNaira: pkg.chargesNaira,
      active: pkg.active,
    },
  });

  const activeValue = watch('active');

  async function onSubmit(values: EditPackageValues) {
    await updateDropPackage.mutateAsync({ ...pkg, ...values });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Drop Package"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={updateDropPackage.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="edit-package-form"
            loading={updateDropPackage.isPending}
          >
            Save
          </Button>
        </>
      }
    >
      <form
        id="edit-package-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-text-sm text-t-subtle font-medium">Name</label>
          <input
            {...register('name')}
            placeholder="Package name"
            className={cn(
              'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
              'placeholder:text-t-subtle rounded-none px-3',
              'transition-colors duration-150 focus:outline-none',
              'focus:border-border-focus focus:shadow-focus-brand',
              errors.name ? 'border-danger' : 'border-border',
            )}
          />
          {errors.name && (
            <p className="text-text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

        {/* Drops */}
        <div className="flex flex-col gap-1">
          <label className="text-text-sm text-t-subtle font-medium">Drops</label>
          <input
            type="number"
            {...register('drops', { valueAsNumber: true })}
            placeholder="Number of drops"
            className={cn(
              'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
              'placeholder:text-t-subtle rounded-none px-3',
              'transition-colors duration-150 focus:outline-none',
              'focus:border-border-focus focus:shadow-focus-brand',
              errors.drops ? 'border-danger' : 'border-border',
            )}
          />
          {errors.drops && (
            <p className="text-text-xs text-danger">{errors.drops.message}</p>
          )}
        </div>

        {/* Price / Charges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-text-sm text-t-subtle font-medium">Price ₦</label>
            <input
              type="number"
              {...register('priceNaira', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
                'placeholder:text-t-subtle rounded-none px-3',
                'transition-colors duration-150 focus:outline-none',
                'focus:border-border-focus focus:shadow-focus-brand',
                errors.priceNaira ? 'border-danger' : 'border-border',
              )}
            />
            {errors.priceNaira && (
              <p className="text-text-xs text-danger">{errors.priceNaira.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-text-sm text-t-subtle font-medium">Charges ₦</label>
            <input
              type="number"
              {...register('chargesNaira', { valueAsNumber: true })}
              placeholder="0"
              className={cn(
                'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
                'placeholder:text-t-subtle rounded-none px-3',
                'transition-colors duration-150 focus:outline-none',
                'focus:border-border-focus focus:shadow-focus-brand',
                errors.chargesNaira ? 'border-danger' : 'border-border',
              )}
            />
            {errors.chargesNaira && (
              <p className="text-text-xs text-danger">{errors.chargesNaira.message}</p>
            )}
          </div>
        </div>

        {/* Active toggle */}
        <Toggle
          checked={activeValue}
          onChange={(v) => setValue('active', v)}
          label={activeValue ? 'Active' : 'Inactive'}
          id="edit-package-active"
        />
      </form>
    </Modal>
  );
}

interface DropPackagesTabProps {
  settings: AppSettings;
}

function DropPackagesTab({ settings }: DropPackagesTabProps) {
  const [editingPkg, setEditingPkg] = useState<DropPackage | null>(null);

  return (
    <>
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="text-text-md font-semibold text-t-bold">Drop Packages</h3>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() =>
              setEditingPkg({
                id: '',
                name: '',
                drops: 0,
                priceNaira: 0,
                chargesNaira: 0,
                active: true,
              })
            }
          >
            Add Package
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-subtle">
                {['Package', 'Drops', 'Price (₦)', 'Charges (₦)', 'Status', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-text-xs font-semibold text-t-subtle whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settings.dropPackages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-hover/50 transition-colors"
                >
                  <td className="px-4 py-3 text-text-sm font-medium text-t-bold whitespace-nowrap">
                    {pkg.name}
                  </td>
                  <td className="px-4 py-3 text-text-sm text-t-default whitespace-nowrap">
                    {pkg.drops.toLocaleString('en-NG')}
                  </td>
                  <td className="px-4 py-3 text-text-sm text-t-default whitespace-nowrap">
                    {formatCurrencyFull(pkg.priceNaira)}
                  </td>
                  <td className="px-4 py-3 text-text-sm text-t-default whitespace-nowrap">
                    {formatCurrencyFull(pkg.chargesNaira)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={pkg.active ? 'success' : 'danger'} size="sm">
                      {pkg.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setEditingPkg(pkg)}
                      aria-label={`Edit ${pkg.name}`}
                      className="w-8 h-8 flex items-center justify-center text-t-subtle hover:text-t-default hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {editingPkg && (
        <EditPackageModal
          pkg={editingPkg}
          onClose={() => setEditingPkg(null)}
        />
      )}
    </>
  );
}

// ─── Tab 4: General ───────────────────────────────────────────────────────────

const generalSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  supportEmail: z.string().email('Enter a valid email'),
  tosUrl: z.string().url('Enter a valid URL'),
  privacyUrl: z.string().url('Enter a valid URL'),
});

type GeneralFormValues = z.infer<typeof generalSchema>;

interface GeneralTabProps {
  settings: AppSettings;
}

function GeneralTab({ settings }: GeneralTabProps) {
  const updateSettings = useUpdateSettings();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      platformName: settings.general.platformName,
      supportEmail: settings.general.supportEmail,
      tosUrl: settings.general.tosUrl,
      privacyUrl: settings.general.privacyUrl,
    },
  });

  // Sync form if settings change externally
  useEffect(() => {
    reset({
      platformName: settings.general.platformName,
      supportEmail: settings.general.supportEmail,
      tosUrl: settings.general.tosUrl,
      privacyUrl: settings.general.privacyUrl,
    });
  }, [settings.general, reset]);

  function onSubmit(values: GeneralFormValues) {
    updateSettings.mutate({ general: values });
  }

  return (
    <Card>
      <h3 className="text-text-md font-semibold text-t-bold mb-5">General Settings</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Controller
          name="platformName"
          control={control}
          render={({ field }) => (
            <Input
              label="Platform Name"
              placeholder="Fanndrop"
              value={field.value}
              onChange={field.onChange}
              error={errors.platformName?.message}
            />
          )}
        />
        <Controller
          name="supportEmail"
          control={control}
          render={({ field }) => (
            <Input
              label="Support Email"
              type="email"
              placeholder="support@fanndrop.com"
              value={field.value}
              onChange={field.onChange}
              error={errors.supportEmail?.message}
            />
          )}
        />
        <Controller
          name="tosUrl"
          control={control}
          render={({ field }) => (
            <Input
              label="Terms of Service URL"
              type="url"
              placeholder="https://fanndrop.com/terms"
              value={field.value}
              onChange={field.onChange}
              error={errors.tosUrl?.message}
            />
          )}
        />
        <Controller
          name="privacyUrl"
          control={control}
          render={({ field }) => (
            <Input
              label="Privacy Policy URL"
              type="url"
              placeholder="https://fanndrop.com/privacy"
              value={field.value}
              onChange={field.onChange}
              error={errors.privacyUrl?.message}
            />
          )}
        />
        <div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={updateSettings.isPending}
          >
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-bg-surface border border-border-subtle shadow-card h-40 animate-pulse"
        />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('versions');
  const { data: settings, isLoading } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-0">
        <h1 className="text-heading-xs font-bold text-t-bold mb-4">Settings</h1>
        <Tabs
          tabs={SETTINGS_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div>
        {isLoading || !settings ? (
          <SettingsSkeleton />
        ) : (
          <>
            {activeTab === 'versions' && <VersionTab settings={settings} />}
            {activeTab === 'flags' && <FeatureFlagsTab settings={settings} />}
            {activeTab === 'packages' && <DropPackagesTab settings={settings} />}
            {activeTab === 'general' && <GeneralTab settings={settings} />}
          </>
        )}
      </div>
    </motion.div>
  );
}
