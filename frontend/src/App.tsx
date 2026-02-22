import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import Dashboard from './pages/admin/Dashboard';
import PagesAdmin from './pages/admin/PagesAdmin';
import MenuManager from './pages/admin/MenuManager';
import KurumsalMenuManager from './pages/admin/KurumsalMenuManager';
import Settings from './pages/admin/Settings';
import {
  NewsPage,
  AnnouncementsPage,
  EventsPage,
  ProjectsPage,
  BannersPage,
  FastLinksPage,
  DocumentsPage,
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/haberler" element={<News />} />
            <Route path="/duyurular" element={<Announcements />} />
            <Route path="/etkinlikler" element={<Events />} />
            <Route path="/projeler" element={<Projects />} />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="/hakkinda" element={<GenericPage />} />
            <Route path="/baskan" element={<GenericPage />} />
            <Route path="/sayfa/:slug" element={<GenericPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/giris" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="haberler" element={<NewsPage />} />
            <Route path="duyurular" element={<AnnouncementsPage />} />
            <Route path="etkinlikler" element={<EventsPage />} />
            <Route path="projeler" element={<ProjectsPage />} />
            <Route path="bannerlar" element={<BannersPage />} />
            <Route path="hizli-islemler" element={<FastLinksPage />} />
            <Route path="belgeler" element={<DocumentsPage />} />
            <Route path="sayfalar" element={<PagesAdmin />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="kurumsal-menu" element={<KurumsalMenuManager />} />
            <Route path="ayarlar" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
