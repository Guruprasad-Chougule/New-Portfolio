import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PERSONAL } from '../data/portfolioData';
import SectionWrapper from '../components/SectionWrapper';

// Floating label input component
const FormField = ({ label, type = 'text', name, value, onChange, required, rows }) => {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <label
        className="absolute left-4 transition-all duration-200 pointer-events-none font-mono text-xs tracking-wider z-10"
        style={{
          top: isActive ? '-10px' : rows ? '16px' : '50%',
          transform: isActive ? 'none' : rows ? 'none' : 'translateY(-50%)',
          color: focused ? '#00d4ff' : '#64748b',
          fontSize: isActive ? '0.65rem' : '0.8rem',
          letterSpacing: isActive ? '0.2em' : '0.1em',
          background: isActive ? 'var(--dark-800)' : 'transparent',
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
          className="w-full bg-transparent rounded-lg px-4 pt-4 pb-3 font-body text-slate-200 outline-none resize-none transition-all duration-300 text-sm"
          style={{
            border: `1px solid ${focused ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
            background: 'rgba(6,13,24,0.5)',
            boxShadow: focused ? '0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.02)' : 'none',
          }}
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
          className="w-full bg-transparent rounded-lg px-4 h-14 font-body text-slate-200 outline-none transition-all duration-300 text-sm"
          style={{
            border: `1px solid ${focused ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
            background: 'rgba(6,13,24,0.5)',
            boxShadow: focused ? '0 0 20px rgba(0,212,255,0.08), inset 0 0 20px rgba(0,212,255,0.02)' : 'none',
          }}
        />
      )}
    </div>
  );
};

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // EmailJS integration — replace with your actual IDs
    // import emailjs from '@emailjs/browser';
    // emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', formRef.current, 'PUBLIC_KEY')

    // Simulated send for demo
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 1800);
  };

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: PERSONAL.email,
      href: `mailto:${PERSONAL.email}`,
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
      <div className="max-w-6xl mx-auto">

        {/* Header */}
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

          {/* Left: Info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
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
                      <p className="font-mono text-xs text-slate-500 tracking-wider">{info.label.toUpperCase()}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-slate-300 text-sm hover:text-neon-blue transition-colors"
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

            {/* Status badge */}
            <div className="glass-card border border-green-500/20 p-5 flex items-center gap-4">
              <div className="flex-shrink-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
              </div>
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
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-card-strong border border-neon-blue/10 p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

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

                <FormField
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                />

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-70"
                  whileHover={status === 'idle' ? { scale: 1.01, y: -1 } : {}}
                  whileTap={status === 'idle' ? { scale: 0.99 } : {}}
                >
                  {/* Shimmer on hover */}
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
                        <span className="text-green-300">✓</span>
                        <span>Message Sent!</span>
                      </>
                    )}
                    {status === 'error' && (
                      <>
                        <span>✕ Error — Try Again</span>
                      </>
                    )}
                  </span>
                </motion.button>

                <p className="text-center font-mono text-xs text-slate-600">
                  Or email directly at{' '}
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
