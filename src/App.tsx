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

const SIGN_LIBRARY: Record<number, Omit<Fortune, "id" | "date">> = {
  1: {
    signNumber: "第一签",
    luck: "Supreme",
    title: "钟离成道",
    poem: ["天开地辟结良缘", "日吉时良万事全", "若得此签非小可", "投机得中自安然"],
    insight: "开天辟地，万事胜意",
    interpretation: "此卦阴阳交泰之象，凡事大吉利也。",
    advice: "时机成熟，果断出击，必有重酬。",
    categories: {
      career: "官运亨通，步步高升。",
      romance: "天作之合，百年好合。",
      health: "身体康健，百病不侵。",
      wealth: "财源广进，富贵双全。"
    }
  },
  2: {
    signNumber: "第二签",
    luck: "Very Lucky",
    title: "苏秦不第",
    poem: ["鲸牙锐利出深潭", "变化飞腾在此间", "顺水行舟无阻滞", "任君所向自安闲"],
    insight: "潜龙出渊，顺风顺水",
    interpretation: "此卦顺水行舟之象，凡事和合大吉也。",
    advice: "虽有小挫，但大势已成，顺势而为即可。",
    categories: {
      career: "初有阻碍，后必成功。",
      romance: "良缘夙缔，终成眷属。",
      health: "平安无事，注意调养。",
      wealth: "求财有道，晚年丰厚。"
    }
  },
  3: {
    signNumber: "第三签",
    luck: "Supreme",
    title: "董永遇仙",
    poem: ["鸾凤呈祥瑞气新", "天教好事近红尘", "若能守旧无他意", "自有高人来指引"],
    insight: "天赐良缘，贵人指路",
    interpretation: "此卦鸾凤呈祥之象，凡事大吉利也。",
    advice: "守正待时，贵人自现，不可急躁。",
    categories: {
      career: "贵人扶持，前程似锦。",
      romance: "天赐良缘，美满幸福。",
      health: "福星高照，早日康复。",
      wealth: "财运亨通，意外之财。"
    }
  },
  4: {
    signNumber: "第四签",
    luck: "Supreme",
    title: "长乐老",
    poem: ["千年古镜复重圆", "女貌郎才两周全", "官禄荣华皆显达", "婚姻和合自团圆"],
    insight: "破镜重圆，官禄荣华",
    interpretation: "此卦破镜重圆之象，凡事成就大吉也。",
    advice: "旧事重提，必有转机，坚持到底。",
    categories: {
      career: "功成名就，名利双收。",
      romance: "破镜重圆，恩爱如初。",
      health: "老当益壮，延年益寿。",
      wealth: "财运极佳，富甲一方。"
    }
  },
  5: {
    signNumber: "第五签",
    luck: "Neutral",
    title: "刘晨遇仙",
    poem: ["一山如画对清溪", "采药归来路不迷", "若问前程何处好", "且看云外月高低"],
    insight: "画中寻路，顺其自然",
    interpretation: "此卦采药归来之象，凡事平常大吉也。",
    advice: "凡事不可强求，顺应天命，自有归处。",
    categories: {
      career: "平稳发展，不宜急进。",
      romance: "随缘而遇，不可强求。",
      health: "注意饮食，多加锻炼。",
      wealth: "财运平平，知足常乐。"
    }
  },
  6: {
    signNumber: "第六签",
    luck: "Neutral",
    title: "仁贵回家",
    poem: ["投身岩下铜墙铁", "纵有神仙也难说", "若问前程何处好", "且看云外月高低"],
    insight: "身陷困境，静待时机",
    interpretation: "此卦铜墙铁壁之象，凡事守旧则吉也。",
    advice: "目前处境艰难，宜守不宜进，等待转机。",
    categories: {
      career: "阻碍重重，宜守旧职。",
      romance: "波折较多，需多沟通。",
      health: "旧疾复发，需细心调养。",
      wealth: "财运不佳，谨防破财。"
    }
  },
  7: {
    signNumber: "第七签",
    luck: "Very Lucky",
    title: "廉颇负荆",
    poem: ["奔波劳碌为何求", "且向深山去隐居", "若得此签非小可", "投机得中自安然"],
    insight: "知错能改，善莫大焉",
    interpretation: "此卦知错能改之象，凡事和合大吉也。",
    advice: "放下身段，诚恳待人，必能化干戈为玉帛。",
    categories: {
      career: "先苦后甜，贵人相助。",
      romance: "重归于好，感情升温。",
      health: "心宽体胖，注意休息。",
      wealth: "求财得利，生意兴隆。"
    }
  },
  8: {
    signNumber: "第八签",
    luck: "Supreme",
    title: "裴度还带",
    poem: ["茂林修竹好清风", "一箭中鹄万事通", "若得此签非小可", "投机得中自安然"],
    insight: "积德行善，必有后福",
    interpretation: "此卦积德行善之象，凡事大吉利也。",
    advice: "多行善事，莫问前程，福报自至。",
    categories: {
      career: "名声大噪，前途无量。",
      romance: "天赐良缘，幸福美满。",
      health: "身体康健，神清气爽。",
      wealth: "财源滚滚，富贵荣华。"
    }
  },
  9: {
    signNumber: "第九签",
    luck: "Supreme",
    title: "赵韩王半部论语",
    poem: ["鸾凤呈祥瑞气新", "天教好事近红尘", "若能守旧无他意", "自有高人来指引"],
    insight: "半部论语，治世安邦",
    interpretation: "此卦鸾凤呈祥之象，凡事大吉利也。",
    advice: "精益求精，必有所成，不可半途而废。",
    categories: {
      career: "学有所成，官运亨通。",
      romance: "志同道合，恩爱有加。",
      health: "精力充沛，身体强健。",
      wealth: "财运亨通，名利双收。"
    }
  },
  10: {
    signNumber: "第十签",
    luck: "Neutral",
    title: "庞涓观阵",
    poem: ["椟藏金玉待时机", "未遇高人且自随", "若得此签非小可", "投机得中自安然"],
    insight: "怀才不遇，静待时机",
    interpretation: "此卦怀才不遇之象，凡事守旧则吉也。",
    advice: "才华虽高，时运未到，宜韬光养晦。",
    categories: {
      career: "怀才不遇，宜多学习。",
      romance: "缘分未到，耐心等待。",
      health: "注意心态，平和处世。",
      wealth: "财运平平，不宜投资。"
    }
  },
  11: {
    signNumber: "第十一签",
    luck: "Supreme",
    title: "刘先主入西川",
    poem: ["欲求胜事可非常", "争奈亲姻日暂忙", "到头竟必成大器", "且看云外月高低"],
    insight: "先苦后甜，必成大器",
    interpretation: "此卦先难后易之象，凡事大吉利也。",
    advice: "虽有波折，但终能成就大业，需有恒心。",
    categories: {
      career: "大器晚成，前程似锦。",
      romance: "好事多磨，终成眷属。",
      health: "转危为安，注意调养。",
      wealth: "财运亨通，晚年丰厚。"
    }
  },
  12: {
    signNumber: "第十二签",
    luck: "Supreme",
    title: "武吉遇师",
    poem: ["否极泰来理自然", "谁知好事在今天", "若得此签非小可", "投机得中自安然"],
    insight: "否极泰来，好事临门",
    interpretation: "此卦否极泰来之象，凡事大吉利也。",
    advice: "困境已过，好运将至，把握当下。",
    categories: {
      career: "步步高升，贵人相助。",
      romance: "天赐良缘，美满幸福。",
      health: "身体康健，早日康复。",
      wealth: "财源广进，富贵双全。"
    }
  },
  13: {
    signNumber: "第十三签",
    luck: "Supreme",
    title: "罗通扫北",
    poem: ["自小生身富贵家", "眼前万事总奢华", "蒙君赐我金腰带", "四海声名遍天下"],
    insight: "少年得志，名扬四海",
    interpretation: "此卦少年得志之象，凡事成就大吉也。",
    advice: "不可骄傲自满，需谦虚谨慎，方能长久。",
    categories: {
      career: "名利双收，前途无量。",
      romance: "门当户对，恩爱有加。",
      health: "精力充沛，身体强健。",
      wealth: "财运极佳，富贵荣华。"
    }
  },
  14: {
    signNumber: "第十四签",
    luck: "Supreme",
    title: "郭嘉遗计定辽东",
    poem: ["宛如仙鹤出樊笼", "脱却凡胎路不同", "若得此签非小可", "投机得中自安然"],
    insight: "脱离困境，前程似锦",
    interpretation: "此卦脱离樊笼之象，凡事大吉利也。",
    advice: "摆脱束缚，大展宏图，必有所成。",
    categories: {
      career: "官运亨通，步步高升。",
      romance: "天作之合，百年好合。",
      health: "身体康健，百病不侵。",
      wealth: "财源广进，富贵双全。"
    }
  },
  15: {
    signNumber: "第十五签",
    luck: "Supreme",
    title: "苏秦得志",
    poem: ["一箭中鹄万事通", "茂林修竹好清风", "若得此签非小可", "投机得中自安然"],
    insight: "一箭中鹄，万事亨通",
    interpretation: "此卦一箭中鹄之象，凡事大吉利也。",
    advice: "目标明确，果断出击，必能成功。",
    categories: {
      career: "功成名就，名利双收。",
      romance: "良缘夙缔，终成眷属。",
      health: "平安无事，注意调养。",
      wealth: "求财有道，晚年丰厚。"
    }
  },
  16: {
    signNumber: "第十六签",
    luck: "Supreme",
    title: "陆逊入石头城",
    poem: ["心如古镜复重圆", "女貌郎才两周全", "官禄荣华皆显达", "婚姻和合自团圆"],
    insight: "破镜重圆，官禄荣华",
    interpretation: "此卦破镜重圆之象，凡事成就大吉也。",
    advice: "旧事重提，必有转机，坚持到底。",
    categories: {
      career: "功成名就，名利双收。",
      romance: "破镜重圆，恩爱如初。",
      health: "老当益壮，延年益寿。",
      wealth: "财运极佳，富甲一方。"
    }
  },
  17: {
    signNumber: "第十七签",
    luck: "Supreme",
    title: "曹操平定中原",
    poem: ["鸾凤呈祥瑞气新", "天教好事近红尘", "若能守旧无他意", "自有高人来指引"],
    insight: "平定中原，大局已定",
    interpretation: "此卦鸾凤呈祥之象，凡事大吉利也。",
    advice: "守正待时，贵人自现，不可急躁。",
    categories: {
      career: "贵人扶持，前程似锦。",
      romance: "天赐良缘，美满幸福。",
      health: "福星高照，早日康复。",
      wealth: "财运亨通，意外之财。"
    }
  },
  18: {
    signNumber: "第十八签",
    luck: "Supreme",
    title: "鬼谷子授徒",
    poem: ["欲求胜事可非常", "争奈亲姻日暂忙", "到头竟必成大器", "且看云外月高低"],
    insight: "名师指点，必成大器",
    interpretation: "此卦先难后易之象，凡事大吉利也。",
    advice: "虚心求教，必有所获，前途无量。",
    categories: {
      career: "学有所成，官运亨通。",
      romance: "志同道合，恩爱有加。",
      health: "精力充沛，身体强健。",
      wealth: "财运亨通，名利双收。"
    }
  },
  19: {
    signNumber: "第十九签",
    luck: "Supreme",
    title: "张良遇黄石公",
    poem: ["一山如画对清溪", "采药归来路不迷", "若问前程何处好", "且看云外月高低"],
    insight: "奇遇贵人，授书传经",
    interpretation: "此卦采药归来之象，凡事平常大吉也。",
    advice: "凡事不可强求，顺应天命，自有归处。",
    categories: {
      career: "平稳发展，不宜急进。",
      romance: "随缘而遇，不可强求。",
      health: "注意饮食，多加锻炼。",
      wealth: "财运平平，知足常乐。"
    }
  },
  20: {
    signNumber: "第二十签",
    luck: "Supreme",
    title: "姜太公遇文王",
    poem: ["椟藏金玉待时机", "未遇高人且自随", "若得此签非小可", "投机得中自安然"],
    insight: "姜太公钓鱼，愿者上钩",
    interpretation: "此卦怀才不遇之象，凡事守旧则吉也。",
    advice: "才华虽高，时运未到，宜韬光养晦。",
    categories: {
      career: "怀才不遇，宜多学习。",
      romance: "缘分未到，耐心等待。",
      health: "注意心态，平和处世。",
      wealth: "财运平平，不宜投资。"
    }
  },
  // ... Fill the rest with placeholders to ensure 100 signs exist
};

// Placeholder generation for missing signs
for (let i = 21; i <= 100; i++) {
  if (!SIGN_LIBRARY[i]) {
    const baseSign = SIGN_LIBRARY[(i % 10) + 1] || SIGN_LIBRARY[1];
    const lucks: LuckLevel[] = ["Supreme", "Very Lucky", "Lucky", "Neutral", "Unlucky"];
    SIGN_LIBRARY[i] = {
      ...baseSign,
      signNumber: `第${i}签`,
      luck: lucks[Math.floor(Math.random() * lucks.length)],
      title: `观音灵签 第${i}签`,
      insight: "天道酬勤，顺其自然",
      interpretation: "此卦顺应天命之象，凡事吉凶参半也。",
      advice: "保持平常心，多行善事，自有好运。",
    };
  }
}

// --- Components ---

const Layout = ({ children, currentView, setView }: { children: React.ReactNode, currentView: View, setView: (v: View) => void }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 rice-paper-overlay z-10 pointer-events-none" />
      
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl border-b border-outline-variant/15 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 max-w-4xl mx-auto">
          <button className="text-primary active:scale-95 transition-transform">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-headline italic tracking-wide text-primary font-bold">
            观音灵签
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
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">求签</span>
          </button>
          <button 
            onClick={() => setView("history")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "history" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <HistoryIcon className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">历史</span>
          </button>
          <button 
            onClick={() => setView("profile")}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90",
              currentView === "profile" ? "bg-primary text-surface rounded-lg shadow-sm" : "text-on-surface/50"
            )}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] uppercase tracking-widest mt-1 font-bold">我的</span>
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
                  观音
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 w-full max-w-sm flex flex-col items-center gap-6 z-40">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-secondary font-bold text-sm uppercase tracking-[0.2rem]">
            {isShaking ? "诚心摇签中..." : "点击签筒开始"}
          </p>
          <h2 className="text-on-surface font-headline italic text-2xl">
            {isShaking ? "正在与上苍沟通..." : "寻求你的命运"}
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
            <p className="text-primary font-bold tracking-[0.2em] uppercase text-sm">天书灵卷</p>
            <h2 className="text-4xl font-black text-on-surface tracking-widest font-calligraphy">{fortune.signNumber}</h2>
          </div>
          
          <div className="inline-flex items-center gap-3 px-6 py-1.5 rounded-full bg-secondary-fixed-dim/20 text-secondary border border-secondary-fixed-dim/30">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold tracking-widest text-lg">
              {fortune.luck === "Supreme" ? "上上签" : 
               fortune.luck === "Very Lucky" ? "大吉签" : 
               fortune.luck === "Neutral" ? "中平签" : "下下签"}
            </span>
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
          <div className="flex flex-row-reverse gap-10 md:gap-16 items-center">
            {fortune.poem.map((line, idx) => (
              <div key={idx} className="writing-vertical text-2xl md:text-3xl tracking-[0.4em] leading-loose text-on-surface font-calligraphy">
                {line}
              </div>
            ))}
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
        <h3 className="font-headline text-xl italic text-on-surface-variant">历史签文</h3>
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
                      fortune.luck === "Supreme" ? "bg-secondary/10 border-secondary/20 text-secondary" : 
                      fortune.luck === "Very Lucky" ? "bg-primary/10 border-primary/20 text-primary" :
                      fortune.luck === "Unlucky" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                      "bg-surface-container-highest/50 border-outline-variant/30 text-on-surface-variant"
                    )}>
                      {fortune.luck === "Supreme" ? "上上" : 
                       fortune.luck === "Very Lucky" ? "大吉" :
                       fortune.luck === "Unlucky" ? "下下" : "中平"}
                    </div>
                    <ChevronRight className="w-5 h-5 text-outline opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center text-outline italic">
            暂无收藏。快去求一签吧。
          </div>
        )}
      </div>

      <button className="w-full py-4 border border-dashed border-outline/30 rounded-lg text-outline text-xs tracking-widest uppercase hover:bg-surface-container transition-colors">
        展开完整档案
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
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">林大师</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Seeker of Eternal Wisdom</p>
        </div>
      </section>

      <section className="space-y-8 pt-6">
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-2">
          <h3 className="font-headline text-xl italic text-on-surface-variant">系统设置</h3>
          <span className="text-[10px] uppercase tracking-widest text-outline">Configuration</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">语言偏好</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Traditional / Simplified</p>
            </div>
            <div className="flex bg-surface-container-high rounded-lg p-1">
              <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-surface-container-lowest shadow-sm text-primary">繁體</button>
              <button className="px-4 py-1.5 rounded-md text-xs font-bold text-outline">简体</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">每日早课</p>
              <p className="text-[10px] text-outline uppercase tracking-wider">Receive guidance at dawn</p>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-on-surface">导出智慧</p>
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
          <span className="text-sm uppercase tracking-widest font-bold">结束会话</span>
        </button>
      </section>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>("divination");
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(null);
  const [savedFortunes, setSavedFortunes] = useState<Fortune[]>([]);

  const handleDivinationComplete = () => {
    const drawnNumber = Math.floor(Math.random() * 100) + 1;
    const signData = SIGN_LIBRARY[drawnNumber];
    
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
      // Simple UI feedback instead of alert if possible, but alert is fine for now
      alert("签文已收藏。您可以在“历史”页面查看。");
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
