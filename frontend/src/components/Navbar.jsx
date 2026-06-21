import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CreditCard,
  FlaskConical,
  TrendingUp,
  PiggyBank,
  Users,
  Target,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // ── Stateful Notifications (persisted in localStorage) ──────────────────────
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 1,
        text: '🚨 Alert: Your Student Loan EMI is due in 3 days!',
        textKn: '🚨 ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ವಿದ್ಯಾರ್ಥಿ ಸಾಲದ ಇಎಂಐ ಇನ್ನು 3 ದಿನಗಳಲ್ಲಿ ಪಾವತಿಸಬೇಕು!',
        time: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        text: '💡 Tip: Save $420 on your car loan by accelerating payments today.',
        textKn: '💡 ಸಲಹೆ: ಇಂದೇ ಪಾವತಿ ವೇಗಗೊಳಿಸಿ ಕಾರು ಸಾಲದಲ್ಲಿ $420 ಉಳಿಸಿ.',
        time: '5 hours ago',
        read: false,
      },
      {
        id: 3,
        text: '🛡️ Anomaly: A suspicious transaction of $7,500 was blocked.',
        textKn: '🛡️ ಅಸಂಗತತೆ: $7,500 ಅನುಮಾನಾಸ್ಪದ ವಹಿವಾಟನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.',
        time: '1 day ago',
        read: false,
      },
    ];
  });

  // Sync to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen for real-time notifications dispatched from other pages
  useEffect(() => {
    const handler = (e) => {
      const { text, textKn } = e.detail || {};
      if (!text) return;
      setNotifications((prev) => [
        { id: Date.now(), text, textKn: textKn || text, time: 'Just now', read: false },
        ...prev,
      ]);
    };
    window.addEventListener('add-notification', handler);
    return () => window.removeEventListener('add-notification', handler);
  }, []);

  const markAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const dismissNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAllNotifications = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  // ────────────────────────────────────────────────────────────────────────────

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleAssistant = () => {
    window.dispatchEvent(new CustomEvent('toggle-ai-assistant'));
  };

  // Nav items (translated)
  const menuItems = [
    { path: '/dashboard',     label: t('dashboard'),     icon: Home },
    { path: '/loans',         label: t('loans'),         icon: CreditCard },
    { path: '/simulation',    label: t('simulation'),    icon: FlaskConical },
    { path: '/analysis',      label: t('analysis'),      icon: TrendingUp },
    { path: '/emergency-fund',label: t('emergencyFund'), icon: PiggyBank },
    { path: '/family',        label: t('familyFinance'), icon: Users },
    { path: '/goals',         label: t('myGoals'),       icon: Target },
  ];
  if (user?.role === 'admin') {
    menuItems.push({ path: '/admin', label: t('adminPanel'), icon: Settings });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg hidden sm:block">
                Smart<span className="text-indigo-600 font-semibold">Loan</span>
              </span>
            </Link>
          </div>

          {/* ── Desktop Nav ───────────────────────────────────────────────────── */}
          {user && (
            <nav className="hidden lg:flex items-center gap-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                      active
                        ? 'text-indigo-600 bg-indigo-50/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-indigo-600"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ── Right Controls ────────────────────────────────────────────────── */}
          {user && (
            <div className="flex items-center gap-2">

              {/* Groq AI assistant */}
              <button
                onClick={toggleAssistant}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span className="hidden sm:inline">
                  {t('aiInsights')}
                </span>
              </button>

              {/* Language switcher dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangDropdownOpen((v) => !v)}
                  title="Switch Language / ಭಾಷೆ ಬದಲಿಸಿ"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer text-slate-700 active:scale-95 animate-fade-in"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {langDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setLangDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-32 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-20"
                      >
                        <button
                          onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            language === 'en' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            language === 'hi' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          हिन्दी
                        </button>
                        <button
                          onClick={() => { setLanguage('kn'); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            language === 'kn' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          ಕನ್ನಡ
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Notification Bell ────────────────────────────────────────── */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen((v) => !v)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-20 text-slate-700"
                      >
                        {/* Header */}
                        <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                            {t('notifications')}
                            {unreadCount > 0 && (
                              <span className="ml-2 text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount} {t('new')}
                              </span>
                            )}
                          </h4>
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              {t('clearAll')}
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto mt-1">
                          {notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`py-2.5 rounded-lg px-2 text-xs leading-relaxed flex items-start gap-2 cursor-pointer transition-all ${
                                  notif.read
                                    ? 'opacity-60 hover:opacity-80'
                                    : 'bg-indigo-50/20 hover:bg-slate-50 font-semibold'
                                }`}
                              >
                                <div className="flex-1">
                                  <p className="text-slate-800">
                                    {language === 'en' ? notif.text : (notif.textKn || notif.text)}
                                  </p>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                                    {notif.time}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dismissNotification(notif.id);
                                  }}
                                  className="text-base text-slate-300 hover:text-rose-500 font-bold leading-none px-1 rounded transition-colors"
                                  title="Dismiss"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-xs text-slate-400 font-medium">
                              {t('allCaughtUp')}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {/* ──────────────────────────────────────────────────────────────── */}

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm border border-slate-300">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-20"
                      >
                        <div className="px-3 py-2 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {t('hello')}, {user.name || 'User'}!
                          </p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-full">
                            {user.role === 'admin' ? 'Administrator' : 'Premium SaaS User'}
                          </span>
                        </div>
                        <div className="pt-2">
                          <button
                            onClick={toggleAssistant}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                          >
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>{t('askAiAssistant')}</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t('logout')}</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col gap-6 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 tracking-tight text-lg">
                  Smart<span className="text-indigo-600">Loan</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all ${
                        active
                          ? 'text-indigo-700 bg-indigo-50 border border-indigo-100/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                {/* Language selection in mobile */}
                <div className="flex flex-col gap-1.5 px-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    {t('selectLanguage')}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`py-2 px-1 text-xs font-bold border rounded-xl transition-all ${
                        language === 'en'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`py-2 px-1 text-xs font-bold border rounded-xl transition-all ${
                        language === 'hi'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => setLanguage('kn')}
                      className={`py-2 px-1 text-xs font-bold border rounded-xl transition-all ${
                        language === 'kn'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-800">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {t('hello')}, {user?.name || 'User'}!
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={toggleAssistant}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('aiInsightsPanel')}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-semibold hover:bg-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
