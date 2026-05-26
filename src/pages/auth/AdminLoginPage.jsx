import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input } from '../../components/common'
import { useAppStore } from '../../store/useAppStore'

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const signIn = useAppStore((state) => state.signIn)
  const auth = useAppStore((state) => state.auth)
  const navigate = useNavigate()

  if (auth.isAuthenticated) {
    const start = auth.role === 'user' ? '/user/landing' : `/${auth.role}/dashboard`
    return <Navigate to={start} replace />
  }

  const onSubmit = (values) => {
    const result = signIn({ ...values, allowedRoles: ['admin'] })
    if (!result.success) {
      if (result.reason === 'role-mismatch') {
        toast.error('This login is only for admin accounts')
        return
      }

      toast.error('Invalid email or password')
      return
    }

    const auth = useAppStore.getState().auth
    toast.success(`Signed in as ${auth.role}`)
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-hero-grid px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl rounded-card border border-slate-700 bg-surface/60 p-8 shadow-card">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-rose-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-200">
              DriveEase Admin Access
            </p>
            <h1 className="font-heading text-4xl font-bold">Admin Portal Login</h1>
            <p className="mt-4 text-slate-300">
              Use the dedicated admin sign-in to access fleet oversight, users, vendors, bookings, and revenue tools.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Role-restricted access</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Operations dashboard</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Revenue and fleet controls</div>
              <div className="rounded-card border border-slate-700 bg-deepNavy p-3">Audit-friendly session flow</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-card border border-slate-700 bg-deepNavy/70 p-6">
            <h2 className="font-heading text-2xl font-bold">Admin Sign In</h2>
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <button className="w-full rounded-control bg-accentAmber px-4 py-2 font-semibold text-deepNavy transition hover:bg-amber-300" type="submit">
              Login as Admin
            </button>

            <p className="text-center text-sm text-slate-300">
              Not an admin?{' '}
              <Link to="/login" className="font-semibold text-blue-300 hover:text-blue-200">
                Go to regular login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
