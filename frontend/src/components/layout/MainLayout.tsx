import { Outlet } from 'react-router-dom';
import DocumentMeta from './DocumentMeta';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <DocumentMeta />
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
