import { Outlet } from 'react-router-dom';
import DocumentMeta from './DocumentMeta';
import Header from './Header';
import Footer from './Footer';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <DocumentMeta />
            <Header />
            <main className="flex-1 pb-24 xl:pb-28">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
