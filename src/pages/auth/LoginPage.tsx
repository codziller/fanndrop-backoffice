import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import fanndropLogo from '@/assets/fanndrop-logo.svg';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setIsError(false);
    setErrorMessage('');
    try {
      await login(values.email, values.password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setIsError(true);
      setErrorMessage(
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.',
      );
    }
  }

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[480px]"
      >
        <motion.div
          animate={isError ? { x: [0, -10, 10, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-bg-surface border border-border-subtle shadow-elevated p-10"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={fanndropLogo}
              alt="Fanndrop"
              className="h-12 w-auto mb-3"
            />
            <span className="font-display text-display-xs text-brand">
              Fanndrop
            </span>
            <p className="text-text-sm text-t-subtle text-center mt-1">
              Admin Dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-email"
                className="text-text-sm text-t-subtle font-medium"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="admin@fanndrop.com"
                {...register('email')}
                className={cn(
                  'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
                  'placeholder:text-t-subtle rounded-none px-3',
                  'transition-colors duration-150 focus:outline-none',
                  'focus:border-border-focus focus:shadow-focus-brand',
                  errors.email
                    ? 'border-danger text-danger placeholder:text-danger/50'
                    : 'border-border',
                )}
              />
              {errors.email && (
                <p className="text-text-xs text-danger">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="login-password"
                className="text-text-sm text-t-subtle font-medium"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={cn(
                    'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
                    'placeholder:text-t-subtle rounded-none pl-3 pr-10',
                    'transition-colors duration-150 focus:outline-none',
                    'focus:border-border-focus focus:shadow-focus-brand',
                    errors.password
                      ? 'border-danger text-danger placeholder:text-danger/50'
                      : 'border-border',
                  )}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 text-t-subtle hover:text-t-default transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={isLoading ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className={cn(
                'mt-4 w-full h-11 bg-brand text-t-on-btn font-semibold text-text-sm',
                'hover:bg-brand-hover active:bg-brand-press rounded-none',
                'transition-colors duration-150 focus:outline-none',
                'focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
                'focus-visible:ring-offset-bg-app inline-flex items-center justify-center',
                isLoading && 'opacity-50 cursor-not-allowed pointer-events-none',
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Error message */}
            {isError && errorMessage && (
              <p className="text-danger text-text-sm text-center">{errorMessage}</p>
            )}
          </form>

          {/* Demo hint */}
          <p className="text-text-xs text-t-disabled text-center mt-6">
            Demo: admin@fanndrop.com / admin123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
