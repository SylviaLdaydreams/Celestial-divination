import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  History as HistoryIcon, 
  User, 
  Star, 
  ChevronRight, 
  Bookmark, 
  Share2, 
  LogOut, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Wallet,
  Menu,
  Languages,
  ChevronDown
} from "lucide-react";
import { cn } from "./lib/utils";

// --- Types ---

type LuckLevel = "Supreme" | "Very Lucky" | "Lucky" | "Neutral" | "Unlucky";
type Language = "zh-CN" | "zh-TW" | "en";

interface Fortune {
  id: string;
  signNumber: string;
  luck: LuckLevel;
  title: string;
  poem: string[];
  insight: string;
  interpretation: string;
  advice: string;
  date: string;
  categories: {
    career: string;
    romance: string;
    health: string;
    wealth: string;
  };
}

type View = "divination" | "result" | "history" | "profile";

// --- Data ---

const getLuckContent = (luck: LuckLevel, lang: Language = "zh-CN") => {
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";

  const content = {
    "Supreme": {
      zhCN: {
        insight: "万事胜意，大吉大利",
        interpretation: "此卦阴阳交泰之象，凡事大吉利也。",
        advice: "时机成熟，果断出击，必有重酬。",
        categories: {
          career: "官运亨通，步步高升。",
          romance: "天作之合，百年好合。",
          health: "身体康健，百病不侵。",
          wealth: "财源广进，富贵双全。"
        }
      },
      zhTW: {
        insight: "萬事勝意，大吉大利",
        interpretation: "此卦陰陽交泰之象，凡事大吉利也。",
        advice: "時機成熟，果斷出擊，必有重酬。",
        categories: {
          career: "官運亨通，步步高升。",
          romance: "天作之合，百年好合。",
          health: "身體康健，百病不侵。",
          wealth: "財源廣進，富貴雙全。"
        }
      },
      en: {
        insight: "Everything goes well, great fortune",
        interpretation: "This sign represents the harmony of Yin and Yang, indicating great luck in all matters.",
        advice: "The time is ripe. Act decisively and you will be richly rewarded.",
        categories: {
          career: "Prosperous career path, steady promotion.",
          romance: "A match made in heaven, lasting harmony.",
          health: "Robust health, free from all ailments.",
          wealth: "Wealth flowing from all directions, prosperity and honor."
        }
      }
    },
    "Very Lucky": {
      zhCN: {
        insight: "顺风顺水，前程似锦",
        interpretation: "此卦顺水行舟之象，凡事和合大吉也。",
        advice: "顺势而为，把握良机，必有所获。",
        categories: {
          career: "事业有成，晋升在即。",
          romance: "感情甜蜜，良缘夙缔。",
          health: "平安无事，精力充沛。",
          wealth: "求财有道，小有积蓄。"
        }
      },
      zhTW: {
        insight: "順風順水，前程似錦",
        interpretation: "此卦順水行舟之象，凡事和合大吉也。",
        advice: "順勢而為，把握良機，必有所獲。",
        categories: {
          career: "事業有成，晉升在即。",
          romance: "感情甜蜜，良緣夙締。",
          health: "平安無事，精力充沛。",
          wealth: "求財有道，小有積蓄。"
        }
      },
      en: {
        insight: "Smooth sailing, bright future",
        interpretation: "This sign symbolizes sailing with the wind, bringing harmony and great luck.",
        advice: "Follow the trend and seize the opportunity; you will surely gain something.",
        categories: {
          career: "Successful career, promotion is imminent.",
          romance: "Sweet relationship, a predestined good match.",
          health: "Safe and sound, full of energy.",
          wealth: "Righteous ways to wealth, small savings accumulated."
        }
      }
    },
    "Lucky": {
      zhCN: {
        insight: "渐入佳境，稳步前行",
        interpretation: "此卦平稳向上之象，凡事努力则吉也。",
        advice: "持之以恒，莫要急躁，成功在望。",
        categories: {
          career: "稳步上升，需多努力。",
          romance: "平稳发展，互相理解。",
          health: "注意休息，保持锻炼。",
          wealth: "财运尚可，细水长流。"
        }
      },
      zhTW: {
        insight: "漸入佳境，穩步前行",
        interpretation: "此卦平穩向上之象，凡事努力則吉也。",
        advice: "持之以恒，莫要急躁，成功在望。",
        categories: {
          career: "穩步上升，需多努力。",
          romance: "平穩發展，互相理解。",
          health: "注意休息，保持鍛煉。",
          wealth: "財運尚可，細水長流。"
        }
      },
      en: {
        insight: "Getting better, steady progress",
        interpretation: "This sign shows a steady upward trend; effort will bring good luck.",
        advice: "Persevere and do not be impatient; success is in sight.",
        categories: {
          career: "Steady rise, requires more effort.",
          romance: "Stable development, mutual understanding.",
          health: "Pay attention to rest, keep exercising.",
          wealth: "Fair financial luck, steady stream of income."
        }
      }
    },
    "Neutral": {
      zhCN: {
        insight: "守旧待时，顺其自然",
        interpretation: "此卦采药归来之象，凡事平常大吉也。",
        advice: "凡事不可强求，顺应天命，自有归处。",
        categories: {
          career: "平稳发展，不宜急进。",
          romance: "随缘而遇，不可强求。",
          health: "注意饮食，多加锻炼。",
          wealth: "财运平平，知足常乐。"
        }
      },
      zhTW: {
        insight: "守舊待時，順其自然",
        interpretation: "此卦採藥歸來之象，凡事平常大吉也。",
        advice: "凡事不可強求，順應天命，自有歸處。",
        categories: {
          career: "平穩發展，不宜急進。",
          romance: "隨緣而遇，不可強求。",
          health: "注意飲食，多加鍛煉。",
          wealth: "財運平平，知足常樂。"
        }
      },
      en: {
        insight: "Wait for the right time, let nature take its course",
        interpretation: "This sign is like returning from gathering herbs; everything is normal and safe.",
        advice: "Do not force things; follow destiny, and you will find your place.",
        categories: {
          career: "Stable development, avoid rushing.",
          romance: "Meet by chance, do not force it.",
          health: "Watch your diet, exercise more.",
          wealth: "Average financial luck, contentment brings happiness."
        }
      }
    },
    "Unlucky": {
      zhCN: {
        insight: "时运不济，诸事不宜",
        interpretation: "此卦如履薄冰之象，凡事多凶少吉也。",
        advice: "目前运势极差，切莫轻举妄动，宜闭门谢客，修身养性。",
        categories: {
          career: "事业受阻，小人作祟，难有进展。",
          romance: "多生口舌，缘分浅薄，恐有分离。",
          health: "身体欠安，病痛缠身，需速就医。",
          wealth: "财星不显，求财无门，谨防破财。"
        }
      },
      zhTW: {
        insight: "時運不濟，諸事不宜",
        interpretation: "此卦如履薄冰之象，凡事多凶少吉也。",
        advice: "目前運勢極差，切莫輕舉妄動，宜閉門謝客，修身養性。",
        categories: {
          career: "事業受阻，小人作祟，難有進展。",
          romance: "多生口舌，緣分淺薄，恐有分離。",
          health: "身體欠安，病痛纏身，需速就醫。",
          wealth: "財星不顯，求財無門，謹防破財。"
        }
      },
      en: {
        insight: "Bad timing, nothing is suitable",
        interpretation: "This sign is like walking on thin ice; more misfortune than luck.",
        advice: "Current luck is very poor. Do not act rashly; stay calm and focus on self-cultivation.",
        categories: {
          career: "Career blocked, hindered by petty people, hard to progress.",
          romance: "Frequent arguments, shallow fate, risk of separation.",
          health: "Poor health, plagued by illness, seek medical help quickly.",
          wealth: "No wealth in sight, no way to earn, beware of financial loss."
        }
      }
    }
  };

  const selectedLuck = content[luck] || content["Neutral"];
  if (isEN) return selectedLuck.en;
  if (isTW) return selectedLuck.zhTW;
  return selectedLuck.zhCN;
};

const SIGN_LIBRARY: Record<number, Omit<Fortune, "id" | "date">> = {
  1: {
    signNumber: "第一签",
    luck: "Supreme",
    title: "钟离成道",
    poem: ["天开地辟结良缘", "日吉时良万事全", "若得此签非小可", "投机得中自安然"],
    ...getLuckContent("Supreme")
  },
  2: {
    signNumber: "第二签",
    luck: "Unlucky",
    title: "苏秦不第",
    poem: ["欲去长江水不通", "顺风吹起浪涛洪", "舟行到此难前进", "且在江边守旧踪"],
    insight: "怀才不遇，困顿之时",
    interpretation: "此卦苏秦不第之象，凡事多凶少吉也。",
    advice: "时运未到，宜韬光养晦，切莫强求，以免招灾。",
    categories: {
      career: "怀才不遇，阻碍重重，难有升迁。",
      romance: "缘分未到，多生口舌，感情冷淡。",
      health: "忧思过重，注意心疾，恐有大碍。",
      wealth: "财运极差，入不敷出，负债累累。"
    }
  },
  3: {
    signNumber: "第三签",
    luck: "Supreme",
    title: "董永遇仙",
    poem: ["鸾凤呈祥瑞气新", "天教好事近红尘", "若能守旧无他意", "自有高人来指引"],
    ...getLuckContent("Supreme")
  },
  4: {
    signNumber: "第四签",
    luck: "Supreme",
    title: "长乐老",
    poem: ["千年古镜复重圆", "女貌郎才两周全", "官禄荣华皆显达", "婚姻和合自团圆"],
    ...getLuckContent("Supreme")
  },
  5: {
    signNumber: "第五签",
    luck: "Neutral",
    title: "刘晨遇仙",
    poem: ["一山如画对清溪", "采药归来路不迷", "若问前程何处好", "且看云外月高低"],
    ...getLuckContent("Neutral")
  },
  6: {
    signNumber: "第六签",
    luck: "Unlucky",
    title: "仁贵回家",
    poem: ["投身岩下铜墙铁", "纵有神仙也难说", "此去前程多阻滞", "闭门守旧免灾磨"],
    ...getLuckContent("Unlucky")
  },
  7: {
    signNumber: "第七签",
    luck: "Very Lucky",
    title: "廉颇负荆",
    poem: ["奔波劳碌为何求", "且向深山去隐居", "若得此签非小可", "投机得中自安然"],
    ...getLuckContent("Very Lucky")
  },
  8: {
    signNumber: "第八签",
    luck: "Supreme",
    title: "裴度还带",
    poem: ["茂林修竹好清风", "一箭中鹄万事通", "若得此签非小可", "投机得中自安然"],
    ...getLuckContent("Supreme")
  },
  9: {
    signNumber: "第九签",
    luck: "Supreme",
    title: "赵韩王半部论语",
    poem: ["鸾凤呈祥瑞气新", "天教好事近红尘", "若能守旧无他意", "自有高人来指引"],
    ...getLuckContent("Supreme")
  },
  10: {
    signNumber: "第十签",
    luck: "Unlucky",
    title: "庞涓观阵",
    poem: ["椟藏金玉待时机", "未遇高人且自随", "谁知一入迷魂阵", "性命堪忧悔已迟"],
    insight: "误入歧途，危机四伏",
    interpretation: "此卦庞涓观阵之象，凡事多凶少吉也。",
    advice: "贪功冒进，必遭大难。宜速退守，方可保全。",
    categories: {
      career: "深陷泥潭，进退两难，恐有官非。",
      romance: "遇人不淑，多受欺瞒，感情破裂。",
      health: "意外之灾，血光之险，需多留神。",
      wealth: "财运全无，投资被套，血本无归。"
    }
  },
};

const toChineseNum = (n: number): string => {
  const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (n === 100) return '一百';
  if (n < 10) return chars[n];
  if (n < 20) return '十' + (n % 10 === 0 ? '' : chars[n % 10]);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return chars[tens] + '十' + (ones === 0 ? '' : chars[ones]);
};

// Placeholder generation for missing signs
for (let i = 11; i <= 100; i++) {
  if (!SIGN_LIBRARY[i]) {
    const baseSign = SIGN_LIBRARY[(i % 10) + 1] || SIGN_LIBRARY[1];
    const lucks: LuckLevel[] = ["Supreme", "Very Lucky", "Lucky", "Neutral", "Unlucky"];
    const luck = lucks[Math.floor(Math.random() * lucks.length)];
    SIGN_LIBRARY[i] = {
      ...baseSign,
      signNumber: `第${toChineseNum(i)}签`,
      luck: luck,
      title: `观音灵签 第${toChineseNum(i)}签`,
      ...getLuckContent(luck)
    };
  }
}

// --- Components ---

const Layout = ({ children, currentView, setView, lang, setLang }: { children: React.ReactNode, currentView: View, setView: (v: View) => void, lang: Language, setLang: (l: Language) => void }) => {
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";
  
  const getTitle = () => {
    if (isEN) return "Guanyin Oracle";
    if (isTW) return "觀音靈簽";
    return "观音灵签";
  };

  const getNavLabel = (view: View) => {
    if (view === "divination") return isEN ? "Oracle" : (isTW ? "求簽" : "求签");
    if (view === "history") return isEN ? "History" : (isTW ? "歷史" : "历史");
    if (view === "profile") return isEN ? "Profile" : (isTW ? "我的" : "我的");
    return "";
  };

  const cycleLang = () => {
    if (lang === "zh-CN") setLang("zh-TW");
    else if (lang === "zh-TW") setLang("en");
    else setLang("zh-CN");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 rice-paper-overlay z-10 pointer-events-none" />
      
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 max-w-4xl mx-auto">
          <button className="text-primary active:scale-95 transition-transform">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-headline italic tracking-wide text-primary font-bold">
            {getTitle()}
          </h1>
          <div className="flex items-center gap-3">
            <Languages 
              className="w-5 h-5 text-primary cursor-pointer active:scale-90 transition-transform" 
              onClick={cycleLang}
            />
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

      <main className="relative z-20 pt-20 pb-28 min-h-screen max-w-4xl mx-auto px-6">
        {children}
      </main>

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
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">{getNavLabel("divination")}</span>
          </button>
          <button 
            onClick={() => setView("history")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "history" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">{getNavLabel("history")}</span>
          </button>
          <button 
            onClick={() => setView("profile")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "profile" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">{getNavLabel("profile")}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

const DivinationScreen = ({ onComplete, lang }: { onComplete: () => void, lang: Language }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";

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

  const getStatusText = () => {
    if (isEN) return isShaking ? "Communicating with Heavens..." : "Tap to Start";
    if (isTW) return isShaking ? "誠心搖簽中..." : "點擊簽筒開始";
    return isShaking ? "诚心摇签中..." : "点击签筒开始";
  };

  const getSubText = () => {
    if (isEN) return isShaking ? "Seeking divine guidance..." : "Seek Your Destiny";
    if (isTW) return isShaking ? "正在與上蒼溝通..." : "尋求你的命運";
    return isShaking ? "正在与上苍沟通..." : "寻求你的命运";
  };

  const getQuote = () => {
    if (isEN) return "“Sincerity moves the heavens.”";
    if (isTW) return "“誠心所致，金石為開”";
    return "“诚心所致，金石为开”";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ink-wash-gradient" />
      </div>

      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg className="text-secondary scale-125" viewBox="0 0 400 400" width="400" height="400">
            <path d="M200 20V380M20 200H380M80 80L320 320M320 80L80 320" stroke="currentColor" strokeDasharray="4 4" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

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
            <motion.div 
              animate={isShaking ? { y: [-10, -40, -10] } : { y: 0 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-48 bg-[#d4b483] rounded-sm border border-secondary/30 shadow-sm z-10"
            >
              <div className="h-8 w-full bg-primary/80 flex items-center justify-center">
                <span className="text-[8px] text-white font-bold writing-vertical">吉</span>
              </div>
            </motion.div>

            <div className="relative w-full h-full bg-primary-container rounded-lg shadow-2xl overflow-hidden border-2 border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-black/20" />
              <div className="absolute top-0 w-full h-4 bg-secondary/80" />
              <div className="absolute bottom-0 w-full h-8 bg-secondary/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="writing-vertical text-[#FFD700] font-calligraphy text-5xl tracking-[0.5rem] drop-shadow-lg">
                  {isEN ? "Oracle" : (isTW ? "觀音" : "观音")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 w-full max-w-sm flex flex-col items-center gap-6 z-40">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-secondary font-bold text-sm uppercase tracking-[0.2rem]">
            {getStatusText()}
          </p>
          <h2 className="text-on-surface font-headline italic text-2xl">
            {getSubText()}
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
            {getQuote()}
          </p>
          <p className="text-on-surface/40 text-xs mt-2 uppercase tracking-widest">
            The heart's sincerity moves the gods.
          </p>
        </div>
      </div>
    </div>
  );
};

const FortuneResultScreen = ({ fortune, onBack, onSave, lang }: { fortune: Fortune, onBack: () => void, onSave: () => void, lang: Language }) => {
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";

  const getLuckLabel = () => {
    if (fortune.luck === "Supreme") return isEN ? "Supreme Luck" : (isTW ? "上上簽" : "上上签");
    if (fortune.luck === "Very Lucky") return isEN ? "Great Luck" : (isTW ? "大吉簽" : "大吉签");
    if (fortune.luck === "Lucky") return isEN ? "Minor Luck" : (isTW ? "小吉簽" : "小吉签");
    if (fortune.luck === "Neutral") return isEN ? "Neutral" : (isTW ? "中平簽" : "中平签");
    return isEN ? "Unlucky" : (isTW ? "下下簽" : "下下签");
  };

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
            <p className="text-primary font-bold tracking-[0.2em] uppercase text-sm">{isEN ? "Divine Scroll" : (isTW ? "天書靈卷" : "天书灵卷")}</p>
            <h2 className="text-4xl font-black text-on-surface tracking-widest font-calligraphy">{fortune.signNumber}</h2>
          </div>
          
          <div className="inline-flex items-center gap-3 px-6 py-1.5 rounded-full bg-secondary-fixed-dim/20 text-secondary border border-secondary-fixed-dim/30">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold tracking-widest text-lg">
              {getLuckLabel()}
            </span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </header>

        <section className="text-center space-y-2">
          <div className="w-12 h-px bg-outline-variant mx-auto mb-4 opacity-50" />
          <h3 className="text-3xl font-bold text-primary tracking-widest font-calligraphy">{fortune.title}</h3>
          <p className="text-on-surface-variant text-sm italic">【 {isEN ? "Story" : (isTW ? "典故" : "典故")} 】</p>
        </section>

        <section className="flex justify-center py-12 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <BookOpen className="w-64 h-64" />
          </div>
          <div className="flex flex-row-reverse gap-10 md:gap-16 items-center">
            {fortune.poem.map((line, idx) => (
              <div key={idx} className="writing-vertical text-2xl md:text-3xl tracking-[0.4em] leading-loose text-on-surface font-calligraphy">
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 text-center">
          <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{isEN ? "Core Insight" : (isTW ? "核心啟示" : "核心启示")}</p>
          <p className="text-2xl font-black text-primary tracking-widest font-calligraphy">{fortune.insight}</p>
        </section>

        <section className="space-y-4">
          <details className="group bg-surface rounded-xl border border-outline-variant/20 overflow-hidden" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-3 text-primary">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold">{isEN ? "Interpretation" : (isTW ? "詳細解簽" : "详细解签")}</span>
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
                <span className="font-bold text-sm">{isEN ? "Career" : (isTW ? "事業" : "事业")}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.career}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Heart className="w-4 h-4" />
                <span className="font-bold text-sm">{isEN ? "Romance" : (isTW ? "姻緣" : "姻缘")}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.romance}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm">{isEN ? "Health" : (isTW ? "健康" : "健康")}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.health}</p>
            </div>
            <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/10">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Wallet className="w-4 h-4" />
                <span className="font-bold text-sm">{isEN ? "Wealth" : (isTW ? "財富" : "财富")}</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">{fortune.categories.wealth}</p>
            </div>
          </div>
        </section>

        <footer className="pt-6 flex gap-4">
          <button 
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border border-outline-variant text-on-surface font-bold tracking-widest active:scale-95 transition-all"
          >
            {isEN ? "Back" : (isTW ? "返回" : "返回")}
          </button>
          <button 
            onClick={onSave}
            className="flex-1 py-4 rounded-xl bg-primary text-surface font-bold tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Bookmark className="w-5 h-5" />
            {isEN ? "Save" : (isTW ? "收藏簽文" : "收藏签文")}
          </button>
        </footer>
      </div>
    </motion.article>
  );
};

const HistoryScreen = ({ fortunes, onSelect, lang }: { fortunes: Fortune[], onSelect: (f: Fortune) => void, lang: Language }) => {
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";

  const getLuckTag = (luck: LuckLevel) => {
    if (luck === "Supreme") return isEN ? "Supreme" : (isTW ? "上上" : "上上");
    if (luck === "Very Lucky") return isEN ? "Great" : (isTW ? "大吉" : "大吉");
    if (luck === "Lucky") return isEN ? "Minor" : (isTW ? "小吉" : "小吉");
    if (luck === "Neutral") return isEN ? "Neutral" : (isTW ? "中平" : "中平");
    return isEN ? "Unlucky" : (isTW ? "下下" : "下下");
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h2 className="font-headline text-3xl italic text-on-surface">{isEN ? "Past Oracles" : (isTW ? "往昔靈跡" : "往昔灵迹")}</h2>
        <span className="text-xs uppercase tracking-widest text-outline">Historical Archive</span>
      </header>

      {fortunes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-outline/40 space-y-4">
          <HistoryIcon className="w-16 h-16 stroke-[1]" />
          <p className="font-headline italic text-xl">{isEN ? "No records yet" : (isTW ? "尚無收藏記錄" : "尚无收藏记录")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {fortunes.map((f) => (
            <motion.div 
              key={f.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(f)}
              className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-on-surface font-calligraphy">{f.signNumber}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                    f.luck === "Supreme" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                  )}>
                    {getLuckTag(f.luck)}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant font-bold">{f.title}</p>
                <p className="text-[10px] text-outline uppercase tracking-widest">{f.date}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      <button className="w-full py-4 border border-dashed border-outline/30 rounded-lg text-outline text-xs tracking-widest uppercase hover:bg-surface-container transition-colors">
        {isEN ? "Expand Archive" : (isTW ? "展開完整檔案" : "展开完整档案")}
      </button>
    </div>
  );
};

const ProfileScreen = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const isTW = lang === "zh-TW";
  const isEN = lang === "en";

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
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">{isEN ? "Master Lin" : (isTW ? "林大師" : "林大师")}</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Seeker of Eternal Wisdom</p>
        </div>
      </section>

      <section className="space-y-8 pt-6">
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
          <h3 className="font-headline text-xl italic text-on-surface-variant">{isEN ? "Settings" : (isTW ? "系統設置" : "系统设置")}</h3>
          <span className="text-[10px] uppercase tracking-widest text-outline">Configuration</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">{isEN ? "Language" : (isTW ? "語言偏好" : "语言偏好")}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Interface Language</p>
            </div>
            <div className="flex bg-surface-container-high rounded-lg p-1">
              <button 
                onClick={() => setLang("zh-TW")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                  lang === "zh-TW" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-outline"
                )}
              >
                繁體
              </button>
              <button 
                onClick={() => setLang("zh-CN")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                  lang === "zh-CN" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-outline"
                )}
              >
                简体
              </button>
              <button 
                onClick={() => setLang("en")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                  lang === "en" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-outline"
                )}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">{isEN ? "Daily Oracle" : (isTW ? "每日早課" : "每日早课")}</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Receive guidance at dawn</p>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">{isEN ? "Export Wisdom" : (isTW ? "導出智慧" : "导出智慧")}</p>
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
          <span className="text-sm uppercase tracking-widest font-bold">{isEN ? "End Session" : (isTW ? "結束會話" : "结束会话")}</span>
        </button>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>("divination");
  const [lang, setLang] = useState<Language>("zh-CN");
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(null);
  const [savedFortunes, setSavedFortunes] = useState<Fortune[]>([]);

  const handleDivinationComplete = () => {
    const drawnNumber = Math.floor(Math.random() * 100) + 1;
    const signData = SIGN_LIBRARY[drawnNumber];
    
    // Re-generate content based on current language
    const luckContent = getLuckContent(signData.luck, lang);
    
    const date = new Date();
    let displayDate = "";
    
    if (lang === "en") {
      displayDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } else {
      const yearStr = date.getFullYear().toString().split('').map(d => toChineseNum(parseInt(d))).join('');
      const monthStr = toChineseNum(date.getMonth() + 1);
      const dayStr = toChineseNum(date.getDate());
      displayDate = `${yearStr}年${monthStr}月${dayStr}日`;
    }
    
    const signNumber = lang === "en" ? `Sign ${drawnNumber}` : signData.signNumber;
    const title = lang === "en" ? `Oracle Sign ${drawnNumber}` : signData.title;

    const newFortune: Fortune = { 
      ...signData,
      ...luckContent,
      signNumber,
      title,
      id: Date.now().toString(), 
      date: displayDate
    };
    
    setSelectedFortune(newFortune);
    setView("result");
  };

  const handleSaveFortune = (fortune: Fortune) => {
    if (!savedFortunes.find(f => f.id === fortune.id)) {
      setSavedFortunes(prev => [fortune, ...prev]);
      const msg = lang === "en" ? "Oracle saved to your archive." : (lang === "zh-TW" ? "簽文已收藏。您可以在“歷史”頁面查看。" : "签文已收藏。您可以在“历史”页面查看。");
      alert(msg);
    } else {
      const msg = lang === "en" ? "This oracle is already in your archive." : (lang === "zh-TW" ? "此簽已在您的收藏中。" : "此签已在您的收藏中。");
      alert(msg);
    }
  };

  const handleHistorySelect = (f: Fortune) => {
    setSelectedFortune(f);
    setView("result");
  };

  return (
    <Layout currentView={view} setView={setView} lang={lang} setLang={setLang}>
      <AnimatePresence mode="wait">
        {view === "divination" && (
          <motion.div
            key="divination"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DivinationScreen onComplete={handleDivinationComplete} lang={lang} />
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
              lang={lang}
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
              lang={lang}
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
            <ProfileScreen lang={lang} setLang={setLang} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
