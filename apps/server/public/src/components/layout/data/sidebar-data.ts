import {
  Calendar,
  Clock,
  Home,
  Hospital,

  LayoutDashboard,
  Map,
  MapPin,

  Stethoscope,
  Target,
  Users,
  Activity,
  Ambulance,
  Microscope,
  MessageSquare,
  MessageCircle,
  PhoneCall,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'rian',
    email: 'rian.acca@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'My Doctor',
      logo: Stethoscope,
      plan: 'Control Panel',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },

      ],
    },
    {
      title: 'User Management',
      items: [
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },

      ],
    },
    {
      title: 'Medical Network',
      items: [
        {
          title: 'Doctors',
          url: '/doctors',
          icon: Stethoscope,
        },
        {
          title: 'Hospitals',
          url: '/hospitals',
          icon: Hospital,
        },
      ],
    },
    {
      title: 'Services',
      items: [
        {
          title: 'Diagnostic',
          icon: Microscope,
          items: [
            {
              title: 'Tests',
              url: '/diagnostic-tests',
            },
            {
              title: 'Labs',
              url: '/labs',
            },
            {
              title: 'Bookings',
              url: '/diagnostic-bookings',
            },
          ],
        },
        {
          title: 'Ambulance service',
          icon: Ambulance,
          items: [
            {
              title: 'Ambulances',
              url: '/ambulances',
            },
            {
              title: 'Bookings',
              url: '/ambulance-bookings',
            },
          ],
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          title: 'Clinic Appointments',
          url: '/appointments',
          icon: Calendar,

        },
        {
          title: 'Home Appointments',
          url: '/home-doctor-bookings',
          icon: Home,

        },
        {
          title: 'Live Queues',
          url: '/doctor-live-queues',
          icon: Activity,

        },
        {
          title: 'Home Schedules',
          url: '/doctor-home-schedules',
          icon: Clock,

        },
        {
          title: 'Guide Bookings',
          url: '/guide-bookings',
          icon: Map,
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          title: 'Specialities',
          url: '/specialities',
          icon: Stethoscope,
        },
        {
          title: 'BD Locations',
          url: '/bd-locations',
          icon: MapPin,
        },
        {
          title: 'Concentrations',
          url: '/concentrations',
          icon: Target,
        },
        {
          title: 'SMS History',
          url: '/sms-logs',
          icon: MessageSquare,
        },
        {
          title: 'Contact Messages',
          url: '/contact-messages',
          icon: MessageCircle,
        },
        {
          title: 'Callback Requests',
          url: '/callback-requests',
          icon: PhoneCall,
        },
      ],
    },
  ],
}
