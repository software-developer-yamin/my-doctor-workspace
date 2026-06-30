'use client'

import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Building2 } from 'lucide-react'
import api, { SERVER_URL } from '@/lib/api'
import { HospitalDoctorList } from './components/hospital-doctor-list'

export function HospitalTeamSchedules() {
  const { id } = useParams({ from: '/_authenticated/hospitals/$id/team' })

  const { data: hospital, isLoading } = useQuery({
    queryKey: ['hospital', id],
    queryFn: async () => {
      const res = await api.get(`/hospitals/${id}`)
      return res.data?.data ?? res.data
    }
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-6'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div className='flex items-center gap-4'>
            <Link to='/hospitals/$id' params={{ id }}>
              <Button variant='outline' size='icon' className='border-white/10'>
                <ArrowLeft size={18} />
              </Button>
            </Link>
            <div className='flex items-center gap-3'>
              {hospital?.logo ? (
                <img
                  src={`${SERVER_URL}${hospital.logo}`}
                  alt={hospital.name}
                  className='h-12 w-12 rounded-xl border border-white/10 object-contain bg-white p-1'
                />
              ) : (
                <div className='h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center'>
                  <Building2 size={20} className='text-primary' />
                </div>
              )}
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  {isLoading ? 'Loading...' : hospital?.name}
                </h2>
                <p className='text-muted-foreground text-sm'>
                  Team & Schedules — manage assigned doctors and their weekly availability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <HospitalDoctorList hospitalId={id} paginated />
      </Main>
    </>
  )
}
