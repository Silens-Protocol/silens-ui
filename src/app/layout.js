import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { Manrope } from "next/font/google";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../assets/scss/style.scss'
import '../assets/css/materialdesignicons.min.css'
import '@rainbow-me/rainbowkit/styles.css';
import './globals.css';

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
 });

export const metadata = {
  title: "Silens – Decentralized AI Review & Governance",
  description: "Silens – Decentralized AI Review & Governance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
