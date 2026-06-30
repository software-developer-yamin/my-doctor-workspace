import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { useDashboardStats } from './use-analytics'

function StatCard({ title, value, sub, icon }: { title: string; value: string | number; sub?: string; icon: ReactNode }) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {sub && <p className='text-xs text-muted-foreground'>{sub}</p>}
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats()
  const s = stats?.summary

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>Reports</TabsTrigger>
              <TabsTrigger value='notifications' disabled>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            {isLoading ? (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}><CardContent className='h-24 animate-pulse bg-muted/40 rounded mt-4' /></Card>
                ))}
              </div>
            ) : (
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <StatCard
                  title='Total Appointments'
                  value={s?.totalAppointments ?? 0}
                  sub={`${s?.pendingAppointments ?? 0} pending, ${s?.completedAppointments ?? 0} completed`}
                  icon={<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'><rect width='18' height='18' x='3' y='4' rx='2' ry='2'/><line x1='16' x2='16' y1='2' y2='6'/><line x1='8' x2='8' y1='2' y2='6'/><line x1='3' x2='21' y1='10' y2='10'/></svg>}
                />
                <StatCard
                  title='Total Revenue (BDT)'
                  value={`৳${(s?.totalRevenue ?? 0).toLocaleString()}`}
                  sub={`৳${(s?.paidRevenue ?? 0).toLocaleString()} collected`}
                  icon={<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'><path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/></svg>}
                />
                <StatCard
                  title='Registered Doctors'
                  value={s?.totalDoctors ?? 0}
                  sub={`${s?.totalHospitals ?? 0} partner hospitals`}
                  icon={<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'><path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'/></svg>}
                />
                <StatCard
                  title='Patients Registered'
                  value={s?.totalCustomers ?? 0}
                  sub={`${s?.ambulanceBookings ?? 0} ambulance + ${s?.diagnosticBookings ?? 0} diagnostic bookings`}
                  icon={<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'><path d='M22 12h-4l-3 9L9 3l-3 9H2'/></svg>}
                />
              </div>
            )}

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Monthly Appointments</CardTitle>
                  <CardDescription>Appointment volume by month (current year)</CardDescription>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview data={stats?.chartData ?? []} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Latest {stats?.recentAppointments?.length ?? 0} bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {(stats?.recentAppointments ?? []).map((appt) => (
                      <div key={appt._id} className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold'>
                          {appt.customer?.name?.[0] ?? '?'}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium truncate'>{appt.customer?.name ?? 'Unknown'}</p>
                          <p className='text-xs text-muted-foreground truncate'>Dr. {appt.doctor?.name ?? '—'}</p>
                        </div>
                        <div className='text-right shrink-0'>
                          <p className='text-sm font-semibold'>৳{appt.totalFee}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            appt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                            appt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>{appt.status}</span>
                        </div>
                      </div>
                    ))}
                    {(!stats?.recentAppointments?.length) && (
                      <p className='text-sm text-muted-foreground text-center py-4'>No appointments yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },

  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
