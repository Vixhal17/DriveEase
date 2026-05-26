import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button, CarImage, Card, DataSkeleton, Input, PageShell, Select, StatusTag } from '../../components/common'
import { useMockFetch } from '../../hooks/useMockFetch'
import { useAppStore } from '../../store/useAppStore'
import { formatInrCurrency } from '../../utils/formatters'

export function VendorDashboardPage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])

  return (
    <PageShell title="Vendor Dashboard" subtitle="Track earnings, fleet availability, and upcoming reservations.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Today</p><p className="font-heading text-2xl">{formatInrCurrency(2140)}</p></Card>
        <Card><p className="text-sm text-slate-300">This Week</p><p className="font-heading text-2xl">{formatInrCurrency(11920)}</p></Card>
        <Card><p className="text-sm text-slate-300">This Month</p><p className="font-heading text-2xl">{formatInrCurrency(42210)}</p></Card>
      </section>

      {loading ? <DataSkeleton rows={4} /> : null}
      {!loading ? (
        <Card>
          <h3 className="mb-3 font-heading text-lg">Earnings Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="vendorPayout" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      <Card>
        <h3 className="font-heading text-lg">Upcoming Bookings Feed</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>Tata Nexon EV pickup today at 15:30 - Aakash S.</li>
          <li>Mahindra XUV700 pickup tomorrow at 10:00 - Priya K.</li>
        </ul>
      </Card>
    </PageShell>
  )
}

export function VendorCarsPage() {
  const cars = useAppStore((state) => state.vendorCars)
  const navigate = useNavigate()

  return (
    <PageShell
      title="My Cars"
      subtitle="Manage listings, availability, and statuses across your fleet."
      actions={<Button variant="amber" onClick={() => navigate('/vendor/cars/new')}>Add New Car</Button>}
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => (
          <Card key={car.id} className="space-y-3">
            <CarImage src={car.image} alt={car.name} className="h-36 rounded-control" />
            <div className="flex items-start justify-between">
              <h3 className="font-heading text-lg">{car.name}</h3>
              <StatusTag value={car.status} />
            </div>
            <p className="text-sm text-slate-300">{formatInrCurrency(car.pricePerDay)}/day</p>
            <div className="flex gap-2">
              <Button className="w-full" variant="ghost" onClick={() => navigate(`/vendor/cars/${car.id}/edit`)}>Edit</Button>
              <Button
                className="w-full"
                variant="ghost"
                onClick={() => {
                  const deleteCar = useAppStore.getState().deleteVendorCar
                  deleteCar(car.id)
                  toast.success('Car listing deleted')
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </PageShell>
  )
}

export function VendorCarFormPage({ returnPath = '/vendor/cars' }) {
  const { id } = useParams()
  const editing = Boolean(id)
  const [step, setStep] = useState(1)
  const cars = useAppStore((state) => state.vendorCars)
  const addVendorCar = useAppStore((state) => state.addVendorCar)
  const updateVendorCar = useAppStore((state) => state.updateVendorCar)
  const navigate = useNavigate()
  const currentCar = cars.find((car) => car.id === id)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: currentCar?.name || '',
      brand: currentCar?.brand || '',
      year: currentCar?.modelYear || '',
      type: currentCar?.type || 'SUV',
      seats: currentCar?.seats || 5,
      transmission: currentCar?.transmission || 'Automatic',
      fuel: currentCar?.fuel || 'Petrol',
      features: currentCar?.features || '',
      dailyPrice: currentCar?.pricePerDay || '',
      weeklyPrice: currentCar?.weeklyPrice || '',
      monthlyPrice: currentCar?.monthlyPrice || '',
      location: currentCar?.location || '',
      availableFrom: currentCar?.availableFrom || '',
      availableTo: currentCar?.availableTo || '',
      status: currentCar?.status || 'available',
    },
  })

  const submit = (values) => {
    if (step < 5) {
      setStep((prev) => prev + 1)
      toast.success(`Step ${step} saved`)
      return
    }

    const payload = {
      ...values,
      image: `https://placehold.co/960x640/0f172a/e2e8f0?text=${encodeURIComponent(values.name || 'DriveEase+Car')}`,
    }

    if (editing) {
      updateVendorCar(id, payload)
      toast.success('Car updated')
    } else {
      addVendorCar(payload)
      toast.success('Car added')
    }

    navigate(returnPath)
  }

  useEffect(() => {
    if (editing && currentCar) {
      reset({
        name: currentCar.name || '',
        brand: currentCar.brand || '',
        year: currentCar.modelYear || '',
        type: currentCar.type || 'SUV',
        seats: currentCar.seats || 5,
        transmission: currentCar.transmission || 'Automatic',
        fuel: currentCar.fuel || 'Petrol',
        features: currentCar.features || '',
        dailyPrice: currentCar.pricePerDay || '',
        weeklyPrice: currentCar.weeklyPrice || '',
        monthlyPrice: currentCar.monthlyPrice || '',
        location: currentCar.location || '',
        availableFrom: currentCar.availableFrom || '',
        availableTo: currentCar.availableTo || '',
        status: currentCar.status || 'available',
      })
    }
  }, [editing, currentCar, reset])

  return (
    <PageShell title={editing ? 'Edit Car' : 'Add New Car'} subtitle="Details -> Specs -> Photos -> Pricing -> Availability">
      <Card className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {['Details', 'Specs', 'Photos', 'Pricing', 'Availability'].map((name, idx) => (
            <span key={name} className={`rounded-full px-3 py-1 ${step >= idx + 1 ? 'bg-electricBlue/25 text-blue-200' : 'bg-slate-800 text-slate-400'}`}>
              {idx + 1}. {name}
            </span>
          ))}
        </div>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(submit)}>
          {step === 1 ? (
            <>
              <Input label="Car Name" {...register('name', { required: true })} />
              <Input label="Brand" {...register('brand')} />
              <Input label="Model Year" type="number" {...register('year')} />
              <Select label="Type" {...register('type')}><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Luxury</option></Select>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Input label="Seats" type="number" {...register('seats')} />
              <Select label="Transmission" {...register('transmission')}><option>Automatic</option><option>Manual</option></Select>
              <Select label="Fuel Type" {...register('fuel')}><option>Petrol</option><option>Diesel</option><option>EV</option></Select>
              <Input label="Features" placeholder="GPS, Sunroof, Parking Camera" {...register('features')} />
            </>
          ) : null}

          {step === 3 ? <Input label="Upload Car Images" type="file" multiple className="md:col-span-2" {...register('photos')} /> : null}

          {step === 4 ? (
            <>
              <Input label="Daily Price" type="number" {...register('dailyPrice')} />
              <Input label="Weekly Price" type="number" {...register('weeklyPrice')} />
              <Input label="Monthly Price" type="number" {...register('monthlyPrice')} />
              <Input label="Location" {...register('location')} />
            </>
          ) : null}

          {step === 5 ? (
            <>
              <Input label="Available From" type="date" {...register('availableFrom')} />
              <Input label="Available To" type="date" {...register('availableTo')} />
              <Select label="Status" {...register('status')}><option>available</option><option>maintenance</option></Select>
            </>
          ) : null}

          <Button className="md:col-span-2" variant="amber" type="submit">
            {step < 5 ? 'Save and Continue' : editing ? 'Update Car' : 'Publish Car'}
          </Button>
        </form>
      </Card>
    </PageShell>
  )
}

export function VendorBookingsPage() {
  const bookings = useAppStore((state) => state.vendorBookings)
  const updateVendorBookingStatus = useAppStore((state) => state.updateVendorBookingStatus)

  const incoming = useMemo(() => bookings.filter((b) => b.status === 'Pending'), [bookings])

  return (
    <PageShell title="Bookings" subtitle="Review incoming requests, active rentals, and completed history.">
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-heading text-lg">Incoming Requests</h3>
          <div className="mt-3 space-y-3 text-sm">
            {incoming.length ? (
              incoming.map((item) => (
                <div key={item.id} className="rounded-control border border-slate-700 p-3">
                  <p>{item.id} - {item.car}</p>
                  <p className="text-slate-300">{item.dates}</p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      className="px-3 py-1 text-xs"
                      onClick={() => {
                        updateVendorBookingStatus(item.id, 'Confirmed')
                        toast.success('Booking accepted')
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      className="px-3 py-1 text-xs"
                      variant="ghost"
                      onClick={() => {
                        updateVendorBookingStatus(item.id, 'Cancelled')
                        toast.error('Booking rejected')
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">No pending booking requests right now.</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg">Active and Past Rentals</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-control border border-slate-700 px-3 py-2">
                <span>{b.car}</span>
                <StatusTag value={b.status} />
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </PageShell>
  )
}

export function VendorEarningsPage() {
  const { data: revenue, loading } = useMockFetch('/mock/revenue.json', [])
  const payoutRequests = useAppStore((state) => state.vendorPayoutRequests)
  const requestVendorPayout = useAppStore((state) => state.requestVendorPayout)
  const pendingPayout = useMemo(
    () => revenue.reduce((sum, row) => sum + row.vendorPayout, 0),
    [revenue],
  )

  return (
    <PageShell title="Earnings" subtitle="Monitor transactions, payouts, and monthly totals.">
      <section className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-300">Total Earnings</p><p className="font-heading text-2xl">{formatInrCurrency(184220)}</p></Card>
        <Card><p className="text-sm text-slate-300">Pending Payouts</p><p className="font-heading text-2xl">{formatInrCurrency(pendingPayout)}</p></Card>
        <Card>
          <Button
            className="w-full"
            variant="amber"
            onClick={() => {
              requestVendorPayout(pendingPayout)
              toast.success('Payout request submitted')
            }}
          >
            Request Payout
          </Button>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        {loading ? <DataSkeleton rows={5} /> : null}
        {!loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-400"><tr><th className="py-2">Month</th><th>Platform Revenue</th><th>Your Payout</th></tr></thead>
              <tbody>
                {revenue.map((row) => (
                  <tr key={row.month} className="border-t border-slate-700">
                    <td className="py-3">{row.month}</td><td>{formatInrCurrency(row.amount)}</td><td>{formatInrCurrency(row.vendorPayout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
      <Card>
        <h3 className="font-heading text-lg">Payout Requests</h3>
        <div className="mt-3 space-y-3">
          {payoutRequests.length ? (
            payoutRequests.map((request) => (
              <div key={request.id} className="rounded-control border border-slate-700 p-3 text-sm text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span>{formatInrCurrency(request.amount)}</span>
                  <StatusTag value={request.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">Requested on {new Date(request.requestedAt).toLocaleString('en-IN')}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-300">No payout requests submitted yet.</p>
          )}
        </div>
      </Card>
      </section>
    </PageShell>
  )
}

export function VendorProfilePage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      businessName: 'Urban Wheels Co.',
      contact: 'ops@urbanwheels.io',
      verified: true,
    },
  })

  return (
    <PageShell title="Profile & Verification" subtitle="Business details, document uploads, and verification badge status.">
      <Card>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(() => toast.success('Vendor profile updated'))}>
          <Input label="Business Name" {...register('businessName')} />
          <Input label="Contact Email" type="email" {...register('contact')} />
          <Input label="Upload License" type="file" {...register('licenseDoc')} />
          <Input label="Upload Registration" type="file" {...register('registrationDoc')} />
          <div className="md:col-span-2">
            <p className="text-sm">Verification Status: <span className="rounded-full bg-emerald-300/15 px-2 py-1 text-emerald-300">Verified</span></p>
          </div>
          <Button className="md:col-span-2" variant="amber" type="submit">Save Profile</Button>
        </form>
      </Card>
    </PageShell>
  )
}
