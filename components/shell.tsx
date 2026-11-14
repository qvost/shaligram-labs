'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Lenis from 'lenis';
import {LabMark} from './lab-mark';
import {LabCursor} from './lab-cursor';
gsap.registerPlugin(ScrollTrigger,SplitText);
export function Shell({children}:{children:React.ReactNode}) {
 const path=usePathname(),router=useRouter(), curtain=useRef<HTMLDivElement>(null);
 useEffect(()=>{const mm=gsap.matchMedia(); let lenis:Lenis|undefined; let frame=0; mm.add('(prefers-reduced-motion: no-preference)',()=>{lenis=new Lenis(); const tick=(time:number)=>{lenis?.raf(time);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);lenis.on('scroll',ScrollTrigger.update);return()=>{cancelAnimationFrame(frame);lenis?.destroy()}});return()=>mm.revert()},[]);
 useEffect(() => {
   const media = gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)', () => {
     const animations = gsap.context(() => {
       gsap.fromTo('.curtain span', { scaleY: 1 }, { scaleY: 0, transformOrigin: 'top', stagger: .035, duration: .55, ease: 'power3.inOut', overwrite: true });
     });
     let disposed = false;
     const splits: SplitText[] = [];
     document.fonts.ready.then(() => {
       if (disposed) return;
       animations.add(() => {
         document.querySelectorAll('.reveal').forEach(element => {
           const split = SplitText.create(element, {
             type: 'lines', mask: 'lines', autoSplit: true,
             onSplit(self) {
               return gsap.from(self.lines, {
                 yPercent: 105, stagger: .08, duration: .65, ease: 'power3.out',
                 scrollTrigger: { trigger: element, start: 'top 90%', once: true }
               });
             }
           });
           splits.push(split);
         });
         ScrollTrigger.refresh();
       });
     });
     return () => { disposed = true; animations.revert(); splits.forEach(split => split.revert()); };
   });
   return () => media.revert();
 }, [path]);
 function navigate(e:React.MouseEvent<HTMLAnchorElement>,href:string){if(e.metaKey||e.ctrlKey||e.shiftKey||path===href)return;e.preventDefault();if(matchMedia('(prefers-reduced-motion: reduce)').matches){router.push(href);return}gsap.to('.curtain span',{scaleY:1,transformOrigin:'bottom',stagger:.035,duration:.35,overwrite:true,onComplete:()=>router.push(href)})}
 return <><a className="skip" href="#main">Skip to content</a><header><Link className="brand" href="/" onClick={e=>navigate(e,'/')}><LabMark/> SHALIGRAM LABS</Link><nav aria-label="Main navigation">{[['Research','/research'],['Reify','/systems/reify'],['Manifesto','/manifesto']].map(([label,url])=><Link key={url} aria-current={path===url?'page':undefined} href={url} onClick={e=>navigate(e,url)}>{label}</Link>)}<a href="https://github.com/qvost/reify" target="_blank" rel="noreferrer">GitHub</a></nav></header><LabCursor/><main id="main">{children}</main><footer><div className="footer-top"><span className="mono">Kathmandu, Nepal</span><a href="mailto:qvostwon@gmail.com">Get in touch</a></div><Link className="footer-word" href="/systems/reify">SHALIGRAM.</Link><div className="footer-bottom mono"><span>© {new Date().getFullYear()} SHALIGRAM LABS</span><a href="https://github.com/qvost/reify">Source on GitHub</a></div></footer><div ref={curtain} className="curtain" aria-hidden="true">{[0,1,2,3,4].map(i=><span key={i}/>)}</div></>}
