/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  Languages, 
  Sparkles, 
  History as HistoryIcon, 
  User, 
  Star, 
  ChevronRight, 
  ChevronDown, 
  Bookmark, 
  Share2, 
  LogOut,
  BookOpen,
  Heart,
  ShieldCheck,
  Wallet
} from "lucide-react";
import { cn } from "@/src/lib/utils";

// --- Types ---

type LuckLevel = "Supreme" | "Very Lucky" | "Neutral" | "Unlucky";

interface Fortune {
  id: string;
  date: string;
  title: string;
  signNumber: string;
  luck: LuckLevel;
  poem: [string, string];
  insight: string;
  interpretation: string;
  advice: string;
  categories: {
    career: string;
    romance: string;
    health: string;
    wealth: string;
  };
}

type View = "divination" | "history" | "profile" | "result";

// --- Mock Data: Traditional Sign Library ---
// In a full app, this would contain 100 signs. Here are representative samples across different luck levels.
const SIGN_LIBRARY: Record<number, Omit<Fortune, "id" | "date">> = {
  1: {
    title: "飞龙在天",
    signNumber: "第一签",
    luck: "Supreme",
    poem: ["巍巍独步向云间", "玉殿千官第一班"],
    insight: "首领之象，万事大吉",
    interpretation: "此乃乾卦之象。正如巨龙腾空，位列仙班。代表您正处于运势的巅峰，多年努力终获最高认可。",
    advice: "此时应保持正气，提携后进。虽处高位，不可骄傲，方能长久。",
    categories: {
      career: "官运亨通，创业者将获巨大成功。",
      romance: "天作之合，良缘缔结。",
      health: "神清气爽，百病不侵。",
      wealth: "财源广进，正财偏财皆旺。",
    }
  },
  28: {
    title: "韩信弃楚归汉",
    signNumber: "第二十八签",
    luck: "Neutral",
    poem: ["劝君莫惜金缕衣", "劝君惜取少年时"],
    insight: "把握时机，果断抉择",
    interpretation: "韩信初仕项羽而不得志，毅然弃楚归汉，终获重用。此签代表目前的处境虽未必险峻，但缺乏发展空间。",
    advice: "莫要沉溺于现状的安逸，应当在合适的时机做出改变，寻找更广阔的舞台。",
    categories: {
      career: "宜动不宜静，勇于突破现状。",
      romance: "切莫犹豫，真诚表露心迹。",
      health: "需防过劳，调理脾胃为先。",
      wealth: "正财平稳，偏财不宜强求。",
    }
  },
  45: {
    title: "仁杰遇主",
    signNumber: "第四十五签",
    luck: "Very Lucky",
    poem: ["天地变通万物新", "自能遇主遇知音"],
    insight: "贵人相助，枯木逢春",
    interpretation: "狄仁杰才华横溢终遇明主。代表您即将遇到能赏识您的贵人，之前的困顿将一扫而空。",
    advice: "广结善缘，多参加社交活动。机会往往通过他人的引荐到来。",
    categories: {
      career: "有贵人提拔，升迁在即。",
      romance: "经人介绍可获良缘。",
      health: "身体康复，精神焕发。",
      wealth: "有意外之财，多由他人带来。",
    }
  },
  82: {
    title: "苏秦不第",
    signNumber: "第八十二签",
    luck: "Unlucky",
    poem: ["一箭开弓往上发", "虚劳心力事难成"],
    insight: "时机未到，暂且隐忍",
    interpretation: "苏秦初次游说失败，受尽冷遇。代表目前您的计划可能受阻，环境对您不利。",
    advice: "此时不宜强求，应闭门苦读，积蓄力量。等待时机成熟再图大计。",
    categories: {
      career: "阻力重重，建议暂守旧业。",
      romance: "多有口舌，建议冷静处理。",
      health: "心火过旺，注意睡眠。",
      wealth: "有破财之虞，切忌投资。",
    }
  }
};

// Fill the rest with placeholders to ensure 1-100 coverage for the random logic
for (let i = 1; i <= 100; i++) {
  if (!SIGN_LIBRARY[i]) {
    SIGN_LIBRARY[i] = {
      ...SIGN_LIBRARY[28], // Default to a neutral sign for placeholder
      signNumber: `第${i}签`,
      title: `古人故事 ${i}`
    };
  }
}

// --- Components ---

const Layout = ({ children, currentView, setView }: { children: React.ReactNode, currentView: View, setView: (v: View) => void }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Rice Paper Texture Overlay */}
      <div className="fixed inset-0 rice-paper-overlay z-10 pointer-events-none" />
      
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 max-w-4xl mx-auto">
          <button className="text-primary active:scale-95 transition-transform">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-headline italic tracking-wide text-primary font-bold">
            Celestial Divination
          </h1>
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-primary cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/30 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/scholar/100/100" 
                alt="User Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 pt-20 pb-28 min-h-screen max-w-4xl mx-auto px-6">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/15 shadow-lg rounded-t-xl">
        <div className="flex justify-around items-center px-4 py-3">
          <button 
            onClick={() => setView("divination")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "divination" || currentView === "result" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">Divination</span>
          </button>
          <button 
            onClick={() => setView("history")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "history" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">History</span>
          </button>
          <button 
            onClick={() => setView("profile")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "profile" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

const DivinationScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    if (isShaking) return;
    setIsShaking(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isShaking) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsShaking(false);
              onComplete();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isShaking, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ink-wash-gradient" />
      </div>

      {/* Central Fortune Tube */}
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        {/* Golden Line Art Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg className="text-secondary scale-125" viewBox="0 0 400 400" width="400" height="400">
            <path d="M200 20V380M20 200H380M80 80L320 320M320 80L80 320" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* The Tube */}
        <motion.div 
          animate={isShaking ? {
            rotate: [0, -5, 5, -5, 5, 0],
            x: [0, -2, 2, -2, 2, 0],
            y: [0, -1, 1, -1, 1, 0]
          } : {}}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="relative z-30 cursor-pointer"
          onClick={handleStart}
        >
          <div className="relative w-48 h-72">
            {/* Rising Stick */}
            <motion.div 
              animate={isShaking ? { y: [-10, -40, -10] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-48 bg-[#d4b483] rounded-sm border border-secondary/30 shadow-sm z-10"
            >
              <div className="h-8 w-full bg-primary/80 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold writing-vertical">吉</span>
              </div>
            </motion.div>

            {/* Tube Body */}
            <div className="relative w-full h-full bg-primary-container rounded-lg shadow-2xl overflow-hidden border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black/20" />
              <div className="absolute top-0 w-full h-4 bg-secondary/80" />
              <div className="absolute bottom-0 w-full h-8 bg-secondary/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="writing-vertical text-[#FFD700] font-calligraphy text-5xl tracking-[0.5rem] drop-shadow-lg">
                  乾坤
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress & Text */}
      <div className="mt-12 w-full max-w-sm flex flex-col items-center gap-6 z-40">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-secondary font-bold text-sm uppercase tracking-[0.2rem]">
            {isShaking ? "诚心摇签中..." : "点击签筒开始"}
          </p>
          <h2 className="text-on-surface font-headline italic text-2xl">
            {isShaking ? "Communicating with the Heavens..." : "Seek Your Destiny"}
          </h2>
        </div>

        {isShaking && (
          <div className="w-full h-[2px] bg-outline-variant/20 relative overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(152,0,10,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-on-surface/60 font-body text-lg italic leading-relaxed">
            “诚心所致，金石为开”
          </p>
          <p className="text-on-surface/40 text-xs mt-2 uppercase tracking-widest">
            The heart's sincerity moves the gods.
          </p>
        </div>
      </div>
    </div>
  );
};

const FortuneResultScreen = ({ fortune, onBack, onSave }: { fortune: Fortune, onBack: () => void, onSave: () => void }) => {
  return (
    <motion.article 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden relative mb-8"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      
      <div className="p-8 space-y-10">
        <header className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-primary font-bold tracking-[0.2em] uppercase text-sm">Celestial Scroll</p>
            <h2 className="text-4xl font-black text-on-surface tracking-widest font-calligraphy">{fortune.signNumber}</h2>
          </div>
          
          <div className="inline-flex items-center gap-3 px-6 py-1.5 rounded-full bg-secondary-fixed-dim/20 text-secondary border border-secondary-fixed-dim/30">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold tracking-widest text-lg">{fortune.luck === "Supreme" ? "上上签" : fortune.luck === "Neutral" ? "中平签" : "吉签"}</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </header>

        <section className="text-center space-y-2">
          <div className="w-12 h-px bg-outline-variant mx-auto mb-4 opacity-50" />
          <h3 className="text-3xl font-bold text-primary tracking-widest font-calligraphy">{fortune.title}</h3>
          <p className="text-on-surface-variant text-sm italic">【 典故 】</p>
        </section>

        <section className="flex justify-center py-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <BookOpen className="w-64 h-64" />
          </div>
          <div className="flex gap-10 md:gap-16">
            <div className="writing-vertical text-3xl md:text-4xl tracking-[0.4em] leading-loose text-on-surface border-r border-outline-variant/20 pr-10 font-calligraphy">
              {fortune.poem[0]}
            </div>
            <div className="writing-vertical text-3xl md:text-4xl tracking-[0.4em] leading-loose text-on-surface font-calligraphy">
              {fortune.poem[1]}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">核心启示 • Core Insight</p>
          <p className="text-2xl font-black text-primary tracking-widest font-calligraphy">{fortune.insight}</p>
        </section>

        <section className="space-y-4">
          <details className="group bg-surface rounded-xl border border-outline-variant/20 overflow-hidden" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 text-primary">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold">详细解签 Interpretation</span>
              </div>
              <ChevronDown className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="p-5 pt-0 text-on-surface-variant leading-relaxed space-y-4">
              <p>{fortune.interpretation}</p>
              <p className="text-primary italic">{fortune.advice}</p>
            </div>
          </details>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-sm">事业</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.career}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Heart className="w-4 h-4" />
                <span className="font-bold text-sm">姻缘</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.romance}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm">健康</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.health}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Wallet className="w-4 h-4" />
                <span className="font-bold text-sm">财运</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.wealth}</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 pt-6">
          <button 
            onClick={onSave}
            className="w-full py-4 bg-primary text-surface rounded-xl font-bold tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <Bookmark className="w-5 h-5" />
            收藏此签 Save to Collection
          </button>
          <button className="w-full py-4 border-2 border-primary text-primary rounded-xl font-bold tracking-widest hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Share2 className="w-5 h-5" />
            分享签文 Share Fortune
          </button>
        </section>
      </div>
    </motion.article>
  );
};

const HistoryScreen = ({ fortunes, onSelect }: { fortunes: Fortune[], onSelect: (f: Fortune) => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
        <h3 className="font-headline text-xl italic text-on-surface-variant">Past Fortunes</h3>
        <span className="text-[10px] uppercase tracking-widest text-outline">Scroll of History</span>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        {fortunes.length > 0 ? (
          <ul className="divide-y divide-outline-variant/10">
            {fortunes.map((fortune) => (
              <li 
                key={fortune.id}
                onClick={() => onSelect(fortune)}
                className="group relative px-6 py-5 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-outline uppercase tracking-wider">{fortune.date}</span>
                    <h4 className="font-headline text-lg text-primary font-bold">{fortune.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-on-surface/70">{fortune.signNumber}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className={cn(
                      "px-3 py-1 border rounded font-bold text-xs mb-1",
                      fortune.luck === "Supreme" ? "bg-secondary/10 border-secondary/20 text-secondary" : "bg-surface-container-highest/50 border-outline-variant/30 text-on-surface-variant"
                    )}>
                      {fortune.luck === "Supreme" ? "上上" : fortune.luck === "Neutral" ? "中平" : "吉"} ({fortune.luck})
                    </div>
                    <ChevronRight className="w-5 h-5 text-outline opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center text-outline italic">
            No fortunes saved yet. Seek your destiny to begin.
          </div>
        )}
      </div>

      <button className="w-full py-4 border border-dashed border-outline/30 rounded-lg text-outline text-xs tracking-widest uppercase hover:bg-surface-container transition-colors">
        Unroll Full Archive
      </button>
    </div>
  );
};

const ProfileScreen = () => {
  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative w-24 h-24 md:w-32 md:h-32 p-1 bg-gradient-to-tr from-secondary to-primary rounded-full shadow-xl">
          <div className="w-full h-full rounded-full bg-surface overflow-hidden">
            <img 
              src="https://picsum.photos/seed/master/200/200" 
              alt="Master Lin Wei" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">Master Lin Wei</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Seeker of Eternal Wisdom</p>
        </div>
      </section>

      <section className="space-y-8 pt-6">
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
          <h3 className="font-headline text-xl italic text-on-surface-variant">System Settings</h3>
          <span className="text-[10px] uppercase tracking-widest text-outline">Configuration</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">Language Preference</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Traditional / Simplified</p>
            </div>
            <div className="flex bg-surface-container-high rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-surface-container-lowest shadow-sm text-primary">繁體</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-bold text-outline">简体</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">Daily Morning Oracle</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Receive guidance at dawn</p>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">Export Wisdom</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Format for historical archive</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-on-surface-variant cursor-pointer">
              Silk PDF <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8 flex justify-center">
        <button className="flex items-center gap-3 px-8 py-3 bg-primary text-surface rounded-lg shadow-lg active:scale-95 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="text-sm uppercase tracking-widest font-bold">Conclude Session</span>
        </button>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>("divination");
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(null);
  const [savedFortunes, setSavedFortunes] = useState<Fortune[]>([]); // Start with an empty collection

  const handleDivinationComplete = () => {
    // 1. Draw a random number between 1 and 100 (Equal probability)
    const drawnNumber = Math.floor(Math.random() * 100) + 1;
    
    // 2. Look up the sign in the library
    const signData = SIGN_LIBRARY[drawnNumber];
    
    // 3. Create the fortune object
    const newFortune: Fortune = { 
      ...signData, 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) 
    };
    
    setSelectedFortune(newFortune);
    setView("result");
  };

  const handleSaveFortune = (fortune: Fortune) => {
    if (!savedFortunes.find(f => f.id === fortune.id)) {
      setSavedFortunes(prev => [fortune, ...prev]);
      alert("签文已收藏至您的卷轴中。");
    } else {
      alert("此签已在您的收藏中。");
    }
  };

  const handleHistorySelect = (f: Fortune) => {
    setSelectedFortune(f);
    setView("result");
  };

  return (
    <Layout currentView={view} setView={setView}>
      <AnimatePresence mode="wait">
        {view === "divination" && (
          <motion.div
            key="divination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DivinationScreen onComplete={handleDivinationComplete} />
          </motion.div>
        )}

        {view === "result" && selectedFortune && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FortuneResultScreen 
              fortune={selectedFortune} 
              onBack={() => setView("divination")} 
              onSave={() => handleSaveFortune(selectedFortune)}
            />
          </motion.div>
        )}

        {view === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HistoryScreen 
              fortunes={savedFortunes}
              onSelect={handleHistorySelect} 
            />
          </motion.div>
        )}

        {view === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProfileScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
