import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/shell';
export const metadata: Metadata = {title:{default:'Shaligram Labs — Foundations for autonomy',template:'%s · Shaligram Labs'},description:'Shaligram Labs, Kathmandu. Tools and infrastructure for agents, starting with Reify.',icons:{icon:[{url:'/favicon.ico',sizes:'32x32',type:'image/x-icon'},{url:'/icon.svg',type:'image/svg+xml'}],apple:'/apple-touch-icon.png'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body><Shell>{children}</Shell></body></html>}
