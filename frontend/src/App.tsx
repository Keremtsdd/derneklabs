import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import News from './pages/News';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import GenericPage from './pages/GenericPage';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import PagesAdmin from './pages/admin/PagesAdmin';
import MenuManager from './pages/admin/MenuManager';
import Dashboard from './pages/admin/Dashboard';

import {
  LogoBaslikPage,
  UstMenuPage,
  IletisimAyarlariPage,
  FooterAyarlariPage,
  KategoriYonetimiPage,
  SssPage,
  AracCubuguPage
} from './pages/admin/Settings';
import {
  NewsPage,
  AnnouncementsPage,
  EventsPage,
  ProjectsPage,
  BannersPage,
  PhotoGalleryPage,
  NoticesPage,
} from './pages/admin/CollectionPages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/haberler" element={<News />} />
              <Route path="/duyurular" element={<Announcements />} />
              <Route path="/etkinlikler" element={<Events />} />
              <Route path="/projeler" element={<Projects />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/destek" element={<Contact />} />
              <Route path="/hakkinda" element={<GenericPage />} />
              <Route path="/baskan" element={<GenericPage />} />
              <Route path="/sayfa/:slug" element={<GenericPage />} />
              <Route path="*" element={<Home />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/giris" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="hero" element={<BannersPage />} />
              <Route path="haberler" element={<NewsPage />} />
              <Route path="duyurular" element={<AnnouncementsPage />} />
              <Route path="etkinlikler" element={<EventsPage />} />
              <Route path="projeler" element={<ProjectsPage />} />
              <Route path="foto-galeri" element={<PhotoGalleryPage />} />
              <Route path="basin" element={<NoticesPage />} />
              <Route path="sayfalar" element={<PagesAdmin />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="logo-baslik" element={<LogoBaslikPage />} />
              <Route path="ust-menu" element={<UstMenuPage />} />
              <Route path="iletisim-ayarlari" element={<IletisimAyarlariPage />} />
              <Route path="footer-ayarlari" element={<FooterAyarlariPage />} />
              <Route path="kategori-yonetimi" element={<KategoriYonetimiPage />} />
              <Route path="sss" element={<SssPage />} />
              <Route path="arac-cubugu" element={<AracCubuguPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
