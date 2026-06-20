import { ArrowRight, Award, BookOpen, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/life-xp-hero.png';

const features = [
  { title: 'Add Experiences', body: 'Log completed moments from study, work, travel, service, and growth.', icon: BookOpen },
  { title: 'Earn XP', body: 'Every category converts into XP automatically with clear RPG-style rules.', icon: Sparkles },
  { title: 'Unlock Skills', body: 'Your real actions level up skills like Leadership and Technical.', icon: ShieldCheck },
  { title: 'Collect Badges', body: 'Milestones become badges you can see, chase, and celebrate.', icon: Trophy }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-xp-bg text-white">
      <header className="absolute left-0 right-0 top-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link to="/" className="text-xl font-extrabold">Life XP</Link>
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <a href="#features" className="rounded-lg px-3 py-2 text-white/82 transition hover:bg-white/12">Features</a>
          <a href="#about" className="rounded-lg px-3 py-2 text-white/82 transition hover:bg-white/12">About</a>
          <Link to="/dashboard" className="rounded-lg bg-white/14 px-3 py-2 transition hover:bg-white/24">Login</Link>
        </nav>
      </header>

      <section
        className="relative min-h-[88vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            `linear-gradient(90deg, rgba(21,11,46,0.92), rgba(21,11,46,0.56), rgba(21,11,46,0.16)), url(${heroImage})`
        }}
      >
        <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-sm font-bold backdrop-blur">
              <Award size={17} /> RPG growth for real life
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-tight md:text-7xl">Your Life is Full of XP</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
              Turn the experiences you have already completed into levels, skills, badges, and a living map of your personal growth.
            </p>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-xp-gold px-6 py-3 font-extrabold text-[#3D2600] shadow-glow transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="-mt-16 px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-white/12 bg-white/10 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/16">
              <feature.icon className="text-xp-gold" size={28} />
              <h2 className="mt-4 text-lg font-extrabold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/72">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="px-5 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold">A progress screen for the life you are actually living.</h2>
          <p className="mt-4 text-white/70">Life XP focuses on completed experiences, making reflection feel rewarding instead of turning growth into another chore list.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-sm text-white/56">Life XP © 2026</footer>
    </div>
  );
}
