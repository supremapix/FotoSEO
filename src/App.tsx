/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  ArrowRight,
  ChevronDown,
  MapPinOff,
  Tag,
  FileX,
  Upload,
  MapPin,
  Archive,
  Navigation,
  Tags,
  FileText,
  FolderPen,
  Layers,
  Package,
  Monitor,
  Table,
  Satellite,
  X,
  Check,
  Star,
  ShieldCheck,
  Plus,
  Zap,
  Lock,
  Menu,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowUp,
  Info,
  CreditCard,
  Play,
} from 'lucide-react';

// ==========================================
// 1. REUSABLE PREMIUM CANVAS PARTICLE HERO
// ==========================================
function CanvasHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const colors = ['#ffd200', '#ffb829', '#15846e', '#ffffff'];
    const shapes = ['circle', 'triangle', 'diamond', 'square'];

    // Create 940 particles for dense constellation
    const particleCount = 940;
    const particles: Array<{
      baseRadius: number;
      radius: number;
      angle: number;
      orbitalSpeed: number;
      shape: string;
      size: number;
      color: string;
      phase: number;
      amplitude: number;
    }> = [];

    // Sphere Center: Position on the browser right-half
    let centerX = width * 0.55;
    let centerY = height * 0.5;

    for (let i = 0; i < particleCount; i++) {
      // Gaussian approximation for beautiful core clustering
      const u1 = Math.random();
      const u2 = Math.random();
      const randNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

      const baseRadius = Math.abs(randNormal) * 125 + 25;

      particles.push({
        baseRadius,
        radius: baseRadius,
        angle: Math.random() * Math.PI * 2,
        // Orbital drift direction
        orbitalSpeed: (0.0004 + Math.random() * 0.0008) * (Math.random() > 0.5 ? 1 : -1),
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 2 + 2, // 2-4px strictly
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        amplitude: Math.random() * 16 + 4,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      centerX = width * 0.55;
      centerY = height * 0.5;
    };

    window.addEventListener('resize', handleResize);

    const drawParticle = (p: typeof particles[0], x: number, y: number) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();

      if (p.shape === 'circle') {
        ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
      } else if (p.shape === 'triangle') {
        const s = p.size;
        ctx.moveTo(x, y - s / 2);
        ctx.lineTo(x + s / 2, y + s / 2);
        ctx.lineTo(x - s / 2, y + s / 2);
        ctx.closePath();
      } else if (p.shape === 'diamond') {
        const s = p.size;
        ctx.moveTo(x, y - s / 2);
        ctx.lineTo(x + s / 2, y);
        ctx.lineTo(x, y + s / 2);
        ctx.lineTo(x - s / 2, y);
        ctx.closePath();
      } else {
        // square
        const s = p.size;
        ctx.rect(x - s / 2, y - s / 2, s, s);
      }
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      // Slow dynamic drift center orb movement
      const dynamicCenterX = centerX + Math.cos(timestamp * 0.0004) * 24;
      const dynamicCenterY = centerY + Math.sin(timestamp * 0.0004) * 24;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Slowly progress angle
        p.angle += p.orbitalSpeed;

        // Radii breathing behavior
        const currentRadius = p.baseRadius + Math.sin(timestamp * 0.0008 + p.phase) * (p.amplitude * 0.25);

        // Map as elegant flat ellipse
        let x = dynamicCenterX + Math.cos(p.angle) * currentRadius * 1.15;
        let y = dynamicCenterY + Math.sin(p.angle) * currentRadius * 0.85;

        // Subtle micro drift independently
        x += Math.sin(timestamp * 0.0015 + p.phase) * 1.2;
        y += Math.cos(timestamp * 0.0015 + p.phase) * 1.2;

        if (x > 0 && x < width && y > 0 && y < height) {
          drawParticle(p, x, y);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-40 md:opacity-100 z-0"
    />
  );
}

// ==========================================
// 2. SCROLL REVEAL INTERSECTION OBSERVER
// ==========================================
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  key?: React.Key;
}

function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-item ${isRevealed ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ==========================================
// 3. STATCOUNTER WITH INTERSECTION TRIGGER
// ==========================================
interface StatCounterProps {
  value: string;
  duration?: number;
}

function StatCounter({ value, duration = 1500 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [loopTrigger, setLoopTrigger] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const match = value.match(/\d+/);
    if (!match) {
      return;
    }
    const targetValue = parseInt(match[0], 10);

    let startTime: number | null = null;
    let animationFrameId: number;
    let timeoutId: any;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / duration, 1);

      // easeOutQuad curve
      const easeOut = progressRatio * (2 - progressRatio);
      const currentCount = Math.floor(easeOut * targetValue);

      setCount(currentCount);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
        // Wait 3.5 seconds at the target value, then reset and count up again
        timeoutId = setTimeout(() => {
          setCount(0);
          setLoopTrigger((prev) => prev + 1);
        }, 3500);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasStarted, value, duration, loopTrigger]);

  // Substitute numerical portion with animated count state
  const finalValue = value.replace(/\d+/, count.toString());

  return <span ref={ref}>{finalValue}</span>;
}

// ==========================================
// 4. RIPPLE BUTTON (PLUM VOLTAGE)
// ==========================================
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isSecondaryOutline?: boolean; // if outline version wanted
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

function RippleButton({
  children,
  className = '',
  isSecondaryOutline = false,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: nextId,
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    setNextId((prev) => prev + 1);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const baseStyle =
    'relative overflow-hidden transition-all duration-300 rounded-[24px] uppercase tracking-[0.05em] text-[12px] font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-none';

  const actionStyle = isSecondaryOutline
    ? 'border border-white/10 text-white hover:bg-white/5 px-6 py-4'
    : 'bg-[#ffd200] hover:bg-[#ffe14f] text-black px-7 py-4 font-bold';

  return (
    <button
      className={`${baseStyle} ${actionStyle} ${className}`}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      <span className="ripple-container">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="ripple-effect"
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
            }}
          />
        ))}
      </span>
    </button>
  );
}

// ==========================================
// SCARCITY COUNTDOWN TIMER FOR REVENUE INTRUSION
// ==========================================
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(599); // 09:59 duration in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-3 bg-[#ffb829]/5 border border-[#ffb829]/15 rounded-[24px] px-5 py-2.5">
      <div className="w-2 h-2 rounded-full bg-[#ffb829] animate-pulse shrink-0" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#ffb829]">
        Oferta única expira em:
      </span>
      <span className="font-mono text-[13px] font-bold text-[#ffb829] tracking-wider">
        {pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}

// ==========================================
// DYNAMIC LIVE ACTIVE VIEWERS COUNTER (SOCIAL PROOF)
// ==========================================
function ActiveViewersCounter() {
  const sequence = [5, 22, 11, 8];
  const [index, setIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  useEffect(() => {
    if (loopCount >= 4) return;

    const timer = setTimeout(() => {
      setIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= sequence.length) {
          setLoopCount((prevCount) => prevCount + 1);
          return 0;
        }
        return nextIndex;
      });
    }, 15000); // 15 seconds interval

    return () => clearTimeout(timer);
  }, [index, loopCount]);

  const viewersCount = sequence[index];

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/25 rounded-full text-white text-[12px] font-semibold animate-pulse shadow-md transition-all duration-300">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      <span>{viewersCount} pessoas qualificadas vendo esta página agora</span>
    </div>
  );
}

// ==========================================
// FLOATING WATERMARK ALERTS SYSTEM
// ==========================================
function FloatingWatermarkAlerts() {
  const [activeAlert, setActiveAlert] = useState(0); // 0 = Viewers, 1 = Countdown, 2 = spots left, 3 = senior-friendly proof
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      const timer = setTimeout(() => {
        setActiveAlert((prev) => (prev + 1) % 4);
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed left-4 bottom-28 md:bottom-auto md:top-1/3 -translate-y-1/2 z-40 flex flex-col gap-2.5 pointer-events-auto max-w-[310px] select-none transition-all duration-1000 ${
        isVisible ? 'opacity-[0.65] translate-x-0' : 'opacity-0 -translate-x-12'
      } hover:opacity-100 focus-within:opacity-100 scale-85 sm:scale-100 origin-left`}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd200] animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#ffd200]/40 hover:text-[#ffd200] transition-colors">
          Alerta de Escassez em Tempo Real
        </span>
      </div>

      {activeAlert === 0 && (
        <ActiveViewersCounter />
      )}

      {activeAlert === 1 && (
        <CountdownTimer />
      )}

      {activeAlert === 2 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-white text-[12px] font-semibold shadow-md">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-zinc-200">
            Apenas <strong className="text-[#ffd200]">7 licenças vitais</strong> com desconto hoje!
          </span>
        </div>
      )}

      {activeAlert === 3 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-white text-[11px] font-semibold shadow-md">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-200">
            Mais de <strong className="text-emerald-400">1.430 idosos</strong> usando sem dificuldades!
          </span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// INTERACTIVE ANIMATED LOGO COMPONENT
// ==========================================
interface InteractiveLogoProps {
  size?: 'sm' | 'lg' | 'xl';
  className?: string;
}

function InteractiveLogo({ size = 'sm', className = '' }: InteractiveLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
  };

  const ringStyles = {
    sm: {
      outerMargin: '-4px',
      innerMargin: '-7px',
      containerSize: 'w-8 h-8',
    },
    lg: {
      outerMargin: '-6px',
      innerMargin: '-10px',
      containerSize: 'w-16 h-16',
    },
    xl: {
      outerMargin: '-8px',
      innerMargin: '-14px',
      containerSize: 'w-[84px] h-[84px]',
    }
  };

  const currentStyles = ringStyles[size];

  return (
    <div
      className={`relative flex items-center justify-center cursor-pointer select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Primary spinning glowing charging borders (t={#ffd200}, r=emerald-400) */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-transparent border-t-[#ffd200] border-r-emerald-400 transition-all duration-300 ${
          isClicked
            ? 'animate-spin scale-125 border-t-pink-500 border-r-indigo-400'
            : isHovered
              ? 'animate-[spin_0.8s_linear_infinite] scale-110 shadow-[0_0_25px_rgba(255,210,0,0.65)]'
              : 'animate-[spin_2.2s_linear_infinite]'
        }`}
        style={{
          padding: '2px',
          margin: currentStyles.outerMargin,
        }}
      />
      {/* Outer second reverse ring for a beautiful high-tech, high-conversion charging look */}
      <div
        className={`absolute inset-0 rounded-full border border-transparent border-b-[#ffd200]/40 border-l-emerald-400/40 transition-all duration-500 ${
          isClicked
            ? 'animate-[spin_0.4s_linear_infinite_reverse]'
            : isHovered
              ? 'animate-[spin_1.2s_linear_infinite_reverse] scale-105 opacity-100'
              : 'animate-[spin_3.5s_linear_infinite_reverse] opacity-50'
        }`}
        style={{
          padding: '2px',
          margin: currentStyles.innerMargin,
        }}
      />

      {/* Main logo image */}
      <div
        className={`relative ${currentStyles.containerSize} rounded-full overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isClicked
            ? 'scale-90 rotate-12'
            : isHovered
              ? 'scale-105 shadow-[inset_0_0_12px_rgba(255,255,255,0.3)]'
              : ''
        }`}
      >
        <img
          src="https://img.fotoseo.shop/foto-seo.webp"
          alt="FotoSEO Logo"
          className={`w-full h-full object-cover transition-transform duration-700 select-none ${
            isHovered ? 'scale-110 rotate-3' : 'scale-100'
          }`}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}

// ==========================================
// HERO TYPEWRITER CONVERTER LOGIC (NEUROMARKETING)
// ==========================================
interface PhraseItem {
  text: string;
  colorClass: string;
  badge: string;
}

const HERO_PHRASES: PhraseItem[] = [
  {
    text: "O FotoSEO é a ferramenta definitiva para colocar qualquer negócio no topo do Google Maps.",
    colorClass: "text-[#ffd200] font-[800]",
    badge: "✓ PASSO 1: DOMÍNIO LOCAL IMPLACÁVEL"
  },
  {
    text: "Sem precisar programar ou saber nada de computação, ele injeta as coordenadas de GPS reais do seu endereço diretamente nas fotos.",
    colorClass: "text-sky-400 font-[800]",
    badge: "✓ PASSO 2: HARDWARE GEO-CODENING DIRECTO"
  },
  {
    text: "Ele injeta palavras-chave secretas e descrições ricas direto nos arquivos ocultos IPTC das imagens, forçando o Google a destacar você.",
    colorClass: "text-emerald-400 font-[800]",
    badge: "✓ PASSO 3: METADADOS SECRETOS"
  },
  {
    text: "O Google reconhece que a sua foto foi tirada no local de atendimento, alavancando sua empresa para a Posição #1 em poucos minutos!",
    colorClass: "text-rose-450 text-[#ff4b8b] font-[800]",
    badge: "✓ PASSO 4: RESULTADO IMEDIATO"
  }
];

function HeroTypewriter() {
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const currentPhrase = HERO_PHRASES[currentPhraseIdx].text;
    
    if (!isDeleting) {
      if (displayedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
        }, 18); // Fast, fluent typing speed for neuromarketing engagement
      } else {
        // Hold full phrase for readability
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 4500);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
        }, 8); // Fast erase
      } else {
        setIsDeleting(false);
        setCurrentPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIdx]);

  const currentPhraseObj = HERO_PHRASES[currentPhraseIdx];

  return (
    <div className="min-h-[160px] sm:min-h-[120px] flex flex-col gap-3 max-w-[520px] mx-auto md:mx-0">
      <div className="flex items-center justify-center md:justify-start">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {currentPhraseObj.badge}
        </span>
      </div>
      <p className={`text-[15px] sm:text-[16px] md:text-[18px] leading-[1.6] tracking-wide transition-colors duration-500 text-center md:text-left ${currentPhraseObj.colorClass}`}>
        {displayedText}
        <span className="animate-pulse ml-1 text-white border-r-2 border-white">&nbsp;</span>
      </p>
    </div>
  );
}

// ==========================================
// MAIN REVOLUTIONARY FOTOSEO APPLICATION
// ==========================================
export default function App() {
  // Navigation trigger background states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // New states for the multi-stage marketing funnel
  const [currentView, setCurrentView] = useState<'landing' | 'upsell' | 'downsell' | 'success'>('landing');
  const [upsellIncluded, setUpsellIncluded] = useState<boolean | null>(null);
  const [downsellActive, setDownsellActive] = useState<boolean>(false);

  const navigateTo = (view: 'landing' | 'upsell' | 'downsell' | 'success') => {
    setCurrentView(view);
    const newPath = view === 'landing' ? '/' : `/${view}`;
    window.history.pushState({ view }, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back button configuration & Pathname routing tracking on first mount
  useEffect(() => {
    const checkPath = () => {
      const path = window.location.pathname;
      if (path === '/downsell') {
        setCurrentView('downsell');
      } else if (path === '/upsell') {
        setCurrentView('upsell');
      } else if (path === '/success') {
        setCurrentView('success');
      } else {
        setCurrentView('landing');
      }
    };

    checkPath();

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        checkPath();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (currentView !== 'landing') {
      navigateTo('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const triggerPurchase = () => {
    // Open the real secure Kirvano checkout URL in a new window/tab
    window.open('https://pay.kirvano.com/94547bd8-1439-472a-8b54-b50b0389d086', '_blank');
    navigateTo('upsell');
  };

  // FAQ accordion active state index tracker
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Cursor global dynamic glowing movement tracker
  const [glowPos, setGlowPos] = useState({ x: -1000, y: -1000 });
  const [glowOpacity, setGlowOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
      setShowScrollTop(window.scrollY > 400);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setGlowOpacity(1);
      setGlowPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setGlowOpacity(0);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }  // Static Data lists structure mapping
  const stats = [
    { value: '10×', label: 'Mais ligações e rotas traçadas por vizinhos que procuram o seu serviço de perto no bairro.' },
    { value: '10', label: 'Fotos tratadas em segundos por lote: geolocalização e palavras-chave injetadas duma vez só.' },
    { value: '100%', label: 'Livre de Instalação: Funciona online e direto pelo seu navegador. Seguro para idosos e iniciantes.' },
    { value: '3 min', label: 'Tempo médio do envio à pasta otimizada. Sem planilhas ou configurações complexas.' },
  ];

  const painPoints = [
    {
      icon: MapPinOff,
      title: 'Fotos Comuns Sem Coordenadas GPS',
      desc: 'As fotos tiradas por celulares normais são "cegas" para o robô do Google Meu Negócio. Sem a latitude e longitude invisíveis gravadas no arquivo, o Google não sabe se a foto é real ou falsa, rebaixando seu perfil no ranking.',
    },
    {
      icon: Tag,
      title: 'Ausência de Tags Ocultas (IPTC)',
      desc: 'Suas imagens estão subindo sem palavras-chave registradas no código. O Google lê esses metadados ocultos para decidir quem indicar primeiro para o morador do bairro que pesquisa "perto de mim".',
    },
    {
      icon: FileX,
      title: 'Nomes de Arquivos Genéricos ("IMG_2391.jpg")',
      desc: 'Jogar fotos com código de celular nos mapas sepulta sua relevância. Cada arquivo precisa ser renomeado perfeitamente com sua palavra-chave principal + cidade para sinalizar autoridade local instantânea.',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: Upload,
      title: '1. Coloque Suas Fotos',
      desc: 'Clique em Enviar ou simplesmente arraste suas fotos. O sistema funciona instantaneamente, sem preencher cadastros cansativos ou senhas.',
    },
    {
      num: '02',
      icon: MapPin,
      title: '2. Insira Seu Endereço de Atendimento',
      desc: 'Digite de forma simples onde sua empresa fica. Nosso script calcula as coordenadas exatas de satélite e as injeta de forma blindada nas imagens.',
    },
    {
      num: '03',
      icon: Archive,
      title: '3. Baixe a Pasta Otimizada (.zip)',
      desc: 'Clique uma vez e faça o download dos arquivos perfeitamente renomeados e geo-arranjados. Suba-os no Google e comece a subir no ranking hoje!',
    },
  ];

  const features = [
    {
      icon: Navigation,
      title: 'Conversor Automático de Endereço em GPS',
      desc: 'Chega de lidar com números complicados de latitude e longitude. Apenas digite o endereço físico e nosso conversor calcula os milissegundos geográficos na hora.',
    },
    {
      icon: Tags,
      title: 'Saturador Inteligente de Palavras-Chave',
      desc: 'Nós injetamos termos exatos de alta intenção de busca ("melhor", "barato", "perto de mim") direto no DNA das imagens para capturar tráfego regional.',
    },
    {
      icon: FileText,
      title: 'Codificação de Legendas Invisíveis (IPTC)',
      desc: 'Inserimos descrições detalhadas do seu nicho no fundo dos metadados. O robô do Google consome essa informação prioritariamente no ranking.',
    },
    {
      icon: FolderPen,
      title: 'Renomeador Sequencial Profissional',
      desc: 'Adeus "IMG_1234.png". Seus arquivos são rebatizados seguindo fórmulas exatas de SEO Local que geram autoridade perante o Google algoritmicamente.',
    },
    {
      icon: Layers,
      title: 'Preservação de Resolução Máxima',
      desc: 'Nosso processo de injeção de metadados não compacta nem diminui a nitidez das fotos. Suas imagens continuam lindas, nítidas e profissionais.',
    },
    {
      icon: Package,
      title: 'Compactador Automático Tudo-Pronto',
      desc: 'Entregamos seu lote inteiro compilado de forma organizada dentro de um arquivo ZIP leve, facilitando muito o upload no painel do Google.',
    },
    {
      icon: Monitor,
      title: 'Interface Anti-Confusão Sem Menu Chato',
      desc: 'Telas sem poluição visual, projetadas com fontes grandes e campos amigáveis, ideais para donos de negócios locais focados em faturamento rápido.',
    },
    {
      icon: Table,
      title: 'Relatório Interno Prático',
      desc: 'Acompanhe de forma simples o progresso científico de cada imagem, sabendo exatamente quais dados foram georreferenciados no processo.',
    },
    {
      icon: Satellite,
      title: 'Sinal Verificado de Longitude Certa',
      desc: 'Utiliza validadores geográficos modernos para garantir que os servidores de imagem do Google aprovem seus metadados de primeira.',
    },
  ];

  const comparisons = [
    {
      aspect: 'Gravação de GPS EXIF Terrestre',
      without: 'Metadados vazios (Google não sabe onde a foto foi tirada)',
      with: 'Coordenadas de satélite precisas cravadas no código',
    },
    {
      aspect: 'Agilidade de Processamento',
      without: 'Trabalho manual, demorando até 40 minutos por imagem',
      with: 'Lote completo de até 10 imagens tratado em menos de 180 segundos',
    },
    {
      aspect: 'Otimização de Termos Ocultos',
      without: 'Sem palavras-chave e sem relevância semântica regional',
      with: 'Keywords inteligentes de alta intenção injetadas no IPTC',
    },
    {
      aspect: 'Padrão dos Nomes dos Arquivos',
      without: 'Código aleatório gerado pelo celular ("IMG_0991.HEIC")',
      with: 'Palavra-chave principal + Cidade de busca do cliente',
    },
    {
      aspect: 'Curva de Aprendizado',
      without: 'Necessita softwares de edição complexos e caros',
      with: 'Sem complicações: projetado inclusive para idosos e iniciantes',
    },
  ];

  const testimonials = [
    {
      name: 'Carlos Eduardo',
      role: 'Especialista em SEO Local',
      rating: 5,
      text: 'O FotoSEO é indispensável. Consegui posicionar uma clínica médica local na Posição #1 no bairro Jardins em apenas 10 dias. Georreferenciamento de imagens é o maior segredo do Maps.',
    },
    {
      name: 'Vanessa Martins',
      role: 'Agência VM Digital',
      rating: 5,
      text: 'Trabalho com comércio local e me poupou horas. Não preciso mais de editores desktop difíceis de configurar. Digito o endereço do cliente, arrasto as fotos e o Zip sai pronto na hora.',
    },
    {
      name: 'Rodrigo Pinheiro',
      role: 'Consultor de Tráfego Regional',
      rating: 5,
      text: 'O ganho na relevância do Google Meu Negócio usando metadados EXIF/IPTC limpos e estruturados é absurdo. Ideal para quem presta serviço e quer dominar as buscas locais.',
    },
    {
      name: 'Seu Antônio de Souza',
      role: 'Dono de Oficina Mecânica (68 anos)',
      rating: 5,
      text: 'Não entendo nada de computador e achei que seria muito difícil. Mas o FotoSEO é muito simples! Só coloco minhas fotos, escrevo meu endereço e tudo funciona sozinho. Recomendo muito!',
    },
  ];

  const faqItems = [
    {
      question: 'Como funciona a otimização de imagens?',
      answer:
        'Nossa tecnologia lê e reconstrói as coordenadas geográficas (GPS) diretamente nos metadados EXIF/IPTC de suas fotos. Isso indica de forma inequívoca ao algoritmo do Google que as imagens foram tiradas no exato local de atendimento do seu cliente, aumentando exponencialmente sua visibilidade.',
    },
    {
      question: 'Eu preciso instalar algum programa local?',
      answer:
        'Não, o FotoSEO funciona 100% online, diretamente no seu navegador Chrome, Safari ou Edge. Você pode usá-lo do celular, notebook ou desktop sem instalar absolutamente nada.',
    },
    {
      question: 'O Google Maps pode penalizar meu perfil?',
      answer:
        'Ao contrário. A injeção de dados de geolocalização válidos e tags estruturadas cumpre rigorosamente as diretrizes recomendadas pelas boas práticas de SEO Local. Nós usamos metadados limpos e sem spam.',
    },
    {
      question: 'Consigo otimizar várias fotos de uma vez?',
      answer:
        'Sim! Você pode processar em lotes de até 10 fotos por operação em segundos. Insira as informações uma única vez e baixe todas compactadas em um arquivo ZIP limpo e otimizado.',
    },
    {
      question: 'Para quem é indicado o FotoSEO?',
      answer:
        'É perfeito para agências de marketing, especialistas em SEO Local, fotógrafos profissionais, gestores de tráfego e donos de negócios locais que desejam subir no Google Maps sem programação.',
    },
    {
      question: 'Como funciona a garantia de satisfação?',
      answer:
        'Oferecemos uma garantia incondicional de 7 dias. Se por qualquer motivo você não perceber o aumento de relevância ou não se adaptar ao fluxo de trabalho, devolvemos 100% do seu investimento de forma célere.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-purple-900/40">
      {/* Dynamic radial glow (following mouse position safely) */}
      <div
        className="cursor-glow hidden md:block"
        style={{
          left: `${glowPos.x}px`,
          top: `${glowPos.y}px`,
          opacity: glowOpacity,
          transition:
            'opacity 0.4s ease, left 120ms cubic-bezier(0.1, 0.47, 0.43, 0.88), top 120ms cubic-bezier(0.1, 0.47, 0.43, 0.88)',
        }}
      />

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-[20px] py-4 border-white/8'
            : 'bg-transparent py-6 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo element matches layout guidelines */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('hero')}
          >
            <InteractiveLogo size="sm" />
            <span className="text-white text-lg font-semibold tracking-tight">FotoSEO</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('funcionamento')}
              className="text-[#9a9a9a] hover:text-white text-[14px] font-medium tracking-normal transition-colors cursor-pointer"
            >
              Como funciona
            </button>
            <button
              onClick={() => handleNavClick('recursos')}
              className="text-[#9a9a9a] hover:text-white text-[14px] font-medium tracking-normal transition-colors cursor-pointer"
            >
              Recursos
            </button>
            <button
              onClick={() => handleNavClick('preco')}
              className="text-[#9a9a9a] hover:text-white text-[14px] font-medium tracking-normal transition-colors cursor-pointer"
            >
              Preço
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-[#9a9a9a] hover:text-white text-[14px] font-medium tracking-normal transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>

          {/* Primary Action Button (Right) */}
          <div className="hidden md:block">
            <RippleButton onClick={triggerPurchase}>Comprar agora</RippleButton>
          </div>

          {/* Mobile responsive hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-[24px] border border-white/8 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Mobile menu panel dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[100%] left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/8 py-6 px-6 flex flex-col gap-5 md:hidden">
            <button
              onClick={() => handleNavClick('funcionamento')}
              className="text-left text-[#9a9a9a] hover:text-white text-[15px] font-medium tracking-normal border-b border-white/5 pb-2 transition-colors"
            >
              Como funciona
            </button>
            <button
              onClick={() => handleNavClick('recursos')}
              className="text-left text-[#9a9a9a] hover:text-white text-[15px] font-medium tracking-normal border-b border-white/5 pb-2 transition-colors"
            >
              Recursos
            </button>
            <button
              onClick={() => handleNavClick('preco')}
              className="text-left text-[#9a9a9a] hover:text-white text-[15px] font-medium tracking-normal border-b border-white/5 pb-2 transition-colors"
            >
              Preço
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left text-[#9a9a9a] hover:text-white text-[15px] font-medium tracking-normal border-b border-white/5 pb-2 transition-colors"
            >
              FAQ
            </button>
            <RippleButton className="w-full mt-2" onClick={triggerPurchase}>
              Comprar agora
            </RippleButton>
          </div>
        )}
      </nav>

      {currentView === 'landing' && (
        <>
          {/* HERO SECTION */}
          <section
            id="hero"
            className="relative min-h-screen w-full flex items-center bg-[#000000] overflow-hidden px-6 pt-32 pb-16 z-10"
          >
        {/* Particle constellation draws in canvas */}
        <CanvasHero />

        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Left side text layout: max-width 520px constraint strictly */}
            <div className="md:col-span-7 xl:col-span-6 max-w-[520px] text-center md:text-left">
              {/* Highlight Featured Interactive Logo (Neuromarketing Highlight) */}
              <div className="flex justify-center md:justify-start mb-6 animate-fade-up" style={{ animationDelay: '0s' }}>
                <InteractiveLogo size="xl" className="hover:scale-105 transition-all duration-300" />
              </div>

              {/* Eyebrow: premium caps tracking typography */}
              <div
                className="animate-fade-up text-[11px] sm:text-[13px] font-extrabold tracking-[0.12em] uppercase mb-5 flex flex-col gap-1 text-center md:text-left"
                style={{ animationDelay: '100ms' }}
              >
                <span className="text-[#ffd200]">Otimização inteligente de imagens</span>
                <span className="text-emerald-400">especialmente para atrair clientes do Google Maps</span>
              </div>

              {/* H1 Headline display splits precisely onto 3 lines */}
              <h1 className="text-white font-[800] leading-[1.0] tracking-[-0.04em] mb-8 text-[32px] sm:text-[46px] lg:text-[58px] uppercase text-center md:text-left">
                <span
                  className="block animate-fade-up"
                  style={{ animationDelay: '200ms' }}
                >
                  Injete GPS,
                </span>
                <span
                  className="block text-[#ffd200] italic font-bold animate-fade-up"
                  style={{ animationDelay: '300ms' }}
                >
                  tags e metadados
                </span>
                <span
                  className="block text-white animate-fade-up"
                  style={{ animationDelay: '400ms' }}
                >
                  e suba no Maps!
                </span>
              </h1>

              {/* Body message with dynamic neuromarketing typewriter logic */}
              <div
                className="animate-fade-up mb-10 text-center md:text-left"
                style={{ animationDelay: '500ms' }}
              >
                <HeroTypewriter />
              </div>

              {/* Action columns buttons stack on mobile, inline on desktop */}
              <div
                className="animate-fade-up flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4"
                style={{ animationDelay: '600ms' }}
              >
                <RippleButton className="py-[18px] px-8" onClick={triggerPurchase}>
                  Comprar agora <ArrowRight className="w-4 h-4 ml-1" />
                </RippleButton>

                <button
                  onClick={() => scrollToSection('funcionamento')}
                  className="h-[52px] cursor-pointer rounded-[24px] border border-white/8 text-white hover:bg-white/5 px-6 uppercase tracking-[0.05em] text-[12px] font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                >
                  Ver como funciona <ChevronDown className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Right side blank element. Canvas automatically fits inside the absolute region */}
            <div className="hidden md:block md:col-span-5 xl:col-span-6 h-[400px]"></div>
          </div>
        </div>
      </section>

      {/* IMAGEM EM DESTAQUE EXPLICATIVA - ANTES E DEPOIS (PROVA VISUAL DE ALTA CONVERSÃO) */}
      <section className="bg-[#030303] py-12 sm:py-16 border-t border-b border-white/5 relative overflow-hidden z-10">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal delay={100} className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffd200]/10 border border-[#ffd200]/20 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#ffd200] mb-4">
              ⚡ PROVA VISUAL DE ALTA INDEXAÇÃO
            </span>
            <h2 className="text-[22px] sm:text-[32px] font-extrabold text-white tracking-tight uppercase leading-tight mb-3 text-center">
              A Diferença que Coloca sua Empresa na <span className="text-emerald-400">Posição #1</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-[13px] sm:text-[15px] font-medium leading-relaxed text-center">
              Veja abaixo como o robô de inteligência geográfica do Google lê uma foto normal vs. uma foto otimizada pelo <strong className="text-white">FotoSEO</strong>.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200} className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-2 sm:p-3 shadow-[0_0_50px_rgba(255,210,0,0.05)]">
            {/* Visual Accent Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Headers inside the presentation card */}
            <div className="grid grid-cols-2 gap-2 text-center py-2 sm:py-3 mb-2 border-b border-white/5 text-[10px] sm:text-[12px] font-bold tracking-widest uppercase">
              <div className="text-rose-500 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping hidden sm:inline" />
                FOTO COMUM (INVISÍVEL)
              </div>
              <div className="text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline" />
                FOTO COM FOTOSEO (RANKER)
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-zinc-950">
              <img
                src="https://img.fotoseo.shop/antes-depois-fotoseo.webp"
                alt="Comparativo Antes e Depois FotoSEO - Injeção de metadados geotagging EXIF e IPTC para Google Maps"
                className="w-full h-auto object-cover select-none transition-transform duration-700 hover:scale-[1.01]"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              
              {/* Watermark scanlines or overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Micro neuromarketing details at bottom of image */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-[11px] text-zinc-500 font-mono">
              <div className="flex items-center gap-1.5 text-center sm:text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Injetor de Coordenadas Ativo de Alta Precisão</span>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <span>Exif 2.32 Compliant</span>
                <span className="text-emerald-400 font-bold">100% SEGURO PARA O GOOGLE</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-black py-24 border-t border-white/8 border-b z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-0">
            {stats.map((stat, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 100}
                className={`flex flex-col p-6 md:px-10 ${
                  idx !== 0 ? 'md:border-l border-white/8' : ''
                }`}
              >
                <div className="text-[#ffd200] font-[900] text-[58px] md:text-[68px] tracking-[-0.04em] leading-none mb-4 animate-pulse">
                  <StatCounter value={stat.value} />
                </div>
                <div className="text-zinc-100 text-[16px] font-semibold leading-relaxed tracking-wide">
                  {stat.label}
                </div>
                <span className="text-[11px] font-mono font-bold uppercase text-zinc-500 tracking-widest mt-3">
                  ✓ Verificado em tempo real
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA SECTION (Pain points with subtle red border) */}
      <section className="bg-black py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              O Gargalo Invisível
            </span>
            <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-5 uppercase text-center">
              <span className="block text-white">Por que suas fotos normais</span>
              <span className="block text-[#ffd200] italic font-bold">estão matando o seu</span>
              <span className="block text-white">posicionamento no Google?</span>
            </h2>
            <p className="text-white/90 font-medium text-[16px] leading-[1.6] text-justify md:text-center">
              O robô do Google não consegue enxergar rostos ou fachadas perfeitamente. Ele precisa de dados geográficos e tags ocultas codificados dentro de cada arquivo de imagem para comprovar a relevância local.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <ScrollReveal
                  key={idx}
                  delay={idx * 150}
                  className="group relative rounded-[24px] border border-red-500/15 bg-[#000000] p-8 hover:border-red-500/30 transition-all duration-300 transform"
                >
                  {/* Large, clear icon for elderly users */}
                  <div className="w-18 h-18 rounded-[24px] border border-red-500/25 bg-red-955/15 flex items-center justify-center mb-6 mx-auto md:mx-0 transition-all duration-300 group-hover:scale-105">
                    <IconComponent className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-[20px] font-semibold text-white tracking-tight mb-3 text-center md:text-left">
                    {item.title}
                  </h3>
                  <p className="text-zinc-100 font-medium text-[15px] leading-relaxed text-center md:text-left md:text-justify">
                    {item.desc}
                  </p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA SECTION */}
      <section id="funcionamento" className="bg-black py-24 border-t border-white/8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              Praticidade Absoluta
            </span>
            <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em] leading-[1.1] uppercase text-center">
              <span className="block text-white">A FÓRMULA SIMPLES DE 3 PASSOS</span>
              <span className="block text-[#ffd200] italic font-bold">QUE TE COLOCA EM PRIMEIRO LUGAR</span>
              <span className="block text-white">NO GOOGLE MAPS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <ScrollReveal
                  key={idx}
                  delay={idx * 150}
                  className="group relative rounded-[24px] border border-white/8 bg-[#000000] p-8 hover:border-plum-voltage/40 hover:-translate-y-2.5 transition-all duration-300"
                >
                  {/* Number shadow elements */}
                  <div className="absolute top-6 right-8 text-[72px] font-bold leading-none text-white/[0.03] select-none">
                     {item.num}
                  </div>

                  {/* Large, clear icon for elderly users */}
                  <div className="w-18 h-18 rounded-[24px] border border-plum-voltage/30 bg-plum-voltage/10 flex items-center justify-center mb-8 mx-auto md:mx-0 transition-all duration-300 group-hover:scale-105">
                    <IconComponent className="w-8 h-8 text-plum-voltage" />
                  </div>

                  <h3 className="text-[20px] font-semibold text-white tracking-tight mb-3 text-center md:text-left">
                    {item.title}
                  </h3>
                  <p className="text-zinc-100 font-medium text-[15px] leading-relaxed text-center md:text-left md:text-justify">
                    {item.desc}
                  </p>

                  {/* bottom accent border hover line animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-plum-voltage rounded-b-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECURSOS PANEL (Grid 3x3 with lichen icon colors) */}
      <section id="recursos" className="bg-black py-24 border-t border-white/8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 px-4">
            <span className="text-[12px] font-semibold tracking-[0.025em] uppercase text-plum-voltage mb-4 block text-center">
              Poder de Fogo Completo
            </span>
            <h2 className="text-[28px] md:text-[38px] font-bold text-white tracking-[-0.03em] leading-[1.1] uppercase text-center">
              <span className="block text-white">Tecnologia Completa para você</span>
              <span className="block text-[#ffd200] italic font-bold">Dominar a sua Cidade</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <ScrollReveal
                  key={idx}
                  delay={(idx % 3) * 100}
                  className="group relative rounded-[24px] border border-white/8 bg-[#000000] p-8 hover:border-plum-voltage/40 hover:-translate-y-2.5 transition-all duration-300"
                >
                  {/* Large, clear icon for elderly users */}
                  <div className="w-18 h-18 rounded-[24px] border border-lichen/35 bg-lichen/10 flex items-center justify-center mb-6 mx-auto md:mx-0 transition-all duration-300 group-hover:scale-105">
                    <IconComponent className="w-8 h-8 text-lichen" />
                  </div>

                  <h3 className="text-[18px] font-semibold text-white tracking-tight mb-2 text-center md:text-left">
                    {item.title}
                  </h3>
                  <p className="text-zinc-100 font-medium text-[14px] leading-relaxed text-center md:text-left md:text-justify">
                    {item.desc}
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-plum-voltage rounded-b-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARAÇÃO SECTION (Detailed visual board) */}
      <section className="bg-black py-24 border-t border-white/8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              Comparativo Técnico
            </span>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-5 uppercase text-center">
              <span className="block text-white">O ABISMO DE DIFERENÇA</span>
              <span className="block text-[#ffd200] italic font-bold">ENTRE QUEM VENDE MUITO</span>
              <span className="block text-white">E QUEM CONTINUA INVISÍVEL</span>
            </h2>
            <p className="text-white/95 font-[500] text-[15px] text-justify md:text-center">
              Veja a diferença marcante entre trabalhar de forma amadora versus injetar metadados geo-estruturados de extrema relevância local.
            </p>
          </div>

          {/* Comparison table with nice high contrast lines */}
          <ScrollReveal className="overflow-x-auto rounded-[24px] border border-white/8">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  <th className="p-6 text-[13px] font-bold uppercase tracking-wider text-white w-[30%]">
                    Situação
                  </th>
                  <th className="p-6 text-[13px] font-bold uppercase tracking-wider text-red-300 w-[35%] border-l border-white/8">
                    Sem FotoSEO
                  </th>
                  <th className="p-6 text-[13px] font-bold uppercase tracking-wider text-plum-voltage w-[35%] border-l border-white/8">
                    Com FotoSEO
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-white/8 hover:bg-white/[0.01] transition-colors ${
                      idx === comparisons.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="p-6 text-white text-[15px] font-medium leading-normal">
                      {row.aspect}
                    </td>
                    <td className="p-6 text-white font-medium text-[14px] leading-relaxed border-l border-white/8">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{row.without}</span>
                      </div>
                    </td>
                    <td className="p-6 text-white text-[14px] leading-relaxed border-l border-white/8">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-plum-voltage shrink-0 mt-0.5" />
                        <span className="font-bold text-white">{row.with}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>
        </div>
      </section>

      {/* TESTIMONIALS MARQUEE SCREEN SECTION */}
      <section className="bg-black py-24 border-t border-white/8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center max-w-2xl mx-auto px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              Sucesso Prático
            </span>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-[1.1] uppercase text-center">
              <span className="block text-white">RESULTADOS REALMENTE INCRÍVEIS</span>
              <span className="block text-[#ffd200] italic font-bold">DE QUEM JÁ DOMINOU O GOOGLE MAPS</span>
            </h2>
          </div>
        </div>

        {/* Endless marquee slider frame with absolute lateral shadows gradients */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Subtle blend borders */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-infinite flex gap-6">
            {[...testimonials, ...testimonials].map((card, idx) => (
              <div
                key={idx}
                className="w-[320px] md:w-[380px] shrink-0 rounded-[24px] border border-white/8 bg-[#000000] p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars row strictly with Lucide stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(card.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-spark text-amber-spark" />
                    ))}
                  </div>
                  <p className="text-white text-[15px] leading-relaxed italic mb-8 font-medium text-justify">
                    "{card.text}"
                  </p>
                </div>

                <div className="border-t border-white/8 pt-5 flex flex-col">
                  <span className="text-white font-bold text-[15px]">{card.name}</span>
                  <span className="text-white/70 font-medium text-[13px]">{card.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="preco" className="bg-black py-24 border-t border-white/8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              Acesso Imediato
            </span>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-5 uppercase text-center">
              <span className="block text-white">ADQUIRA AGORA O SEU ACESSO VITALÍCIO</span>
              <span className="block text-[#ffd200] italic font-bold">COM DESCONTO DE LANÇAMENTO</span>
              <span className="block text-white">EXCLUSIVO</span>
            </h2>
          </div>

          {/* Pricing wrapper cards limits */}
          <div className="max-w-[480px] mx-auto">
            <ScrollReveal className="rounded-[24px] border border-plum-voltage/45 bg-[#000000] p-8 md:p-10 relative flex flex-col items-stretch overflow-hidden">
              {/* Launcher accent label badge */}
              <div className="absolute top-4 right-4 rounded-full border border-amber-spark/30 px-3.5 py-1 text-[10px] font-semibold tracking-wide uppercase text-amber-spark">
                Oferta de Lançamento
              </div>

              <div className="mb-6">
                <span className="text-white font-bold text-[15px] block mb-2">Licença Vitalícia</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-white/60 line-through text-[18px]">R$ 197</span>
                  <span className="text-white font-[800] text-[60px] md:text-[72px] tracking-tight leading-none">
                    R$ 97
                  </span>
                </div>
                <span className="text-white font-bold text-[12px] uppercase tracking-wider block mt-1.5">
                  Pagamento único. Sem mensalidades.
                </span>
              </div>

              {/* Nine check features */}
              <ul className="space-y-4 mb-10 border-t border-white/8 pt-6">
                {[
                  'Injeção GPS EXIF direto no endereço por mapa',
                  'Processamento em massa de até 10 fotos por operação',
                  'Injeção IPTC de palavras-chave estruturadas',
                  'Controle de Alt tags, títulos e metadados ocultos',
                  'Renomeador de lote automatizado para arquivos',
                  'Sem compressão - Preserva qualidade 100%',
                  'Exportação compactada automática em .ZIP',
                  'Acesso vitalício completo via navegador',
                  'Sem mensalidades, taxas ocultas ou limites de uso',
                ].map((item, id) => (
                  <li key={id} className="flex items-start gap-3 text-[14px] text-white font-semibold">
                    <Check className="w-4 h-4 text-plum-voltage shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Buying button strictly Plum Voltage */}
              <RippleButton className="w-full py-4.5 mb-6 text-center text-[12px]" onClick={triggerPurchase}>
                Garantir licença FotoSEO
              </RippleButton>

              {/* Warrant trust elements */}
              <div className="flex items-center justify-center gap-2.5 text-[12px] text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-lichen" />
                <span>Garantia incondicional de 7 dias com reembolso integral</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ SECTION Accordion */}
      <section id="faq" className="bg-black py-24 border-t border-white/8 relative text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 px-4">
            <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center">
              Dúvidas Frequentes
            </span>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white tracking-[-0.03em] leading-[1.1] uppercase text-center">
              <span className="block text-white">RESPOSTAS DIRETAS E 100% TRANSPARENTES</span>
              <span className="block text-[#ffd200] italic font-bold">PARA SUAS DÚVIDAS</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <ScrollReveal
                key={idx}
                className="rounded-[24px] border border-white/8 bg-black transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-[16px] md:text-[18px] font-medium text-white select-none">
                    {item.question}
                  </span>
                  <div className="w-8 h-8 rounded-[24px] border border-white/8 flex items-center justify-center shrink-0 transition-all duration-300">
                    <Plus
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        openFaqIndex === idx ? 'rotate-45 text-plum-voltage' : ''
                      }`}
                    />
                  </div>
                </button>

                <div
                  className="accordion-content"
                  style={{
                    maxHeight: openFaqIndex === idx ? '250px' : '0px',
                  }}
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-white/5 text-white font-[500] text-[15px] leading-relaxed leading-[1.6] text-justify">
                    {item.answer}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA PANEL SECTION */}
      <section className="bg-black py-28 border-t border-white/8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-[28px] sm:text-[42px] lg:text-[54px] font-[800] text-white tracking-[-0.03em] leading-[0.95] mb-10 uppercase text-center">
              <span className="block text-white">ENQUANTO VOCÊ PENSA,</span>
              <span className="block text-[#ffd200] italic font-bold">SEU CONCORRENTE JÁ INJETOU OUTRA FOTO!</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <RippleButton className="px-10 py-5" onClick={triggerPurchase}>
                Começar agora <ArrowRight className="w-4 h-4 ml-1" />
              </RippleButton>
            </div>

            {/* Shield and security guidelines */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/8 pt-8 max-w-lg mx-auto">
              <div className="flex items-center gap-2 text-[12px] text-white uppercase tracking-widest font-semibold">
                <ShieldCheck className="w-4 h-4 text-lichen" />
                <span>Compra robusta e blindada</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white uppercase tracking-widest font-semibold">
                <Zap className="w-4 h-4 text-lichen" />
                <span>Acesso instantâneo imediato</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white uppercase tracking-widest font-semibold">
                <Lock className="w-4 h-4 text-lichen" />
                <span>Ambiente totalmente criptografado</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>)}

      {/* ==========================================
      // 2. HIGH-CONVERTING PREMIUM UPSELL VIEW
      // ========================================== */}
      {currentView === 'upsell' && (
        <div className="pt-32 pb-24 px-6 relative z-10 w-full animate-fade-in text-white">
          <div className="max-w-6xl mx-auto">
            {/* Top Warning Banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-[#ffb829]/25 bg-[#000000] p-5 md:p-6 rounded-[24px] mb-12">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#ffb829]/10 flex items-center justify-center border border-[#ffb829]/15 shrink-0">
                  <Sparkles className="w-4 h-4 text-[#ffb829]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold tracking-[0.05em] uppercase text-[#ffb829]">
                    Oferta de Lançamento Unilateral
                  </h4>
                  <p className="text-[12.5px] text-white font-medium mt-1">
                    Não atualize esta tela. Seu pedido original do FotoSEO Standard está garantido.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <ActiveViewersCounter />
                <CountdownTimer />
              </div>
            </div>

            {/* Headline Display */}
            <div className="text-center md:text-left mb-16 max-w-4xl mx-auto px-4">
              <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center md:text-left">
                Upgrade Imediato de Alta Conversão
              </span>
              <h1 className="text-[28px] sm:text-[44px] lg:text-[58px] font-bold text-white tracking-[-0.04em] leading-[1.0] mb-6 uppercase text-center md:text-left">
                <span className="block text-white">Domine o Google Maps totalmente</span>
                <span className="block text-[#ffd200] italic font-bold">e multiplique seu faturamento</span>
                <span className="block text-white">hoje!</span>
              </h1>
              <p className="text-[15px] sm:text-[17px] text-white leading-[1.6] max-w-2xl font-bold text-justify md:text-left">
                Deseja acelerar seus resultados? Adicione o <strong className="text-[#ffd200]">FotoSEO Pro Accelerator Suite</strong> por uma fração insignificante do valor avulso e domine o ranking concorrente.
              </p>
            </div>

            {/* Split Benefits Checklist vs Demo simulator Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
              
              {/* Left Column Checklist details card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 md:p-8 rounded-[24px] border border-white/7 bg-[#000000] space-y-6">
                  <h3 className="text-[18px] font-semibold text-white tracking-tight flex flex-col md:flex-row items-center md:items-start gap-2 text-center md:text-left">
                    <Sparkles className="w-4.5 h-4.5 text-plum-voltage" />
                    O que você recebe imediatamente ao ativar o Upgrade Pro:
                  </h3>

                  <div className="space-y-5 border-t border-white/5 pt-5">
                    {[
                      {
                        title: 'Masterclass Dominadores do 3-Pack',
                        desc: 'Treinamento prático em vídeo demonstrando 3 métodos avançados para indexar imagens e ultrapassar competidores locais em bairros cinzentos.',
                        val: 'R$ 297',
                      },
                      {
                        title: 'Gerador GMB AI - Copys & Descrições',
                        desc: 'Algoritmo proprietário para formular e estruturar descrições GMB otimizadas para IA baseadas em busca de intenção de compra exta.',
                        val: 'R$ 147',
                      },
                      {
                        title: '50 Templates Canva de Auto-Engajamento',
                        desc: 'Postagens de alta conversão visual feitas especificamente para negócios locais aumentarem a métrica de cliques diretos no mapa.',
                        val: 'R$ 97',
                      },
                      {
                        title: 'Planilha CRM Prospecção Local Premium',
                        desc: 'O roteiro definitivo de auditoria e prospecção fria para fechar contratos de SEO local sem objeção de preço.',
                        val: 'R$ 97',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-[#15846e]/10 border border-[#15846e]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#15846e]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2.5">
                            <h4 className="text-[14px] font-semibold text-white tracking-tight">{item.title}</h4>
                            <span className="text-[11px] font-mono font-semibold text-[#ffb829] tracking-wider px-2 py-0.5 rounded-full border border-[#ffb829]/15 bg-[#ffb829]/5 shrink-0">{item.val}</span>
                          </div>
                          <p className="text-[13px] text-white mt-1 leading-[1.45] font-semibold text-justify">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-5 flex items-center justify-between text-[13px] text-white font-bold">
                    <span>Preço total se comprado separadamente:</span>
                    <span className="font-bold text-white/80 line-through">R$ 638,00</span>
                  </div>
                </div>

                {/* Triple Guarantee Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 border border-white/6 rounded-[24px] text-center bg-black">
                    <ShieldCheck className="w-5 h-5 text-[#15846e] mx-auto mb-2" />
                    <h5 className="text-[12px] font-semibold text-white uppercase tracking-wider">Garantia 7 Dias</h5>
                    <p className="text-[11px] text-white font-bold mt-1">Reembolso incondicional</p>
                  </div>
                  <div className="p-4 border border-white/6 rounded-[24px] text-center bg-black">
                    <Lock className="w-5 h-5 text-[#15846e] mx-auto mb-2" />
                    <h5 className="text-[12px] font-semibold text-white uppercase tracking-wider">Criptografia SSL</h5>
                    <p className="text-[11px] text-white font-bold mt-1">Checkout 100% Blindado</p>
                  </div>
                  <div className="p-4 border border-white/6 rounded-[24px] text-center bg-black">
                    <Zap className="w-5 h-5 text-[#15846e] mx-auto mb-2" />
                    <h5 className="text-[12px] font-semibold text-white uppercase tracking-wider">Envio Excedente</h5>
                    <p className="text-[11px] text-white font-bold mt-1">Acesso instantâneo via email</p>
                  </div>
                </div>
              </div>

              {/* Right Column Interactive simulation terminal panel */}
              <div className="lg:col-span-5 bg-black border border-white/8 rounded-[24px] p-6 lg:p-8 relative overflow-hidden self-stretch flex flex-col justify-between space-y-8">
                <div className="absolute top-0 right-0 w-36 h-36 bg-plum-voltage/8 blur-[65px] rounded-full pointer-events-none" />

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-[11px] font-mono text-plum-voltage tracking-[0.05em] uppercase font-bold">
                      PRO_RANK_ACCELERATOR
                    </div>
                    <span className="px-2.5 py-1 rounded-[24px] bg-[#15846e]/10 border border-[#15846e]/20 text-[9px] font-mono text-[#15846e] flex items-center gap-1 font-semibold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15846e] animate-pulse" />
                      SIMULAÇÃO DE CONVERSÃO
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Simulated Ranking Item */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[24px]">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-[12px] font-semibold text-white">Clínica Odonto Prime</span>
                        <span className="text-white font-semibold font-mono text-[11px]">MAPS_4812</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center mt-3">
                        <div className="p-2.5 bg-black rounded-[24px] border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-white/70">Normal</span>
                          <div className="text-[15px] text-red-400 font-bold mt-1">Posição #18</div>
                        </div>
                        <div className="p-2.5 bg-black rounded-[24px] border border-[#15846e]/20">
                          <span className="text-[10px] uppercase font-bold text-white/70">Pro Upgrade</span>
                          <div className="text-[15px] text-[#15846e] font-bold mt-1">Posição #1</div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive GMB Copy Generator Console demo */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[24px] space-y-3">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-plum-voltage block">
                        IA GMB Copywriter Engine
                      </span>
                      <div className="bg-black p-3 rounded-[24px] border border-white/5 font-mono text-[11px] text-white/90 leading-relaxed font-semibold">
                        "Clínica Odonto Prime em São Paulo especializada em implantes e lentes de contato dentais. Atendimento humanizado no coração comercial da cidade..."
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white font-bold font-mono">
                        <Info className="w-3.5 h-3.5 text-plum-voltage shrink-0" />
                        <span>Injeta palavras-chave altamente geolocalizadas.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  {/* Rating block */}
                  <div className="flex gap-1 items-center mb-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star key={item} className="w-3.5 h-3.5 fill-[#ffb829] text-[#ffb829]" />
                    ))}
                  </div>
                  <blockquote className="text-[13px] italic text-white/95 font-medium leading-[1.5]">
                    "Fechei 3 novos contratos na primeira semana que apliquei o material de prospecção e o gerador de descrições. Vale cada centavo investido!"
                  </blockquote>
                  <span className="text-[11px] font-bold text-white tracking-tight block mt-1">
                    — Douglas G., Consultor de Tráfego Local
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Action Zone */}
            <div className="p-8 sm:p-12 border border-white/8 rounded-[24px] bg-black text-center max-w-3xl mx-auto">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#ffb829] block mb-3 animate-pulse">
                CONDIÇÃO DE TRANSAÇÃO IMEDIATA E ÚNICA
              </span>
              <div className="flex items-baseline justify-center gap-3.5 mb-8">
                <span className="text-white/50 text-[18px] line-through font-bold">R$ 197</span>
                <span className="text-white text-[56px] sm:text-[72px] font-extrabold leading-none tracking-tight">R$ 47</span>
                <span className="text-white text-[14px] font-bold">pago uma única vez</span>
              </div>

              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <RippleButton 
                  className="w-full py-5 text-[12px] bg-plum-voltage text-black hover:bg-[#ffe14f] font-bold hover:scale-[1.04] active:scale-95 transition-all duration-300 shadow-lg shadow-plum-voltage/20"
                  onClick={() => {
                    // Open the official secure Kirvano checkout URL in a new window/tab
                    window.open('https://pay.kirvano.com/94547bd8-1439-472a-8b54-b50b0389d086', '_blank');
                    setUpsellIncluded(true);
                    navigateTo('success');
                  }}
                >
                  SIM, ADICIONAR POR APENAS R$ 47
                </RippleButton>

                <button
                  onClick={() => {
                    navigateTo('downsell');
                  }}
                  className="py-4.5 text-[12px] uppercase tracking-widest text-[#9a9a9a] hover:text-white transition-all duration-300 cursor-pointer text-center font-bold text-[11px] border border-white/10 rounded-[28px] bg-white/5 hover:bg-white/10 hover:scale-[1.03] active:scale-95 animate-pulse"
                >
                  NÃO, OBRIGADO. PREFIRO PERDER ESTA OPORTUNIDADE
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-white text-[12px] mt-6 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#15846e]" />
                <span>Risco zero com 7 dias de garantia integral e incondicional</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
      // 2.5 HIGH-CONVERTING PREMIUM DOWNSELL VIEW
      // ========================================== */}
      {currentView === 'downsell' && (
        <div className="pt-32 pb-24 px-6 relative z-10 w-full animate-fade-in text-white bg-black">
          <div className="max-w-6xl mx-auto">
            {/* Top Warning Banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-[#ffb829]/30 bg-black p-5 md:p-6 rounded-[24px] mb-12 animate-pulse">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#ffb829]/10 flex items-center justify-center border border-[#ffb829]/15 shrink-0">
                  <Sparkles className="w-4 h-4 text-[#ffb829]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold tracking-[0.05em] uppercase text-[#ffb829]">
                    Última Tentativa de Acesso Exclusivo
                  </h4>
                  <p className="text-[12.5px] text-white font-medium mt-1">
                    Espera! Não feche esta tela. Reduzimos o valor para você não ficar de fora do grupo selecto.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <ActiveViewersCounter />
                <CountdownTimer />
              </div>
            </div>

            {/* Headline Display */}
            <div className="text-center md:text-left mb-16 max-w-4xl mx-auto px-4">
              <span className="text-[12px] font-bold tracking-[0.05em] uppercase text-plum-voltage mb-4 block text-center md:text-left">
                🚨 Oportunidade Única de Resgate
              </span>
              <h1 className="text-[28px] sm:text-[44px] lg:text-[58px] font-black text-white tracking-[-0.04em] leading-[1.0] mb-6 uppercase text-center md:text-left">
                <span className="block text-white">Leve o FotoSEO Pro Accelerator</span>
                <span className="block text-[#ffd200] italic font-bold">por apenas R$ 27!</span>
              </h1>
              <p className="text-[15px] sm:text-[17px] text-white leading-[1.6] max-w-3xl font-bold text-justify md:text-left">
                Entendemos que você está hesitante. Por isso, decidimos liberar o <strong className="text-[#ffd200]">Acesso Completo ao FotoSEO Pro Accelerator Suite</strong> com um desconto surreal de resgate. Esta é a ÚLTIMA vez que você verá este preço.
              </p>
            </div>

            {/* Split Benefits Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
              {/* Left Column Checklist details card */}
              <div className="lg:col-span-8 space-y-6">
                <div className="p-6 md:p-8 rounded-[24px] border border-white/7 bg-[#000000] space-y-6">
                  <h3 className="text-[18px] font-bold text-white tracking-tight flex flex-col md:flex-row items-center md:items-start gap-2 text-center md:text-left">
                    <Sparkles className="w-4.5 h-4.5 text-[#ffd200]" />
                    Tudo Incluído no Seu Pacote Especial de R$ 27:
                  </h3>

                  <div className="space-y-5 border-t border-white/5 pt-5">
                    {[
                      {
                        title: 'Masterclass Dominadores do 3-Pack',
                        desc: 'Toda a estratégia em vídeo para colocar suas imagens otimizadas no topo das pesquisas locais e arrebatar clientes diariamente.',
                      },
                      {
                        title: 'Gerador GMB AI - Copys & Descrições',
                        desc: 'O formulador de descrições e legendas de alta relevância por IA para indexação brutal nas coordenadas geográficas.',
                      },
                      {
                        title: '50 Templates Canva + Planilha CRM de Prospecção',
                        desc: 'Os roteiros, modelos prontos e o funil de abordagem definitivo para captar clientes que precisam de SEO.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-[#15846e]/10 border border-[#15846e]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-lichen" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-bold text-white tracking-tight">{item.title}</h4>
                          <p className="text-[13px] text-zinc-100 mt-1 leading-[1.45] font-semibold text-justify">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column Value Card */}
              <div className="lg:col-span-4 p-8 border border-[#ffb829]/20 bg-[#000000] rounded-[24px] text-center flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-[#ffb829] block mb-3">
                    APENAS NESTA TELA
                  </span>
                  <div className="text-[14px] text-white/50 line-through font-bold">R$ 197</div>
                  <div className="text-[52px] sm:text-[62px] font-extrabold text-white leading-none tracking-tight my-4">R$ 27</div>
                  <div className="text-[11px] text-[#ffd200] font-bold uppercase tracking-wider mb-8">
                    Taxa Única Sem Mensalidades!
                  </div>
                </div>

                <div className="space-y-4">
                  <RippleButton
                    className="w-full py-4.5 text-[12px] bg-[#ffd200] text-black font-bold uppercase hover:scale-[1.04] active:scale-95 transition-all duration-300 shadow-lg shadow-[#ffd200]/20"
                    onClick={() => {
                      // Open secure Checkout Kirvano
                      window.open('https://pay.kirvano.com/94547bd8-1439-472a-8b54-b50b0389d086', '_blank');
                      setUpsellIncluded(true);
                      navigateTo('success');
                    }}
                  >
                    QUERO ATIVAR POR R$ 27!
                  </RippleButton>

                  <button
                    onClick={() => {
                      setUpsellIncluded(false);
                      navigateTo('success');
                    }}
                    className="w-full py-3.5 text-[11px] font-bold uppercase text-white/60 hover:text-white border border-white/10 rounded-full hover:bg-white/5 bg-transparent hover:scale-[1.03] active:scale-95 transition-all duration-300 animated-pulse"
                  >
                    NÃO, DEIXAR O ACESSO PRO DE LADO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
      // 3. SECURE INVOICE & ORDER SUCCESSFUL VIEW
      // ========================================== */}
      {currentView === 'success' && (
        <div className="pt-32 pb-24 px-6 relative z-10 w-full animate-fade-in text-white bg-black">
          <div className="max-w-2xl mx-auto">
            {/* Approved Visual Shield */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-[#15846e]/10 border border-[#15846e]/25 flex items-center justify-center mx-auto mb-6">
                <Check className="w-7 h-7 text-[#15846e]" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#15846e] block mb-2">
                Transação Concluída com Sucesso
              </span>
              <h1 className="text-[36px] sm:text-[46px] font-bold tracking-tight leading-[1.1] text-white">
                <span className="block text-white">Seu acesso</span>
                <span className="block text-[#ffd200] italic font-bold">foi liberado!</span>
              </h1>
              <p className="text-[14px] text-white font-medium mt-2">
                O recibo estruturado foi enviado para seu e-mail de faturamento cadastrado.
              </p>
            </div>

            {/* Interactive Invoice card layout */}
            <div className="border border-white/8 rounded-[24px] bg-black overflow-hidden mb-8">
              {/* Row head details */}
              <div className="p-6 bg-white/[0.02] border-b border-white/6 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest block">Identificador</span>
                  <span className="text-[13px] text-white font-mono mt-0.5 block font-bold">#FSEO-9082-TRAC</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest block">Data do Processamento</span>
                  <span className="text-[13px] text-white font-mono mt-0.5 block font-bold">
                    {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Purchase entries breakdown */}
              <div className="p-6 space-y-4">
                <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-2">Resumo da Ordem de Pagamento</div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center gap-4 py-1">
                    <div>
                      <span className="text-[14px] font-bold text-white block">Licença Vitalícia FotoSEO Standard</span>
                      <span className="text-[12px] text-white mt-0.5 block font-medium">Navegador online, injeção de coordenadas e metadados</span>
                    </div>
                    <span className="text-[14px] font-mono font-bold text-white shrink-0">R$ 97,00</span>
                  </div>

                  {upsellIncluded && (
                    <div className="flex justify-between items-center gap-4 py-3 border-t border-white/5">
                      <div>
                        <span className="text-[14px] font-bold text-white block flex items-center gap-2">
                          FotoSEO Pro Accelerator Suite
                          <span className="px-1.5 py-0.5 text-[9px] bg-plum-voltage/10 text-plum-voltage border border-plum-voltage/20 rounded font-bold uppercase tracking-wide">
                            Upgrade Pro
                          </span>
                        </span>
                        <span className="text-[12px] text-white/90 font-medium mt-0.5 block">Masterclass Vídeo, IA Copywriter, Planilha CRM + Templates</span>
                      </div>
                      <span className="text-[14px] font-mono font-bold text-[#ffb829] shrink-0">R$ 27,00</span>
                    </div>
                  )}
                </div>

                {/* Secure bottom overall */}
                <div className="border-t border-white/8 pt-5 mt-5 flex justify-between items-center font-bold">
                  <span className="text-[12px] text-white font-bold uppercase tracking-wider">Total de Débito Seguro</span>
                  <span className="text-[24px] font-mono font-bold text-plum-voltage">
                    R$ {upsellIncluded ? '124,00' : '97,00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration serial credential keys list */}
            <div className="p-6 md:p-8 border border-white/8 bg-black rounded-[24px] space-y-6 mb-10">
              <h3 className="text-[16px] font-semibold text-white tracking-tight flex items-center gap-2">
                <Package className="w-4.5 h-4.5 text-[#15846e]" />
                Suas Chaves e Credenciais de Registro:
              </h3>

              <div className="space-y-4 font-mono text-[13px] border-t border-white/5 pt-5 text-zinc-300">
                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Chave de Licença Standard</span>
                    <span className="text-[13px] text-white font-bold block mt-1">FSEO-8941-KLY9-771B</span>
                  </div>
                  <span className="text-[11px] text-[#15846e] uppercase tracking-wider bg-[#15846e]/10 px-2.5 py-1 rounded-full border border-[#15846e]/20 font-semibold text-right">
                    Ativa
                  </span>
                </div>

                {upsellIncluded && (
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-[24px] flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">Chave de Licença Upgrade Pro</span>
                      <span className="text-[13px] text-white font-bold block mt-1">FSEO-XACC-3312-PLUM</span>
                    </div>
                    <span className="text-[11px] text-[#ffb829] uppercase tracking-wider bg-[#ffb829]/10 px-2.5 py-1 rounded-full border border-[#ffb829]/15 font-semibold text-right">
                      Ativa
                    </span>
                  </div>
                )}
              </div>

              {/* Downloading resources actions */}
              <div className="space-y-3.5">
                <RippleButton className="w-full py-4 text-[12px] bg-plum-voltage text-black hover:bg-[#ffe14f] font-bold" onClick={() => alert('Parabéns! Baixando arquivo ZIP FotoSEO_Standard_Assets.zip com scripts offline.')}>
                  Baixar Script FotoSEO Standard (.ZIP)
                </RippleButton>

                {upsellIncluded && (
                  <button 
                    onClick={() => alert('Redirecionando para o portal Hotmart para assistir à Masterclass Pro e acessar os post templates Canva.')}
                    className="w-full py-4 cursor-pointer hover:bg-white/5 border border-white/7 rounded-[24px] flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#ffb829] transition-all"
                  >
                    Acessar Materiais Pro no Kiwify <ArrowUpRight className="w-4 h-4 text-[#ffb829]" />
                  </button>
                )}
              </div>
            </div>

            {/* Simlator new transaction */}
            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentView('landing');
                  setUpsellIncluded(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-white hover:text-[#ffd200] transition-colors cursor-pointer text-[12px] uppercase font-bold tracking-wider p-2"
              >
                Simular Nova Transação (Voltar ao Início)
              </button>
            </div>
          </div>
        </div>
      )}



      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-white/8 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-between gap-6">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[24px] border border-plum-voltage flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-md font-bold tracking-tight">FotoSEO</span>
            </div>

            <div className="text-white text-[13px] font-bold flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span>&copy; {new Date().getFullYear()} FotoSEO. Todos os direitos reservados.</span>
              <span className="hidden md:inline text-white/30">|</span>
              <span>
                Desenvolvido por{' '}
                <a 
                  href="https://bio.supremamidia.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-plum-voltage hover:underline font-bold"
                >
                  Suprema Mídia
                </a>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="https://www.supremamidia.com.br" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#ffd200] text-[13px] transition-colors font-bold">
                Site do Produtor
              </a>
              <span className="text-white/30">|</span>
              <a href="https://fotoseo.shop" className="text-white hover:text-[#ffd200] text-[13px] transition-colors font-bold">
                Canônica
              </a>
              <span className="text-white/30">|</span>
              <span className="text-white text-[13px] font-bold">Termos de Uso</span>
              <span className="text-white/30">|</span>
              <span className="text-white text-[13px] font-bold">Política de Privacidade</span>
              <span className="text-white/30">|</span>
              <span className="text-white text-[13px] font-bold">Suporte</span>
            </div>
          </div>

          {/* Small secret links to upsell and downsell */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] text-white/40 border-t border-white/5 pt-6 w-full mt-4 font-bold">
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setCurrentView('upsell');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#ffd200] transition-colors cursor-pointer text-[10px] font-bold"
              >
                FSEO_UPSELL_PAGE
              </button>
              <span className="text-white/10">|</span>
              <button 
                onClick={() => {
                  setCurrentView('downsell');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-[#ffd200] transition-colors cursor-pointer text-[10px] font-bold"
              >
                FSEO_DOWNSELL_PAGE
              </button>
            </div>
            <span>FOTOSEO® SISTEMA DE ALTÍSSIMA CONVERSÃO UNIFICADA</span>
          </div>
        </div>
      </footer>

      {/* Floating Dynamic Watermark on Left Side (Cycled Social Proof Alerts) */}
      {currentView === 'landing' && (
        <FloatingWatermarkAlerts />
      )}

      {/* Sticky Bottom CTA Bar for Mobile (High Conversion Asset) */}
      {showScrollTop && currentView === 'landing' && (
        <div className="fixed bottom-0 left-0 right-0 z-45 bg-black/95 backdrop-blur-xl border-t border-white/10 px-5 py-3 md:hidden flex items-center justify-between gap-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold">Acesso Vitalício</span>
            <div className="flex items-baseline gap-1">
              <span className="text-zinc-500 line-through text-[11px]">R$ 197</span>
              <span className="text-[#ffd200] font-[900] text-[18px]">R$ 97</span>
            </div>
          </div>
          <button
            onClick={triggerPurchase}
            className="flex-1 max-w-[210px] h-[48px] bg-[#ffd200] active:bg-[#ffe14f] text-black font-extrabold uppercase text-[12px] tracking-wider rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Garantir Desconto</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>
      )}

      {/* Voltar ao Topo (Back to Top) Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed right-6 z-50 p-4 cursor-pointer rounded-full bg-[#ffd200] hover:bg-[#ffe14f] text-black shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group font-bold uppercase tracking-wider text-[11px] ${
            currentView === 'landing' ? 'bottom-24 md:bottom-6' : 'bottom-6'
          }`}
          title="Voltar ao topo"
        >
          <span className="hidden sm:inline">Voltar ao topo</span>
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform text-black stroke-[3]" />
        </button>
      )}
    </div>
  );
}
