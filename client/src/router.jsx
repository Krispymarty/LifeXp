import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import AddExperience from './pages/AddExperience.jsx';
import Badges from './pages/Badges.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Landing from './pages/Landing.jsx';
import Skills from './pages/Skills.jsx';
import Timeline from './pages/Timeline.jsx';
import Profile from './pages/Profile.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/add-experience', element: <AddExperience /> },
      { path: '/timeline', element: <Timeline /> },
      { path: '/skills', element: <Skills /> },
      { path: '/badges', element: <Badges /> },
      { path: '/profile', element: <Profile /> }
    ]
  }
]);
