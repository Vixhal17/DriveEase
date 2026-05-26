import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function ProtectedRoute({ allowedRoles, loginPath = '/login', children }) {
  const auth = useAppStore((state) => state.auth)
  const vendorProfiles = useAppStore((state) => state.vendorProfiles)
  const logout = useAppStore((state) => state.logout)
  const vendorProfile = vendorProfiles.find(
    (profile) => profile.email.toLowerCase() === auth.email?.toLowerCase(),
  )
  const vendorBlocked = auth.isAuthenticated && auth.role === 'vendor' && vendorProfile?.status !== 'Approved'

  useEffect(() => {
    if (vendorBlocked) {
      logout()
    }
  }, [logout, vendorBlocked])

  if (!auth.isAuthenticated) {
    return <Navigate to={loginPath} replace />
  }

  if (vendorBlocked) {
    return null
  }

  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to={`/${auth.role}/dashboard`} replace />
  }

  return children
}
