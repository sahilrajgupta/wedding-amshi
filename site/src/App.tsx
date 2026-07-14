import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RsvpProvider } from './context/RsvpContext';
import HomePage from './pages/HomePage';
import StoryDetailPage from './pages/StoryDetailPage';
import PageFrame from './components/PageFrame';
import TeamHueOverlay from './components/TeamHueOverlay';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
      };
      // Section may not be in the DOM yet on the first paint after navigation.
      requestAnimationFrame(scrollToHash);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  // Lifted above the routes so it survives navigating away from "/" and back —
  // HomePage remounts on every route change, a local state there would re-show
  // the envelope every time you return from a story detail page.
  const [entered, setEntered] = useState(false);

  return (
    <RsvpProvider>
      <ScrollToTop />
      <PageFrame />
      <TeamHueOverlay />
      <Routes>
        <Route path="/" element={<HomePage entered={entered} onEnter={() => setEntered(true)} />} />
        <Route path="/story/:slug" element={<StoryDetailPage />} />
      </Routes>
    </RsvpProvider>
  );
}
