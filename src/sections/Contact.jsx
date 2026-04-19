import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { PERSONAL } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// ─────────────────────────────────────────────
//  ✅ REPLACE THESE 3 VALUES WITH YOUR OWN
//  from emailjs.com dashboard
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_zcydc4a';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_vu7jzpo';  // e.g. 'template_xyz789'  ← sends to YOU
const EMAILJS_AUTO_REPLY  = 'template_ulogh3j'; // e.g. 'template_reply01' ← sends to SENDER
const EMAILJS_PUBLIC_KEY  = '5bVnCI-6X6y4hlKjT';   // e.g. 'aBcDeFgH1234'
// ─────────────────────────────────────────────

// ── Toast notification component ──────────────────────────────────────────────
const Toast = ({ toast }) => {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const colors = {
    success: 'border-green-500/40 bg-green-500/10',
    error:   'border-red-500/40   bg-red-500/10',
    info:    'border-neon-blue/40 bg-neon-blue/10',
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={`fixed top-24 right-6 z-50 flex items-start gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm ${colors[toast.type]}`}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
          <div>
            <p className="font-display font-bold text-sm text-slate-100">{toast.title}</p>
            <p className="font-body text-xs text-slate-400 mt-1 leading-relaxed">{toast.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Floating label input ───────────────────────────────────────────────────────
const FormField = ({ label, type = 'text', name, value, onChange, required, rows }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  const sharedStyle = {
    border: `1px solid ${focused ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
    background: 'rgba(6,13,24,0.5)',
    boxShadow: focused ? '0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.02)' : 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div className="relative">
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none font-mono tracking-wider z-10"
        style={{
          top: isActive ? '-10px' : rows ? '16px' : '50%',
          transform: isActive ? 'none' : rows ? 'none' : 'translateY(-50%)',
          color: focused ? '#00d4ff' : '#64748b',
          fontSize: isActive ? '0.65rem' : '0.8rem',
          letterSpacing: isActive ? '0.2em' : '0.1em',
          background: isActive ? 'var(--label-bg, #060d18)' : 'transparent',
          padding: isActive ? '0 6px' : '0',
        }}
      >
        {label.toUpperCase()}
      </label>

      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          rows={rows}
          className="w-full bg-transparent rounded-lg px-4 pt-5 pb-3 font-body text-slate-200 outline-none resize-none text-sm"
          style={sharedStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent rounded-lg px-4 h-14 font-body text-slate-200 outline-none text-sm"
          style={sharedStyle}
        />
      )}
    </div>
  );
};

// ── Main Contact section ───────────────────────────────────────────────────────
const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [toast, setToast]   = useState(null);
  const formRef = useRef(null);

  // ── Show a timed toast ───────────────────────────────────────────────────────
  const showToast = (type, title, message, duration = 5000) => {
    const id = Date.now();
    setToast({ id, type, title, message });
    setTimeout(() => setToast(null), duration);
  };

  // ── Request browser notification permission ──────────────────────────────────
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // ── Fire a browser notification ──────────────────────────────────────────────
  const sendBrowserNotification = (senderName) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('📩 New Portfolio Message!', {
        body: `${senderName} just sent you a message via your portfolio.`,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'portfolio-contact',
        requireInteraction: false,
      });
    }
  };

  // ── Handle form change ───────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Handle submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');

    // Request notification permission on first send
    await requestNotificationPermission();

    // Template variables — must match your EmailJS template placeholders
    const templateParams = {
      from_name:    form.name,
      from_email:   form.email,
      from_phone:   form.phone || 'Not provided',
      message:      form.message,
      to_name:      'Guruprasad',
      reply_to:     form.email,
    };

    try {
      // ── 1. Send notification email TO YOU ──────────────────────────────────
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // ── 2. Send auto-reply TO THE SENDER ──────────────────────────────────
      //    (skip silently if auto-reply template not configured yet)
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_AUTO_REPLY,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
      } catch (_) {
        // Auto-reply template not set up yet — that's fine
      }

      // ── 3. Browser push notification ───────────────────────────────────────
      sendBrowserNotification(form.name);

      // ── 4. In-app toast ────────────────────────────────────────────────────
      showToast(
        'success',
        'Message Sent! 🎉',
        `Thanks ${form.name}! Your message is received. I'll reply within 24 hours.`,
        6000
      );

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });

      // Reset button after 4s
      setTimeout(() => setStatus('idle'), 4000);

    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      showToast(
        'error',
        'Send Failed',
        'Something went wrong. Please email me directly or try again.',
        6000
      );
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  // ── Contact info list ────────────────────────────────────────────────────────
  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: PERSONAL.email,
      href: `mailto:${PERSONAL.email}`,
    },
    {
      icon: '📱',
      label: 'Phone',
      value: PERSONAL.phone,
      href: `tel:${PERSONAL.phone}`,
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'guruprasad-chougule',
      href: PERSONAL.linkedin,
    },
    {
      icon: '📍',
      label: 'Location',
      value: PERSONAL.location,
      href: null,
    },
  ];

  return (
    <SectionWrapper id="contact" className="py-32 px-6">
      {/* Toast notification */}
      <Toast toast={toast} />

      <div className="max-w-6xl mx-auto">

        {/* ── Section header ──────────────────────────────────────────────── */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// Get In Touch</p>
          <h2 className="section-title gradient-text">Contact Me</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
          <p className="text-slate-500 mt-4 text-sm font-body max-w-lg mx-auto">
            Open to QA Lead, Senior QA, and Automation roles in Life Sciences, Healthcare, or GxP-regulated domains.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* ── Left: Contact info ────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Info card */}
            <div className="glass-card border border-neon-blue/10 p-6">
              <h3 className="font-display font-bold text-base text-slate-200 mb-6 uppercase tracking-wider">
                Let's Connect
              </h3>

              <div className="space-y-5">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
                    >
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-mono text-xs text-slate-500 tracking-wider">
                        {info.label.toUpperCase()}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-slate-300 text-sm hover:text-neon-blue transition-colors break-all"
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-slate-300 text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available badge */}
            <div className="glass-card border border-green-500/20 p-5 flex items-center gap-4">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
              </span>
              <div>
                <p className="font-mono text-xs text-green-400 tracking-wider">OPEN TO OPPORTUNITIES</p>
                <p className="text-slate-500 text-xs mt-0.5">QA Lead / Senior QA / Automation roles</p>
              </div>
            </div>

            {/* Response time */}
            <div className="glass-card border border-white/5 p-5">
              <p className="font-mono text-xs text-slate-500 mb-1 tracking-wider">AVG RESPONSE TIME</p>
              <p className="font-display font-bold text-xl neon-text">24 Hours</p>
            </div>

            {/* Notification hint */}
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}
            >
              <span className="text-xl flex-shrink-0">🔔</span>
              <p className="font-mono text-xs text-slate-500 leading-relaxed">
                Allow notifications when prompted — you'll see a browser alert when your message is delivered.
              </p>
            </div>
          </motion.div>

          {/* ── Right: Form ───────────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-card-strong border border-neon-blue/10 p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>

                {/* Row 1: Name + Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Row 2: Phone (optional) */}
                <FormField
                  label="Phone Number (optional)"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                {/* Row 3: Message */}
                <FormField
                  label="Your Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />

                {/* ── Submit button ──────────────────────────────────────── */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-70"
                  whileHover={status === 'idle' ? { scale: 1.01, y: -1 } : {}}
                  whileTap={status === 'idle' ? { scale: 0.99 } : {}}
                >
                  <span className="relative z-10 flex items-center gap-2 font-display text-sm tracking-wider">

                    {status === 'idle' && (
                      <>
                        <span>Send Message</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </>
                    )}

                    {status === 'sending' && (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Transmitting...</span>
                      </>
                    )}

                    {status === 'success' && (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-300"
                        >
                          ✓
                        </motion.span>
                        <span>Message Delivered!</span>
                      </>
                    )}

                    {status === 'error' && (
                      <>
                        <span>✕</span>
                        <span>Failed — Try Again</span>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Direct email fallback */}
                <p className="text-center font-mono text-xs text-slate-600">
                  Or email directly at{' '}
                  <a
                    href={`mailto:${PERSONAL.email}`}
                    className="text-neon-blue/70 hover:text-neon-blue transition-colors"
                  >
                    {PERSONAL.email}
                  </a>
                </p>

              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
