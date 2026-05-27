"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Video,
  Users,
  MapPin,
  ShoppingCart,
  Trophy,
  CheckCircle,
  Clock,
  ChevronRight,
  Instagram,
  Send,
  Map,
  Menu,
  X,
  MessageCircle,
  Bot,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const WHATSAPP_BASE = "https://wa.me/77024885854"

// Helper function to create WhatsApp URLs with pre-filled messages
const getWhatsAppUrl = (message?: string) => {
  if (!message) return WHATSAPP_BASE
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`
}

// Pre-defined messages
const WHATSAPP_MESSAGES = {
  booking: "Сәлеметсіз бе! Мен мини-стадионды брондайын деп едім.",
  base: "Сәлеметсіз бе! Мен Base тарифіне жазылғым келеді.",
  standard: "Сәлеметсіз бе! Мен Standard тарифіне жазылғым келеді.",
  premium: "Сәлеметсіз бе! Мен Premium тарифіне жазылғым келеді.",
  product: (name: string) => `Сәлеметсіз бе! Мен дүкеннен ${name} сатып алғым келеді.`,
}

interface ChatMessage {
  id: number
  text: string
  sender: "bot" | "user"
}

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Сәлеметсіз бе! Мен Football Pro Center жасанды интеллект көмекшісімін. Сізге қалай көмектесе аламын?",
      sender: "bot"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user"
    }

    const currentMessages = [...messages, userMessage]
    setMessages(currentMessages)
    setInputValue("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages })
      })

      if (response.ok) {
        const data = await response.json()
        const botReply: ChatMessage = {
          id: Date.now() + 1,
          text: data.text,
          sender: "bot"
        }
        setMessages(prev => [...prev, botReply])
      } else {
        throw new Error("API response was not ok.")
      }
    } catch (error) {
      console.error("Failed to fetch chat response:", error)
      const errorReply: ChatMessage = {
        id: Date.now() + 1,
        text: "Кешіріңіз, байланыс қатесі орын алды. Біраз уақыттан соң қайталап көріңіз.",
        sender: "bot"
      }
      setMessages(prev => [...prev, errorReply])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors glow-primary"
        aria-label="Open AI Chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] glass rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">ProCenter AI</h3>
                  <p className="text-xs text-muted-foreground">Онлайн</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-border bg-card/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Сұрағыңызды жазыңыз..."
                  className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
                  aria-label="Send message"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Немесе{" "}
                <a
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp арқылы жазыңыз
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold italic tracking-tight text-foreground">
                Football Pro Center
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Жоба туралы
              </a>
              <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Қызметтер
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Бағалар
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Байланыс
              </a>
            </div>

            <div className="hidden md:block">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              >
                <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.booking)} target="_blank" rel="noopener noreferrer">
                  <Clock className="mr-2 h-4 w-4" />
                  Алаңды брондау
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col gap-4">
                <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Жоба туралы
                </a>
                <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Қызметтер
                </a>
                <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Бағалар
                </a>
                <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Байланыс
                </a>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
                  <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.booking)} target="_blank" rel="noopener noreferrer">
                    <Clock className="mr-2 h-4 w-4" />
                    Алаңды брондау
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1e1e11417032?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.25_0.01_260/0.1)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.25_0.01_260/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              Ақтаудағы №1 футбол орталығы
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-6"
          >
            <span className="text-foreground">FOOTBALL</span>
            <br />
            <span className="text-gradient">PRO CENTER</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
          >
            Ақтаудағы алғашқы кешенді кәсіби футбол орталығы. Кәсіби талдау, жаттығу, спорт тауарлары және мини-стадион бір жерде.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8 py-6"
            >
              <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.booking)} target="_blank" rel="noopener noreferrer">
                <Clock className="mr-2 h-5 w-5" />
                Уақытты брондау
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-lg px-8 py-6" asChild>
              <a href="#about">
                Толығырақ білу
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-primary rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </section>

      {/* About / Mission Section */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground"
            >
              Біздің Миссиямыз
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Жастар мен спорт сүйер қауымға кәсіби деңгейде жат��ығу жасауға мүмкіндік беріп, футбол мәдениетін дамыту.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { value: "70%", label: "Сұраныс" },
              { value: "500+", label: "Жас спортшылар" },
              { value: "1-ші", label: "Кешенді орталық" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-5xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground"
            >
              Негізгі Қызмет Бағыттары
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Video,
                title: "Кәсіби талдау",
                desc: "Ойыншылардың техникасы мен тактикасын видео және статистика арқылы бағалау."
              },
              {
                icon: Users,
                title: "Жаттығу бағдарламалары",
                desc: "Жеке және топтық футбол жаттығулары, кәсіби бапкерлердің жетекшілігімен."
              },
              {
                icon: MapPin,
                title: "Алаң жалға беру",
                desc: "Жаттығулар мен шағын турнирлер өткізуге арналған заманауи мини-стадион."
              },
              {
                icon: ShoppingCart,
                title: "Спорт тауарлары",
                desc: "Сапалы доптар, бутсы, форма және жаттығу құралдары."
              },
              {
                icon: Trophy,
                title: "Турнирлер",
                desc: "Жастар мен командаларға арналған спорттық турнирлер ұйымдастыру."
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:glow-primary">
                      <service.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {service.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 text-foreground">
                Неліктен бізді таңдайсыз?
              </h2>
              
              <div className="space-y-6">
                {[
                  "Барлық қызметтер бір орталықта",
                  "Кәсіби видео және статистикалық талдау",
                  "Заманауи инфрақұрылым"
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg text-foreground font-medium">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center overflow-hidden">
                  <div className="text-center p-8">
                    <Trophy className="h-24 w-24 text-primary mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Premium Experience</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-foreground"
            >
              Бағалар
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Base Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-card border-border hover:border-primary/30 transition-all">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2 border-muted-foreground/30 text-muted-foreground">Base</Badge>
                  <CardTitle className="text-xl text-card-foreground">Алаң жалдау</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">5 000</span>
                    <span className="text-muted-foreground ml-2">тг/сағ</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {["Заманауи жабын", "Жуынатын бөлме", "Күндіз/Түн жарығы"].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.base)} target="_blank" rel="noopener noreferrer">
                      Брондау
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Standard Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-card border-primary relative overflow-hidden glow-primary">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                  Танымал
                </div>
                <CardHeader className="pt-8">
                  <Badge variant="outline" className="w-fit mb-2 border-primary/50 text-primary">Standard</Badge>
                  <CardTitle className="text-xl text-card-foreground">Жаттығу бағдарламалары</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">3 000 - 8 000</span>
                    <span className="text-muted-foreground ml-2">тг</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {["Топтық/Жеке сабақтар", "Кәсіби бапкер", "Икемді кесте"].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.standard)} target="_blank" rel="noopener noreferrer">
                      Жазылу
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Premium Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-card border-border hover:border-accent/50 transition-all">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2 border-accent/50 text-accent">Premium</Badge>
                  <CardTitle className="text-xl text-card-foreground">Кәсіби талдау қызметі</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">15 000</span>
                    <span className="text-muted-foreground ml-2">тг</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {["Видео түсірілім", "Статистика", "Жеке кері байланыс"].map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.premium)} target="_blank" rel="noopener noreferrer">
                      Тапсырыс беру
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Store Teaser Section */}
      <section id="store" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground"
            >
              Pro Center Дүкені
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground"
            >
              Кәсіби стандарттарға сай жабдықтар
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: "Кәсіби бутсылар", price: "45 000 тг", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80" },
              { name: "Ресми матч доптары", price: "25 000 тг", image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&q=80" },
              { name: "Жаттығу формасы", price: "15 000 тг", image: "https://images.unsplash.com/photo-1580087433276-a0104f2913db?auto=format&fit=crop&q=80" }
            ].map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/30 transition-all overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">{product.name}</CardTitle>
                    <p className="text-2xl font-bold text-primary">{product.price}</p>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      <a href={getWhatsAppUrl(WHATSAPP_MESSAGES.product(product.name))} target="_blank" rel="noopener noreferrer">
                        Сатып алу
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer / CTA Section */}
      <footer id="contact" className="py-24 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground text-balance"
            >
              Өз ойыныңды жаңа деңгейге көтер!
            </motion.h2>
            
            <motion.div variants={fadeInUp} className="flex justify-center gap-4 mb-8">
              <a
                href="https://instagram.com/footballprocenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/footballprocenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://2gis.kz/aktau/search/football%20pro%20center"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="2GIS Map"
              >
                <Map className="h-5 w-5" />
              </a>
            </motion.div>

            <motion.p variants={fadeInUp} className="text-muted-foreground mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Маңғыстау облысы, Ақтау қаласы
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground">
              © 2025 Football Pro Center. Барлық құқықтар қорғалған.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
