import { create } from 'zustand'

const USERS_STORAGE_KEY = 'driveease-users'
const AUTH_STORAGE_KEY = 'driveease-auth'
const VENDOR_CARS_STORAGE_KEY = 'driveease-vendor-cars'
const VENDOR_BOOKINGS_STORAGE_KEY = 'driveease-vendor-bookings'
const VENDOR_PAYOUT_REQUESTS_STORAGE_KEY = 'driveease-vendor-payout-requests'
const VENDOR_PROFILES_STORAGE_KEY = 'driveease-vendor-profiles'
const ADMIN_SETTINGS_STORAGE_KEY = 'driveease-admin-settings'

const demoUsers = [
  { id: 'u-1', name: 'Ava Carter', email: 'user@driveease.app', password: 'User@1234', role: 'user', bookingCount: 12, status: 'Active' },
  { id: 'a-1', name: 'Maya Admin', email: 'admin@driveease.app', password: 'Admin@1234', role: 'admin', bookingCount: 0, status: 'Active' },
  { id: 'v-1', name: 'Noah Vendor', email: 'vendor@driveease.app', password: 'Vendor@1234', role: 'vendor', bookingCount: 0, status: 'Active' },
]

const demoVendorProfiles = [
  { id: 'vp-demo', name: 'Noah Vendor', email: 'vendor@driveease.app', listings: 6, status: 'Approved' },
  { id: 'vp-1', name: 'Urban Wheels', email: 'ops@urbanwheels.io', listings: 24, status: 'Pending' },
  { id: 'vp-2', name: 'MetroWheel', email: 'hello@metrowheel.in', listings: 18, status: 'Approved' },
  { id: 'vp-3', name: 'Prime Rentals', email: 'support@primerentals.in', listings: 39, status: 'Approved' },
  { id: 'vp-4', name: 'Northline Autos', email: 'team@northlineautos.in', listings: 9, status: 'Suspended' },
]

const demoAdminSettings = {
  commission: 12,
  locations: 'Delhi, Mumbai, Bengaluru, Hyderabad',
  paymentGateway: 'Razorpay',
}

const demoCars = [
  { id: '1', name: 'Tata Nexon EV', pricePerDay: 4200, rating: 4.9, type: 'SUV', seats: 5, transmission: 'Automatic', status: 'available', image: 'https://placehold.co/960x640/0f172a/e2e8f0?text=Tata+Nexon+EV' },
  { id: '2', name: 'Mahindra XUV700', pricePerDay: 6800, rating: 4.8, type: 'SUV', seats: 7, transmission: 'Automatic', status: 'rented', image: 'https://placehold.co/960x640/1e293b/e2e8f0?text=Mahindra+XUV700' },
  { id: '3', name: 'Maruti Suzuki Dzire', pricePerDay: 2900, rating: 4.6, type: 'Sedan', seats: 5, transmission: 'Automatic', status: 'available', image: 'https://placehold.co/960x640/334155/e2e8f0?text=Maruti+Dzire' },
  { id: '4', name: 'Toyota Innova Hycross', pricePerDay: 7900, rating: 4.95, type: 'Luxury', seats: 7, transmission: 'Automatic', status: 'maintenance', image: 'https://placehold.co/960x640/0b1220/f8fafc?text=Innova+Hycross' },
  { id: '5', name: 'Hyundai Creta', pricePerDay: 4500, rating: 4.5, type: 'SUV', seats: 5, transmission: 'Manual', status: 'available', image: 'https://placehold.co/960x640/1f2937/e2e8f0?text=Hyundai+Creta' },
  { id: '6', name: 'Kia Seltos', pricePerDay: 5200, rating: 4.85, type: 'SUV', seats: 5, transmission: 'Automatic', status: 'rented', image: 'https://placehold.co/960x640/111827/e2e8f0?text=Kia+Seltos' },
]

const demoBookings = [
  { id: 'DE-1101', car: 'Tata Nexon EV', dates: 'Apr 22 - Apr 25', status: 'Confirmed', amount: 12600 },
  { id: 'DE-1102', car: 'Mahindra XUV700', dates: 'Apr 28 - May 01', status: 'Pending', amount: 18900 },
  { id: 'DE-1103', car: 'Maruti Suzuki Dzire', dates: 'Mar 11 - Mar 16', status: 'Completed', amount: 14250 },
  { id: 'DE-1104', car: 'Toyota Innova Hycross', dates: 'Feb 03 - Feb 04', status: 'Cancelled', amount: 9900 },
  { id: 'DE-1105', car: 'Kia Seltos', dates: 'Jan 20 - Jan 23', status: 'Ongoing', amount: 23400 },
]

const hasWindow = typeof window !== 'undefined'

function loadUsers() {
  if (!hasWindow) {
    return demoUsers
  }

  const raw = window.localStorage.getItem(USERS_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers))
    return demoUsers
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : demoUsers
  } catch {
    return demoUsers
  }
}

function saveUsers(users) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

function loadAuth() {
  if (!hasWindow) {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }

  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.isAuthenticated) {
      return { isAuthenticated: false, role: null, name: '', email: '' }
    }
    return {
      isAuthenticated: true,
      role: parsed.role,
      name: parsed.name,
      email: parsed.email,
    }
  } catch {
    return { isAuthenticated: false, role: null, name: '', email: '' }
  }
}

function saveAuth(auth) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

function loadVendorCars() {
  if (!hasWindow) {
    return demoCars
  }

  const raw = window.localStorage.getItem(VENDOR_CARS_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(VENDOR_CARS_STORAGE_KEY, JSON.stringify(demoCars))
    return demoCars
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : demoCars
  } catch {
    return demoCars
  }
}

function saveVendorCars(cars) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(VENDOR_CARS_STORAGE_KEY, JSON.stringify(cars))
}

function loadVendorBookings() {
  if (!hasWindow) {
    return demoBookings
  }

  const raw = window.localStorage.getItem(VENDOR_BOOKINGS_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(VENDOR_BOOKINGS_STORAGE_KEY, JSON.stringify(demoBookings))
    return demoBookings
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : demoBookings
  } catch {
    return demoBookings
  }
}

function loadVendorProfiles() {
  if (!hasWindow) {
    return demoVendorProfiles
  }

  const raw = window.localStorage.getItem(VENDOR_PROFILES_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(VENDOR_PROFILES_STORAGE_KEY, JSON.stringify(demoVendorProfiles))
    return demoVendorProfiles
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.length) {
      return demoVendorProfiles
    }

    const missingDemoProfiles = demoVendorProfiles.filter(
      (demoProfile) =>
        !parsed.some((profile) => profile.email.toLowerCase() === demoProfile.email.toLowerCase()),
    )

    if (missingDemoProfiles.length) {
      const mergedProfiles = [...missingDemoProfiles, ...parsed]
      saveVendorProfiles(mergedProfiles)
      return mergedProfiles
    }

    return parsed
  } catch {
    return demoVendorProfiles
  }
}

function saveVendorProfiles(profiles) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(VENDOR_PROFILES_STORAGE_KEY, JSON.stringify(profiles))
}

function loadAdminSettings() {
  if (!hasWindow) {
    return demoAdminSettings
  }

  const raw = window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY)
  if (!raw) {
    window.localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(demoAdminSettings))
    return demoAdminSettings
  }

  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : demoAdminSettings
  } catch {
    return demoAdminSettings
  }
}

function saveAdminSettings(settings) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

function saveVendorBookings(bookings) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(VENDOR_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
}

function loadVendorPayoutRequests() {
  if (!hasWindow) {
    return []
  }

  const raw = window.localStorage.getItem(VENDOR_PAYOUT_REQUESTS_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveVendorPayoutRequests(requests) {
  if (!hasWindow) {
    return
  }
  window.localStorage.setItem(VENDOR_PAYOUT_REQUESTS_STORAGE_KEY, JSON.stringify(requests))
}

function buildCarPayload(data, existingId = null) {
  const dailyPrice = Number(data.dailyPrice || data.pricePerDay || 0)
  const seats = Number(data.seats || 5)
  const year = Number(data.year || new Date().getFullYear())

  return {
    id: existingId || `car-${Date.now()}`,
    name: data.name?.trim() || 'Untitled Car',
    brand: data.brand?.trim() || '',
    modelYear: year,
    type: data.type || 'SUV',
    seats,
    transmission: data.transmission || 'Automatic',
    fuel: data.fuel || 'Petrol',
    features: data.features || '',
    image: data.image || `https://placehold.co/960x640/0f172a/e2e8f0?text=${encodeURIComponent(data.name?.trim() || 'DriveEase+Car')}`,
    pricePerDay: dailyPrice,
    weeklyPrice: Number(data.weeklyPrice || 0),
    monthlyPrice: Number(data.monthlyPrice || 0),
    location: data.location || '',
    availableFrom: data.availableFrom || '',
    availableTo: data.availableTo || '',
    status: data.status || 'available',
    rating: data.rating || 4.8,
  }
}

export const useAppStore = create((set) => ({
  auth: loadAuth(),
  users: loadUsers(),
  vendorCars: loadVendorCars(),
  vendorBookings: loadVendorBookings(),
  vendorProfiles: loadVendorProfiles(),
  adminSettings: loadAdminSettings(),
  vendorPayoutRequests: loadVendorPayoutRequests(),
  bookingDraft: {
    carId: '',
    carName: '',
    carPricePerDay: 0,
    dates: '',
    pickup: '',
    extras: [],
    paymentMethod: '',
  },
  signIn: ({ email, password, allowedRoles }) => {
    let result = { success: false, reason: 'invalid' }

    set((state) => {
      const user = state.users.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
      )

      if (!user) {
        return state
      }

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        result = { success: false, reason: 'role-mismatch', role: user.role }
        return state
      }

      if (user.role === 'vendor') {
        const vendorProfile = state.vendorProfiles.find(
          (profile) => profile.email.toLowerCase() === user.email.toLowerCase(),
        )

        if (vendorProfile?.status !== 'Approved') {
          result = {
            success: false,
            reason: 'vendor-not-approved',
            status: vendorProfile?.status || 'Pending',
          }
          return state
        }
      }

      result = { success: true, reason: 'success', role: user.role }
      const auth = {
        isAuthenticated: true,
        role: user.role,
        name: user.name,
        email: user.email,
      }

      saveAuth(auth)
      return { auth }
    })

    return result
  },
  signUp: ({ name, email, password, role }) => {
    let created = false

    set((state) => {
      if (!['user', 'vendor'].includes(role)) {
        return state
      }

      const exists = state.users.some((item) => item.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        return state
      }

      created = true
      const nextUsers = [
        ...state.users,
        {
          id: `u-${Date.now()}`,
          name,
          email,
          password,
          role,
          bookingCount: 0,
          status: 'Active',
        },
      ]

      let nextVendorProfiles = state.vendorProfiles
      if (role === 'vendor') {
        nextVendorProfiles = [
          {
            id: `vp-${Date.now()}`,
            name,
            email,
            listings: 0,
            status: 'Pending',
          },
          ...state.vendorProfiles,
        ]
        saveVendorProfiles(nextVendorProfiles)
      }

      saveUsers(nextUsers)
      return { users: nextUsers, vendorProfiles: nextVendorProfiles }
    })

    return created
  },
  toggleUserStatus: (id) =>
    set((state) => {
      const nextUsers = state.users.map((user) => {
        if (user.id !== id) {
          return user
        }

        const status = user.status === 'Suspended' ? 'Active' : 'Suspended'
        return { ...user, status }
      })
      saveUsers(nextUsers)
      return { users: nextUsers }
    }),
  updateVendorStatus: (id, status) =>
    set((state) => {
      const nextProfiles = state.vendorProfiles.map((profile) =>
        profile.id === id ? { ...profile, status } : profile,
      )
      saveVendorProfiles(nextProfiles)
      return { vendorProfiles: nextProfiles }
    }),
  addVendorCar: (data) => {
    let createdCar = null

    set((state) => {
      const nextCars = [buildCarPayload(data), ...state.vendorCars]
      createdCar = nextCars[0]
      saveVendorCars(nextCars)
      return { vendorCars: nextCars }
    })

    return createdCar
  },
  updateVendorCar: (id, data) => {
    let updatedCar = null

    set((state) => {
      const nextCars = state.vendorCars.map((car) => {
        if (car.id !== id) {
          return car
        }

        const updated = buildCarPayload(data, id)
        updatedCar = updated
        return updated
      })

      saveVendorCars(nextCars)
      return { vendorCars: nextCars }
    })

    return updatedCar
  },
  deleteVendorCar: (id) =>
    set((state) => {
      const nextCars = state.vendorCars.filter((car) => car.id !== id)
      saveVendorCars(nextCars)
      return { vendorCars: nextCars }
    }),
  updateVendorBookingStatus: (id, status) =>
    set((state) => {
      const nextBookings = state.vendorBookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      )
      saveVendorBookings(nextBookings)
      return { vendorBookings: nextBookings }
    }),
  addUserBooking: (payload) => {
    let createdBooking = null

    set((state) => {
      const bookingId = `DE-${Math.floor(1000 + Math.random() * 9000)}`
      const dates = payload.pickupDate && payload.returnDate
        ? `${payload.pickupDate} - ${payload.returnDate}`
        : payload.dates || 'To be confirmed'

      const nextBookings = [
        {
          id: bookingId,
          car: payload.carName || 'Selected Car',
          dates,
          status: 'Confirmed',
          amount: Number(payload.carPricePerDay || 0),
        },
        ...state.vendorBookings,
      ]

      createdBooking = nextBookings[0]
      saveVendorBookings(nextBookings)
      return { vendorBookings: nextBookings }
    })

    return createdBooking
  },
  saveAdminSettings: (patch) =>
    set((state) => {
      const nextSettings = { ...state.adminSettings, ...patch }
      saveAdminSettings(nextSettings)
      return { adminSettings: nextSettings }
    }),
  requestVendorPayout: (amount) =>
    set((state) => {
      const nextRequests = [
        {
          id: `payout-${Date.now()}`,
          amount: Number(amount || 0),
          status: 'Submitted',
          requestedAt: new Date().toISOString(),
        },
        ...state.vendorPayoutRequests,
      ]

      saveVendorPayoutRequests(nextRequests)
      return { vendorPayoutRequests: nextRequests }
    }),
  logout: () =>
    set(() => {
      const auth = { isAuthenticated: false, role: null, name: '', email: '' }
      saveAuth(auth)
      return { auth }
    }),
  updateBookingDraft: (patch) =>
    set((state) => ({
      bookingDraft: { ...state.bookingDraft, ...patch },
    })),
  setBookingCar: (car) =>
    set((state) => ({
      bookingDraft: {
        ...state.bookingDraft,
        carId: String(car?.id || ''),
        carName: car?.name || '',
        carPricePerDay: Number(car?.pricePerDay || 0),
      },
    })),
  resetBookingDraft: () =>
    set({
      bookingDraft: {
        carId: '',
        carName: '',
        carPricePerDay: 0,
        dates: '',
        pickup: '',
        extras: [],
        paymentMethod: '',
      },
    }),
}))
