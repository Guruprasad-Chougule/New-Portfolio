import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { PERSONAL } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// ─────────────────────────────────────────────────────────────────────────────
//  ✅ PASTE YOUR EMAILJS IDs HERE
//  Get them from: https://www.emailjs.com/account
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_AUTO_REPLY  = 'YOUR_AUTOREPLY_ID';  // optional
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────────────────────
//  ✅ Your EmailJS template must use these variable names exactly:
//     {{from_name}}  {{from_email}}  {{from_phone}}  {{message}}  {{to_name}}
// ─────────────────────────────────────────────────────────────────────────────


// ── Toast notification ────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  const icons  = { success: '✅', error: '❌', info: 'ℹ️' };
  const colors = {
    success: { border: '1px solid rgba(74,222,128,0.4)',  background: 'rgba(74,222,128,0.08)'  },
    error:   { border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.08)' },
    info:    { border: '1px solid rgba(0,212,255,0.4)',   background: 'rgba(0,212,255,0.08)'   },
  };
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className="fixed top-24 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-xl backdrop-blur-xl shadow-2xl max-w-sm"
          style={colors[toast.type]}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0,  scale: 1   }}
          exit={{    opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
          <div>
            <p className="font-display font-bold text-sm text-slate-100">{toast.title}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {toast.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// ── Form field with floating label ────────────────────────────────────────────
// `name`      = React state key  (name / email / phone / message)
// `fieldName` = HTML name attr   (from_name / from_email / from_phone / message)
const FormField = ({ label, type = 'text', name, fieldName, value, onChange, required, rows }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || Boolean(value && value.length > 0);

  const fieldStyle = {
    width:        '100%',
    background:   'rgba(6,13,24,0.65)',
    border:       `1px solid ${focused ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px',
    color:        '#e2e8f0',
    fontFamily:   'Rajdhani, sans-serif',
    fontSize:     '0.95rem',
    outline:      'none',
    transition:   'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow:    focused ? '0 0 0 3px rgba(0,212,255,0.1)' : 'none',
  };

  return (
    <div style={{ position: 'relative', paddingTop: '10px' }}>
      {/* Floating label */}
      <label
        style={{
          position:      'absolute',
          left:          '14px',
          top:           isActive ? '0px'  : rows ? '26px' : '50%',
          transform:     isActive ? 'none' : rows ? 'none' : 'translateY(-50%)',
          color:         focused  ? '#00d4ff' : '#64748b',
          fontSize:      isActive ? '0.6rem'  : '0.8rem',
          letterSpacing: isActive ? '0.18em'  : '0.05em',
          background:    isActive ? '#060d18' : 'transparent',
          padding:       isActive ? '0 5px'   : '0',
          pointerEvents: 'none',
          transition:    'all 0.2s ease',
          zIndex:        10,
          fontFamily:    'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          whiteSpace:    'nowrap',
        }}
      >
        {label}
      </label>

      {rows ? (
        <textarea
          name={fieldName || name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          required={required}
          rows={rows}
          style={{ ...fieldStyle, padding: '14px', resize: 'vertical', minHeight: '130px', display: 'block' }}
        />
      ) : (
        <input
          type={type}
          name={fieldName || name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          required={required}
          style={{ ...fieldStyle, height: '52px', padding: '0 14px', display: 'block' }}
        />
      )}
    </div>
  );
};


// ── Main Contact component ────────────────────────────────────────────────────
const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Simple state keys — totally decoupled from EmailJS field names
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [toast,  setToast]  = useState(null);
  const formRef = useRef(null);

  // ── Toast helper ─────────────────────────────────────────────────────────────
  const showToast = (type, title, message, duration = 5000) => {
    setToast({ id: Date.now(), type, title, message });
    setTimeout(() => setToast(null), duration);
  };

  // ── handleChange ─────────────────────────────────────────────────────────────
  // Maps HTML field name attributes back to React state keys
  const handleChange = (e) => {
    const { name: fieldAttr, value } = e.target;
    const keyMap = {
      from_name:  'name',
      from_email: 'email',
      from_phone: 'phone',
      message:    'message',
    };
    const stateKey = keyMap[fieldAttr] ?? fieldAttr;
    setForm(prev => ({ ...prev, [stateKey]: value }));
  };

  // ── Browser notification ──────────────────────────────────────────────────────
  const fireBrowserNotification = (senderName) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    new Notification('📩 New Portfolio Message!', {
      body: `${senderName} just messaged you via your portfolio.`,
      icon: '/vite.svg',
      tag:  'portfolio-contact',
    });
  };

  // ── Submit handler ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Field-level validation
    if (!form.name.trim()) {
      showToast('error', 'Name required', 'Please enter your full name.', 3500); return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('error', 'Valid email required', 'Please enter a valid email address.', 3500); return;
    }
    if (!form.message.trim()) {
      showToast('error', 'Message required', 'Please write your message before sending.', 3500); return;
    }

    setStatus('sending');

    // Ask for notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    try {
      // sendForm reads all named inputs from the <form> element directly
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      console.log('EmailJS OK:', result.status, result.text);

      // Optional auto-reply to sender
      if (EMAILJS_AUTO_REPLY !== 'YOUR_AUTOREPLY_ID') {
        try {
          await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_AUTO_REPLY, formRef.current, EMAILJS_PUBLIC_KEY);
        } catch (_) { /* not configured — skip silently */ }
      }

      fireBrowserNotification(form.name);

      showToast(
        'success',
        'Message Sent! 🎉',
        `Thanks ${form.name}! I received your message and will reply within 24 hours.`,
        6000
      );

      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);

    } catch (err) {
      console.error('EmailJS failed:', err);
      setStatus('error');
      showToast(
        'error',
        'Send Failed',
        err?.text || err?.message || 'Check your EmailJS IDs in Contact.jsx lines 12–15.',
        7000
      );
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  // ── Contact info list ─────────────────────────────────────────────────────────
  const contactInfo = [
    { icon: '📧', label: 'Email',    value: PERSONAL.email,           href: `mailto:${PERSONAL.email}` },
    { icon: '📱', label: 'Phone',    value: PERSONAL.phone,           href: `tel:${PERSONAL.phone}`    },
    { icon: '💼', label: 'LinkedIn', value: 'guruprasad-chougule',    href: PERSONAL.linkedin          },
    { icon: '📍', label: 'Location', value: PERSONAL.location,        href: null                       },
  ];

  return (
    <SectionWrapper id="contact" className="py-32 px-6">
      <Toast toast={toast} />

      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          ref={ref}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="section-subtitle">// Get In Touch</p>
          <h2 className="section-title gradient-text">Contact Me</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-4" />
          <p className="text-slate-500 mt-4 text-sm max-w-lg mx-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            Open to QA Lead, Senior QA, and Automation roles in Life Sciences, Healthcare, or GxP domains.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Left info panel */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass-card border border-neon-blue/10 p-6">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-5 uppercase tracking-wider">
                Let's Connect
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
                    >
                      {info.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-500 tracking-wider">{info.label.toUpperCase()}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer"
                          className="text-slate-300 text-sm hover:text-neon-blue transition-colors block truncate"
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

            {/* Open to work badge */}
            <div className="glass-card border border-green-500/20 p-4 flex items-center gap-3">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
              </span>
              <div>
                <p className="font-mono text-xs text-green-400 tracking-wider">OPEN TO OPPORTUNITIES</p>
                <p className="text-slate-500 text-xs mt-0.5">QA Lead / Senior QA / Automation</p>
              </div>
            </div>

            {/* Response time */}
            <div className="glass-card border border-white/5 p-4">
              <p className="font-mono text-xs text-slate-500 tracking-wider mb-1">AVG RESPONSE TIME</p>
              <p className="font-display font-bold text-xl neon-text">24 Hours</p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-card-strong border border-neon-blue/10 p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

                {/* Hidden fields for EmailJS sendForm */}
                <input type="hidden" name="to_name"  defaultValue="Guruprasad" />
                <input type="hidden" name="reply_to" value={form.email} onChange={() => {}} />

                {/* Name + Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <FormField
                    label="Your Name *"
                    name="name"
                    fieldName="from_name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <FormField
                    label="Email Address *"
                    type="email"
                    name="email"
                    fieldName="from_email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <FormField
                  label="Phone (optional)"
                  type="tel"
                  name="phone"
                  fieldName="from_phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                {/* Message */}
                <FormField
                  label="Your Message *"
                  name="message"
                  fieldName="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-60"
                  whileHover={status === 'idle' ? { scale: 1.01, y: -1 } : {}}
                  whileTap={status  === 'idle' ? { scale: 0.99 }       : {}}
                >
                  <span className="font-display text-sm tracking-wider flex items-center gap-2">
                    {status === 'idle' && (
                      <>
                        <span>Send Message</span>
                        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          →
                        </motion.span>
                      </>
                    )}
                    {status === 'sending' && (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Transmitting...</span>
                      </>
                    )}
                    {status === 'success' && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-green-300"
                      >
                        <span>✓</span><span>Message Delivered!</span>
                      </motion.span>
                    )}
                    {status === 'error' && (
                      <span className="flex items-center gap-2">
                        <span>✕</span><span>Failed — Try Again</span>
                      </span>
                    )}
                  </span>
                </motion.button>

                {/* Fallback */}
                <p className="text-center font-mono text-xs text-slate-600">
                  Or email directly:{' '}
                  <a href={`mailto:${PERSONAL.email}`} className="text-neon-blue/70 hover:text-neon-blue">
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
