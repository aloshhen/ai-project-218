import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import SafeIcon from './components/SafeIcon'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)
    
    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// Scroll Animation Component
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Match Card Component
const MatchCard = ({ match, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] group"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
          {match.tournament}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <SafeIcon name="clock" size={12} />
          {match.time}
        </span>
      </div>
      <span className={cn(
        "text-xs font-semibold px-2 py-1 rounded",
        match.status === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse' : 
        match.status === 'Завершен' ? 'bg-green-500/20 text-green-400' : 
        'bg-slate-600/20 text-slate-400'
      )}>
        {match.status}
      </span>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{match.team1.short}</span>
        </div>
        <div>
          <h4 className="font-bold text-white">{match.team1.name}</h4>
          <span className="text-sm text-slate-400">#{match.team1.rank} в мире</span>
        </div>
      </div>
      
      <div className="px-6 text-center">
        <div className="text-3xl font-black text-amber-500">
          {match.score || 'vs'}
        </div>
        <span className="text-xs text-slate-500">{match.map}</span>
      </div>
      
      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="text-right">
          <h4 className="font-bold text-white">{match.team2.name}</h4>
          <span className="text-sm text-slate-400">#{match.team2.rank} в мире</span>
        </div>
        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">{match.team2.short}</span>
        </div>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <SafeIcon name="trophy" size={14} />
          {match.prize}
        </span>
        <span className="flex items-center gap-1">
          <SafeIcon name="users" size={14} />
          {match.viewers} зрителей
        </span>
      </div>
      <button className="text-amber-500 hover:text-amber-400 text-sm font-semibold flex items-center gap-1 transition-colors">
        Смотреть
        <SafeIcon name="arrow-right" size={14} />
      </button>
    </div>
  </motion.div>
)

// Player Card Component
const PlayerCard = ({ player, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:transform hover:-translate-y-2 group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
    
    <div className="flex items-start justify-between mb-4">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl font-black text-white">
        {player.rating}
      </div>
      <span className={cn(
        "text-xs font-semibold px-3 py-1 rounded-full",
        player.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      )}>
        {player.trend === 'up' ? '+' : ''}{player.change}
      </span>
    </div>
    
    <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
    <p className="text-amber-500 font-semibold mb-4">{player.team}</p>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-900/50 rounded-lg p-3">
        <span className="text-xs text-slate-400 block">K/D</span>
        <span className="text-lg font-bold text-white">{player.kd}</span>
      </div>
      <div className="bg-slate-900/50 rounded-lg p-3">
        <span className="text-xs text-slate-400 block">HS%</span>
        <span className="text-lg font-bold text-white">{player.hs}%</span>
      </div>
      <div className="bg-slate-900/50 rounded-lg p-3">
        <span className="text-xs text-slate-400 block">ADR</span>
        <span className="text-lg font-bold text-white">{player.adr}</span>
      </div>
      <div className="bg-slate-900/50 rounded-lg p-3">
        <span className="text-xs text-slate-400 block">Maps</span>
        <span className="text-lg font-bold text-white">{player.maps}</span>
      </div>
    </div>
  </motion.div>
)

// Stat Feature Component
const StatFeature = ({ icon, value, label, trend }) => (
  <div className="text-center p-6">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-2xl mb-4">
      <SafeIcon name={icon} className="w-8 h-8 text-amber-500" />
    </div>
    <div className="text-4xl md:text-5xl font-black text-white mb-2">{value}</div>
    <div className="text-slate-400 mb-2">{label}</div>
    {trend && (
      <span className="text-sm text-green-400 flex items-center justify-center gap-1">
        <SafeIcon name="trending-up" size={14} />
        {trend}
      </span>
    )}
  </div>
)

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key from https://web3forms.com

  const matches = [
    {
      tournament: 'BLAST Premier',
      time: '19:00',
      status: 'LIVE',
      team1: { name: 'NAVI', short: 'NAV', rank: 3 },
      team2: { name: 'FaZe Clan', short: 'FZ', rank: 1 },
      score: '1:0',
      map: 'Mirage',
      prize: '$250,000',
      viewers: '485K'
    },
    {
      tournament: 'IEM Cologne',
      time: '21:30',
      status: 'Скоро',
      team1: { name: 'G2 Esports', short: 'G2', rank: 2 },
      team2: { name: 'Team Vitality', short: 'VIT', rank: 4 },
      score: null,
      map: 'Inferno',
      prize: '$500,000',
      viewers: '0'
    },
    {
      tournament: 'ESL Pro League',
      time: 'Завершен',
      status: 'Завершен',
      team1: { name: 'Astralis', short: 'AST', rank: 8 },
      team2: { name: 'MOUZ', short: 'MOU', rank: 5 },
      score: '2:1',
      map: 'Nuke',
      prize: '$125,000',
      viewers: '320K'
    }
  ]

  const players = [
    { name: 's1mple', team: 'NAVI', rating: 1.35, kd: 1.42, hs: 62, adr: 89, maps: 156, trend: 'up', change: 0.02 },
    { name: 'ZywOo', team: 'Vitality', rating: 1.32, kd: 1.38, hs: 58, adr: 85, maps: 142, trend: 'up', change: 0.01 },
    { name: 'NiKo', team: 'G2', rating: 1.28, kd: 1.31, hs: 64, adr: 88, maps: 168, trend: 'down', change: -0.01 },
    { name: 'ropz', team: 'FaZe', rating: 1.25, kd: 1.29, hs: 55, adr: 82, maps: 134, trend: 'up', change: 0.03 }
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-slate-950/90 backdrop-blur-md z-50 border-b border-slate-800/50">
        <nav className="container mx-auto max-w-7xl px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <SafeIcon name="target" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                CS:GO<span className="text-amber-500">HUB</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('matches')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium">Матчи</button>
              <button onClick={() => scrollToSection('players')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium">Игроки</button>
              <button onClick={() => scrollToSection('stats')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium">Статистика</button>
              <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium">О нас</button>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <button className="text-slate-300 hover:text-white transition-colors">
                <SafeIcon name="search" className="w-5 h-5" />
              </button>
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105">
                Войти
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <SafeIcon name={mobileMenuOpen ? 'x' : 'menu'} className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 pb-4 border-t border-slate-800/50 pt-4"
              >
                <div className="flex flex-col gap-4">
                  <button onClick={() => scrollToSection('matches')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium text-left">Матчи</button>
                  <button onClick={() => scrollToSection('players')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium text-left">Игроки</button>
                  <button onClick={() => scrollToSection('stats')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium text-left">Статистика</button>
                  <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-amber-500 transition-colors font-medium text-left">О нас</button>
                  <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-lg font-bold transition-all w-full">
                    Войти
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center opacity-20" />
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-amber-500 font-semibold mb-6">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Прямой эфир: NAVI vs FaZe
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
                МИР <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">CS:GO</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-8 leading-relaxed max-w-2xl">
                Актуальная статистика, расписание матчей, рейтинги игроков и все новости из мира Counter-Strike в одном месте
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('matches')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="play" className="w-5 h-5" />
                  Смотреть матчи
                </button>
                <button 
                  onClick={() => scrollToSection('stats')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                  <SafeIcon name="bar-chart" className="w-5 h-5" />
                  Статистика
                </button>
              </div>
            </motion.div>
            
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-white">2.4M</div>
                <div className="text-sm text-slate-400">Игроков онлайн</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-amber-500">156</div>
                <div className="text-sm text-slate-400">Матчей сегодня</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-white">$12M</div>
                <div className="text-sm text-slate-400">Призовой фонд</div>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-black text-amber-500">48</div>
                <div className="text-sm text-slate-400">Турниров</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section id="matches" className="py-20 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <FadeInWhenVisible>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Ближайшие <span className="text-amber-500">матчи</span>
                </h2>
                <p className="text-slate-400 text-lg">Расписание турниров и прямые трансляции</p>
              </div>
              <button className="mt-4 md:mt-0 text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2 transition-colors">
                Все матчи
                <SafeIcon name="arrow-right" className="w-5 h-5" />
              </button>
            </div>
          </FadeInWhenVisible>
          
          <div className="space-y-4">
            {matches.map((match, index) => (
              <MatchCard key={index} match={match} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Players Section */}
      <section id="players" className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Топ <span className="text-amber-500">игроки</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Рейтинг лучших игроков на основе статистики последних 3 месяцев
              </p>
            </div>
          </FadeInWhenVisible>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player, index) => (
              <PlayerCard key={index} player={player} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-slate-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <FadeInWhenVisible>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-16 border border-slate-700/50">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Статистика <span className="text-amber-500">2024</span>
                </h2>
                <p className="text-slate-400 text-lg">Общая статистика профессиональной сцены CS:GO</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatFeature icon="gamepad2" value="2,847" label="Про матчей" trend="+12%" />
                <StatFeature icon="users" value="1,432" label="Про игроков" trend="+8%" />
                <StatFeature icon="trophy" value="156" label="Турниров" trend="+24%" />
                <StatFeature icon="target" value="1.24" label="Средний рейтинг" trend="+3%" />
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-950">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-3xl blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80" 
                  alt="CS:GO Gaming Setup" 
                  className="relative rounded-2xl shadow-2xl border border-slate-800 w-full"
                />
              </div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.2}>
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  О нашем <span className="text-amber-500">проекте</span>
                </h2>
                <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                  CS:GO Hub — это централизованная платформа для отслеживания всего, что связано с миром Counter-Strike. Мы собираем данные из всех крупных турниров, анализируем статистику игроков и предоставляем актуальную информацию в удобном формате.
                </p>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Наша цель — сделать киберспорт более доступным и понятным для каждого фаната CS:GO.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="zap" className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Live обновления</h4>
                      <p className="text-sm text-slate-400">Данные обновляются в реальном времени</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SafeIcon name="shield" className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Достоверность</h4>
                      <p className="text-sm text-slate-400">Только проверенные источники</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <FadeInWhenVisible>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Свяжитесь с <span className="text-amber-500">нами</span>
              </h2>
              <p className="text-slate-400 text-lg">
                Есть вопросы или предложения? Напишите нам!
              </p>
            </div>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay={0.2}>
            <div className="max-w-xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                {!isSuccess ? (
                  <form onSubmit={(e) => handleSubmit(e, ACCESS_KEY)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Сообщение</label>
                      <textarea
                        name="message"
                        rows="4"
                        required
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                        placeholder="Ваше сообщение..."
                      ></textarea>
                    </div>
                    
                    {isError && (
                      <div className="text-red-400 text-sm flex items-center gap-2">
                        <SafeIcon name="alert-circle" className="w-4 h-4" />
                        {errorMessage}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-950 px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-[1.02] disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                          Отправка...
                        </>
                      ) : (
                        <>
                          <SafeIcon name="send" className="w-5 h-5" />
                          Отправить сообщение
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SafeIcon name="check-circle" className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Сообщение отправлено!</h3>
                    <p className="text-slate-400 mb-8">Спасибо за обращение. Мы ответим вам в ближайшее время.</p>
                    <button
                      onClick={resetForm}
                      className="text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                    >
                      Отправить еще
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <SafeIcon name="target" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">
                  CS:GO<span className="text-amber-500">HUB</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ваш центр вселенной Counter-Strike. Матчи, статистика, игроки — всё в одном месте.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Разделы</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('matches')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Матчи</button></li>
                <li><button onClick={() => scrollToSection('players')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Игроки</button></li>
                <li><button onClick={() => scrollToSection('stats')} className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Статистика</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Поддержка</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">Контакты</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                  <SafeIcon name="twitter" className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                  <SafeIcon name="youtube" className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                  <SafeIcon name="twitch" className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all group">
                  <SafeIcon name="discord" className="w-5 h-5 text-slate-400 group-hover:text-slate-950" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 CS:GO Hub. Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App