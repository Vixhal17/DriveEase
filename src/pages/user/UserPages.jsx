import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button, CarImage, Card, DataSkeleton, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useAppStore } from '../../store/useAppStore'
import { formatInrCurrency } from '../../utils/formatters'

export function UserLandingPage() {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  return (
    <PageShell title="Rent Better. Drive Smarter." subtitle="Discover premium cars from trusted vendors in minutes.">
      <Card className="bg-deepNavy/60 p-6">
        <form
          onSubmit={handleSubmit(() => navigate('/user/browse'))}
          className="grid gap-3 md:grid-cols-4"
        >
          <Input label="Pickup Location" placeholder="Downtown, NYC" {...register('location')} />
          <Input label="Start Date" type="date" {...register('startDate')} />
          <Input label="End Date" type="date" {...register('endDate')} />
          <Select label="Car Type" {...register('type')}>
            <option value="">Any Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Luxury">Luxury</option>
          </Select>
          <Button className="md:col-span-4" variant="amber" type="submit">
            Search Available Cars
          </Button>
        </form>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        {['Flexible plans', 'Verified vendors', '24/7 support'].map((item) => (
          <Card key={item} className="text-center">
            <h3 className="font-heading text-lg">{item}</h3>
            <p className="mt-2 text-sm text-slate-300">Built for smooth bookings and reliable road trips.</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-heading text-lg">How It Works</h3>
          <ol className="mt-3 space-y-2 text-sm text-slate-300">
            <li>1. Search by location, date, and style.</li>
            <li>2. Pick your car and add extras.</li>
            <li>3. Confirm booking and start driving.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="font-heading text-lg">Testimonials</h3>
          <p className="mt-3 text-sm text-slate-300">
            "DriveEase saved me two hours on business travel bookings. The UI is excellent and super clear."
          </p>
          <p className="mt-3 text-xs text-slate-400">- Maya, Product Lead</p>
        </Card>
      </section>
    </PageShell>
  )
}

export function UserBrowsePage() {
  const cars = useAppStore((state) => state.vendorCars)
  const navigate = useNavigate()
  const setBookingCar = useAppStore((state) => state.setBookingCar)

  return (
    <PageShell title="Browse & Search" subtitle="Filter by budget, type, seats, transmission, and brand.">
      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <Card className="h-fit space-y-3">
          <h3 className="font-heading text-lg">Filters</h3>
          <Input label="Price Range" placeholder="₹4,000 - ₹15,000" />
          <Select label="Car Type"><option>SUV</option><option>Sedan</option><option>Luxury</option></Select>
          <Select label="Seats"><option>4</option><option>5</option><option>7</option></Select>
          <Select label="Transmission"><option>Automatic</option><option>Manual</option></Select>
          <Select label="Brand"><option>Tesla</option><option>BMW</option><option>Toyota</option></Select>
        </Card>

        <div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <Card key={car.id} className="overflow-hidden p-0">
                <CarImage src={car.image} alt={car.name} className="h-36" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg">{car.name}</h3>
                    <span className="text-sm text-amber-300">{car.rating} / 5</span>
                  </div>
                  <p className="text-sm text-slate-300">{formatInrCurrency(car.pricePerDay)} / day</p>
                  <div className="flex gap-2">
                    <Button className="w-full" onClick={() => navigate(`/user/car/${car.id}`)}>View Details</Button>
                    <Button
                      className="w-full"
                      variant="amber"
                      onClick={() => {
                        setBookingCar(car)
                        toast.success('Car added for quick booking')
                        navigate('/user/booking-flow')
                      }}
                    >
                      Quick Book
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-2 text-sm">
            <Button variant="ghost">Previous</Button>
            <Button>1</Button>
            <Button variant="ghost">2</Button>
            <Button variant="ghost">3</Button>
            <Button variant="ghost">Next</Button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

export function UserCarDetailPage() {
  const { id } = useParams()
  const cars = useAppStore((state) => state.vendorCars)
  const navigate = useNavigate()
  const setBookingCar = useAppStore((state) => state.setBookingCar)
  const selected = useMemo(() => cars.find((c) => String(c.id) === id), [cars, id])

  return (
    <PageShell title="Car Detail" subtitle="Gallery, specs, availability, and verified vendor details.">
      {selected ? (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <CarImage src={selected.image} alt={`${selected.name} front`} className="h-44 rounded-control" />
              <CarImage src={selected.image} alt={`${selected.name} side`} className="h-44 rounded-control" />
              <CarImage src={selected.image} alt={`${selected.name} interior`} className="h-44 rounded-control sm:col-span-2" />
            </div>
            <h3 className="font-heading text-xl">{selected.name}</h3>
            <p className="text-sm text-slate-300">{selected.type} | {selected.seats} seats | {selected.transmission}</p>
            <p className="text-sm text-slate-300">Vendor: Urban Wheels Co. | Rating: {selected.rating}</p>
            <Card className="bg-deepNavy">
              <p className="text-sm text-slate-200">Availability Calendar (UI): Apr 24 - Apr 30 slots open.</p>
            </Card>
          </Card>

          <Card>
            <h3 className="font-heading text-lg">Booking Form</h3>
            <form className="mt-3 space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input label="Pickup" type="date" />
              <Input label="Dropoff" type="date" />
              <Select label="Location"><option>Downtown Hub</option><option>Airport</option></Select>
              <Button
                className="w-full"
                variant="amber"
                onClick={() => {
                  if (selected) {
                    setBookingCar(selected)
                  }
                  navigate('/user/booking-flow')
                }}
              >
                Continue to Booking
              </Button>
            </form>
            <div className="mt-4 border-t border-slate-700 pt-3">
              <h4 className="font-heading text-base">Reviews</h4>
              <p className="mt-2 text-sm text-slate-300">"Super clean and pickup was effortless."</p>
            </div>
          </Card>
        </div>
      ) : (
        <Card>
          <p className="text-sm text-slate-300">This car is no longer available.</p>
          <Button className="mt-4" onClick={() => navigate('/user/browse')}>Back to Browse</Button>
        </Card>
      )}
    </PageShell>
  )
}

export function UserBookingFlowPage() {
  const [step, setStep] = useState(1)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const updateBookingDraft = useAppStore((state) => state.updateBookingDraft)
  const bookingDraft = useAppStore((state) => state.bookingDraft)
  const resetBookingDraft = useAppStore((state) => state.resetBookingDraft)
  const addUserBooking = useAppStore((state) => state.addUserBooking)
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      paymentMethod: bookingDraft.paymentMethod || 'card',
    },
  })
  const paymentMethod = useWatch({ control, name: 'paymentMethod', defaultValue: 'card' })

  const submitStep = (values) => {
    const draft = { ...bookingDraft, ...values }
    updateBookingDraft(values)

    if (step < 3) {
      setStep((prev) => prev + 1)
      toast.success(`Step ${step} completed`)
      return
    }

    if (step === 3) {
      const createdBooking = addUserBooking(draft)
      setConfirmedBooking(createdBooking)
      setStep(4)
      toast.success('Booking confirmed!')
    }
  }

  return (
    <PageShell title="Booking Flow" subtitle="Dates and pickup -> Extras -> Payment -> Confirmation">
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className={`rounded-full px-3 py-1 ${step >= s ? 'bg-electricBlue/25 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
              Step {s}
            </span>
          ))}
        </div>

        {step < 4 ? (
          <form onSubmit={handleSubmit(submitStep)} className="grid gap-3 md:grid-cols-2">
            {step === 1 ? (
              <>
                <Input label="Pickup Date" type="date" {...register('pickupDate', { required: true })} />
                <Input label="Return Date" type="date" {...register('returnDate', { required: true })} />
                <Input label="Pickup Location" placeholder="Central Station" {...register('pickup')} />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <Select label="Insurance" {...register('insurance')}><option>Standard</option><option>Premium</option></Select>
                <Select label="GPS" {...register('gps')}><option>Yes</option><option>No</option></Select>
                <Select label="Child Seat" {...register('childSeat')}><option>None</option><option>1 Seat</option><option>2 Seats</option></Select>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <Select label="Payment Mode" {...register('paymentMethod')}>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </Select>

                {paymentMethod === 'card' ? (
                  <>
                    <Input label="Card Number" placeholder="**** **** **** 1988" {...register('card')} />
                    <Input label="Expiry" placeholder="08/29" {...register('expiry')} />
                    <Input label="CVV" placeholder="123" {...register('cvv')} />
                  </>
                ) : null}

                {paymentMethod === 'online' ? (
                  <>
                    <Select label="Online Method" {...register('onlineMethod')}>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                      <option value="wallet">Wallet</option>
                    </Select>
                    <Input label="UPI / Account ID" placeholder="name@bank" {...register('onlineId')} />
                  </>
                ) : null}

                {paymentMethod === 'cash' ? (
                  <div className="md:col-span-2 rounded-control border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-300">
                    Cash payment will be collected at pickup time.
                  </div>
                ) : null}
              </>
            ) : null}

            <Button className="md:col-span-2" variant="amber" type="submit">
              {step === 3 ? 'Confirm Booking' : 'Continue'}
            </Button>
          </form>
        ) : (
          <Card className="bg-emerald-900/20">
            <h3 className="font-heading text-xl">Booking Confirmed</h3>
            <p className="mt-2 text-sm text-slate-300">Your trip is locked in. Confirmation ID: {confirmedBooking?.id || 'DE-2026-4451'}</p>
            <p className="mt-2 text-sm text-slate-300">
              Confirmed vehicle:{' '}
              <span className="font-semibold text-white">{confirmedBooking?.car || bookingDraft.carName || 'Not selected'}</span>
            </p>
            {(confirmedBooking?.amount || bookingDraft.carPricePerDay) ? (
              <p className="mt-1 text-sm text-slate-300">Rate: {formatInrCurrency(confirmedBooking?.amount || bookingDraft.carPricePerDay)} / day</p>
            ) : null}
            <p className="mt-1 text-sm text-slate-300">Payment mode: {(bookingDraft.paymentMethod || 'card').toUpperCase()}</p>
            <Button
              className="mt-4"
              onClick={() => {
                setStep(1)
                setConfirmedBooking(null)
                resetBookingDraft()
              }}
            >
              Create Another Booking
            </Button>
          </Card>
        )}
      </Card>
    </PageShell>
  )
}

export function UserDashboardPage() {
  const bookings = useAppStore((state) => state.vendorBookings)
  const loading = false

  const totalSpent = bookings.reduce((sum, row) => sum + row.amount, 0)
  const activeUpcoming = bookings.filter((row) => ['Pending', 'Confirmed', 'Ongoing'].includes(row.status)).length

  return (
    <PageShell title="User Dashboard" subtitle="Track active trips and booking history quickly.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Active / Upcoming</p><p className="font-heading text-2xl">{activeUpcoming}</p></Card>
        <Card><p className="text-sm text-slate-300">Bookings History</p><p className="font-heading text-2xl">{bookings.length}</p></Card>
        <Card><p className="text-sm text-slate-300">Total Spent</p><p className="font-heading text-2xl">{formatInrCurrency(totalSpent)}</p></Card>
      </section>

      <Card>
        <h3 className="font-heading text-lg">Recent Bookings</h3>
        {loading ? <DataSkeleton rows={4} /> : null}
        {!loading ? (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2">Car</th><th>Dates</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {bookings.map((row) => (
                  <tr key={row.id} className="border-t border-slate-700">
                    <td className="py-3">{row.car}</td><td>{row.dates}</td><td>{formatInrCurrency(row.amount)}</td><td><StatusTag value={row.status} /></td>
                    <td><Button className="px-3 py-1 text-xs" variant="ghost">Re-book</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </PageShell>
  )
}

export function UserProfilePage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: 'Ava Carter',
      email: 'ava@driveease.app',
      notifications: true,
    },
  })

  return (
    <PageShell title="Profile" subtitle="Manage your account, license, password, and notifications.">
      <Card>
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={handleSubmit(() => toast.success('Profile updated successfully'))}
        >
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName', { required: 'Required' })} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email', { required: 'Required' })} />
          <Input label="Upload Driver License" type="file" {...register('license')} />
          <Input label="Change Password" type="password" {...register('password')} />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" {...register('notifications')} /> Email me booking and discount updates
          </label>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Changes</Button>
        </form>
      </Card>
    </PageShell>
  )
}

export function UserBookingsPage() {
  const bookings = useAppStore((state) => state.vendorBookings)
  const loading = false

  return (
    <PageShell title="My Bookings" subtitle="View booking states and modify when allowed.">
      <Card>
        {loading ? <DataSkeleton rows={6} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-2">Booking ID</th><th>Car</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-slate-700">
                    <td className="py-3">{b.id}</td>
                    <td>{b.car}</td>
                    <td>{b.dates}</td>
                    <td><StatusTag value={b.status} /></td>
                    <td className="space-x-2">
                      <Button className="px-2 py-1 text-xs" variant="ghost" onClick={() => toast('Modify flow launched')}>
                        Modify
                      </Button>
                      <Button className="px-2 py-1 text-xs" variant="ghost" onClick={() => toast.error('Cancellation requested')}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </PageShell>
  )
}
