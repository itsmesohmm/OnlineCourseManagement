import './globals.css';
import Navbar from '@/app/components/Navbar';
export const metadata = { title: 'LearnSpace | Course Portal', description: 'A simple online course management portal.' };
export default function RootLayout({ children }) { return <html lang="en"><body><Navbar /><main className="main-shell">{children}</main><footer className="footer">LearnSpace · Online Course Management System</footer></body></html>; }
