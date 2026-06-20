import { NavLink, Outlet } from 'react-router-dom';
import { Award, CalendarDays, Gauge, PlusCircle, Sparkles, Swords, User } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/add-experience', label: 'Add XP', icon: PlusCircle },
  { to: '/timeline', label: 'Timeline', icon: CalendarDays },
  { to: '/skills', label: 'Skills', icon: Swords },
  { to: '/badges', label: 'Badges', icon: Award },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8f3ff] md:flex">
      <aside className="sticky top-0 z-20 flex h-16 items-center justify-between bg-gradient-to-b from-xp-purple to-[#6F23CF] px-4 text-white md:h-screen md:w-64 md:flex-col md:items-stretch md:px-5 md:py-6">
        <NavLink to="/dashboard" className="flex items-center gap-3 font-extrabold tracking-wide">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/18">
            <Sparkles size={22} />
          </span>
          <span>Life XP</span>
        </NavLink>
        <nav className="fixed bottom-3 left-3 right-3 z-30 grid grid-cols-6 gap-1.5 rounded-2xl bg-[#2B154C]/95 p-2 shadow-glow backdrop-blur md:static md:mt-10 md:block md:space-y-2 md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'group flex min-h-12 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/16 md:justify-start md:gap-3',
                  isActive ? 'bg-white text-xp-purple shadow-lg md:bg-white' : 'text-white/82'
                ].join(' ')
              }
            >
              <item.icon size={20} />
              <span className="hidden md:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="hidden rounded-lg bg-white/14 p-4 text-sm text-white/80 md:block">
          <p className="font-semibold text-white">Next quest</p>
          <p className="mt-1">Log one real-world win and watch your class evolve.</p>
        </div>
      </aside>
      <main className="min-h-screen flex-1 px-4 pb-24 pt-5 md:px-8 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
