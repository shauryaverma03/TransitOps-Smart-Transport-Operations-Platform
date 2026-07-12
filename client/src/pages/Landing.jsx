import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Network, Cpu, ShieldAlert, BarChart3, ChevronRight, Globe, Lock, Truck, Users, Map, TrendingUp, Activity, Fuel, Wrench, ArrowUpRight } from 'lucide-react';

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary selection:text-background overflow-hidden font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-surface-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/25">
              <Truck className="text-background" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">TransitOps</span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm font-medium text-text-secondary">
            <a href="#intelligence" className="hover:text-text-primary transition-colors">Intelligence</a>
            <a href="#nodes" className="hover:text-text-primary transition-colors">Nodes</a>
            <a href="#enterprise" className="hover:text-text-primary transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/login" className="px-5 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-lg shadow-primary/25">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 flex flex-col items-center text-center">
        {/* Background ambient glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-status-inshop/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="px-4 py-1.5 rounded-full border border-surface-border bg-surface/50 text-xs font-semibold text-primary mb-8 flex items-center space-x-2 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Intelligence V2.4 · Neural Routing Engine Active</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Intelligence-Driven <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#c4d8ff] to-primary-hover">Fleet Orchestration</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
            The high-performance command center for modern global logistics. 
            Real-time telemetry meets predictive AI to define the next era of operational efficiency.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-background font-semibold rounded-xl hover:bg-primary-hover transition-all duration-200 flex items-center justify-center shadow-xl shadow-primary/25 text-sm">
              Launch Command Console
              <ArrowUpRight size={16} className="ml-2" />
            </Link>
            <a href="#enterprise" className="w-full sm:w-auto px-8 py-3.5 bg-surface/80 border border-surface-border text-text-primary font-semibold rounded-xl hover:bg-surface-border transition-all duration-200 flex items-center justify-center text-sm backdrop-blur-sm">
              Explore Platform
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 mt-20 max-w-3xl w-full grid grid-cols-3 gap-4"
        >
          {[
            { label: 'VEHICLES TRACKED', value: '12,400+', color: 'text-primary' },
            { label: 'OPERATIONAL UPTIME', value: '99.97%', color: 'text-status-available' },
            { label: 'COST REDUCTION', value: '34%', color: 'text-status-inshop' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-sm border border-surface-border rounded-xl p-4 text-center">
              <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Core Intelligence Nodes */}
      <section id="nodes" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 rounded-full border border-surface-border bg-surface/50 text-[10px] font-mono font-semibold text-primary tracking-wider mb-4">SYSTEM ARCHITECTURE</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Intelligence Nodes</h2>
            <p className="text-text-secondary max-w-lg mx-auto">Precision metrics and systems engineered for enterprise-scale fleet visibility.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary/20 transition-colors">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Neural Telemetry</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">Continuous sync coordinates across global assets with multi-constellation GPS fallback.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">SIGNAL INTEGRITY</span>
                <span className="text-sm font-mono font-bold text-text-primary">99.999%</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-status-available/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-status-available/10 rounded-xl flex items-center justify-center mb-6 text-status-available group-hover:bg-status-available/20 transition-colors">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Dispatch</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">Autonomous route matching utilizing probabilistic models for system-wide efficiency.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">ALLOCATION DELTA</span>
                <span className="text-sm font-mono font-bold text-status-available">+38% SHIFT</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface/80 backdrop-blur-md border border-surface-border rounded-2xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-status-inshop/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-status-inshop/10 rounded-xl flex items-center justify-center mb-6 text-status-inshop group-hover:bg-status-inshop/20 transition-colors">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Predictive Health</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">AI-driven component analysis identifying mechanical anomalies before failure occurs.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">UPTIME FORECAST</span>
                <span className="text-sm font-mono font-bold text-status-inshop">+420 HRS</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Enterprise Hub Section */}
      <section id="enterprise" className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <span className="inline-block px-3 py-1 rounded-full border border-surface-border bg-surface/50 text-[10px] font-mono font-semibold text-primary tracking-wider mb-4">COMMAND CENTER</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Hub</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              The ultimate high-contrast interface designed for rapid decision making. 
              Monitor thousands of concurrent operations from a single unified view.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon />
                </div>
                Real-time data visualization engine
              </li>
              <li className="flex items-center text-text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon />
                </div>
                Multi-region global fleet mapping
              </li>
              <li className="flex items-center text-text-primary">
                <div className="w-6 h-6 rounded-full bg-status-available/20 text-status-available flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon />
                </div>
                Role-based access with 4 operator tiers
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ perspective: '1000px' }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-primary/15 blur-[80px] rounded-full pointer-events-none transform translate-y-10" />
            <div className="relative bg-surface rounded-2xl border border-surface-border shadow-2xl overflow-hidden transform-gpu hover:scale-[1.02] hover:rotate-1 transition-transform duration-500">
              
              {/* Window Chrome */}
              <div className="h-10 bg-background border-b border-surface-border flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-status-inshop/80" />
                <div className="w-3 h-3 rounded-full bg-status-available/80" />
                <span className="ml-4 text-[10px] font-mono text-text-muted">transitops.io/dashboard</span>
              </div>
              
              {/* Realistic Dashboard Content */}
              <div className="p-5">
                {/* KPI Row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Active Fleet', val: '847', icon: Truck, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'On Route', val: '312', icon: Activity, color: 'text-status-available', bg: 'bg-status-available/10' },
                    { label: 'In Maint.', val: '23', icon: Wrench, color: 'text-status-inshop', bg: 'bg-status-inshop/10' },
                    { label: 'Utilization', val: '94%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-background rounded-lg border border-surface-border p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-mono text-text-muted uppercase">{kpi.label}</span>
                        <div className={`w-5 h-5 rounded ${kpi.bg} flex items-center justify-center`}>
                          <kpi.icon size={10} className={kpi.color} />
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${kpi.color}`}>{kpi.val}</div>
                    </div>
                  ))}
                </div>
                
                {/* Chart area */}
                <div className="bg-background rounded-lg border border-surface-border p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Revenue · Last 7 Months</span>
                    <span className="text-[9px] font-mono text-status-available">+12.4%</span>
                  </div>
                  <div className="flex items-end justify-between h-24 gap-2">
                    {[35, 52, 44, 68, 58, 82, 74].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full rounded-t-sm ${i === 5 ? 'bg-primary' : 'bg-primary/30'}`}
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-[7px] font-mono text-text-muted mt-1">{['J','F','M','A','M','J','J'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini table */}
                <div className="bg-background rounded-lg border border-surface-border overflow-hidden">
                  <div className="px-3 py-2 border-b border-surface-border">
                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Recent Dispatches</span>
                  </div>
                  {[
                    { id: 'TRP-4821', route: 'Mumbai → Delhi', status: 'Dispatched', color: 'text-status-ontrip bg-status-ontrip/15' },
                    { id: 'TRP-4820', route: 'LA → Chicago', status: 'Completed', color: 'text-status-available bg-status-available/15' },
                    { id: 'TRP-4819', route: 'Berlin → Paris', status: 'Dispatched', color: 'text-status-ontrip bg-status-ontrip/15' },
                  ].map((trip, i) => (
                    <div key={i} className="px-3 py-2 flex items-center justify-between border-b border-surface-border/50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-[9px] font-mono font-semibold text-primary">{trip.id}</span>
                        <span className="text-[9px] text-text-secondary">{trip.route}</span>
                      </div>
                      <span className={`text-[8px] font-semibold px-2 py-0.5 rounded-full ${trip.color}`}>{trip.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Asset Registry Section */}
      <section className="py-24 px-6 bg-surface/20">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: -10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ perspective: '1000px' }}
            className="lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-status-available/10 blur-[80px] rounded-full pointer-events-none transform translate-y-10" />
            <div className="relative bg-surface rounded-2xl border border-surface-border shadow-2xl overflow-hidden transform-gpu hover:scale-[1.02] hover:-rotate-1 transition-transform duration-500">
              
              {/* Window Chrome */}
              <div className="h-10 bg-background border-b border-surface-border flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-status-inshop/80" />
                <div className="w-3 h-3 rounded-full bg-status-available/80" />
                <span className="ml-4 text-[10px] font-mono text-text-muted">transitops.io/fleet</span>
              </div>
              
              {/* Fleet Registry Content */}
              <div className="p-5">
                {/* Search bar */}
                <div className="bg-background rounded-lg border border-surface-border p-2.5 flex items-center mb-4">
                  <div className="w-4 h-4 text-text-muted mr-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  </div>
                  <span className="text-[9px] text-text-muted">Search fleet by name or registration...</span>
                </div>

                {/* Vehicle Cards */}
                <div className="space-y-3">
                  {[
                    { reg: 'TR-992-XD', name: 'Freightliner Cascadia', type: 'Heavy Duty', status: 'Available', statusColor: 'text-status-available bg-status-available/15', km: '42,109 km', capacity: '25,000 kg' },
                    { reg: 'EV-441-LL', name: 'Tesla Semi Pro', type: 'Electric Van', status: 'On Trip', statusColor: 'text-status-ontrip bg-status-ontrip/15', km: '12,440 km', capacity: '36,000 kg' },
                    { reg: 'MK-812-ZZ', name: 'Mack Anthem 2023', type: 'Long Haul', status: 'In Shop', statusColor: 'text-status-inshop bg-status-inshop/15', km: '198,321 km', capacity: '28,000 kg' },
                    { reg: 'SC-770-AB', name: 'Scania R-Series', type: 'Heavy Duty', status: 'Available', statusColor: 'text-status-available bg-status-available/15', km: '8,102 km', capacity: '30,000 kg' },
                  ].map((v, i) => (
                    <div key={i} className="bg-background rounded-lg border border-surface-border p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Truck size={14} className="text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold text-text-primary">{v.reg}</span>
                            <span className="text-[9px] text-text-secondary">· {v.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[8px] text-text-muted">{v.type}</span>
                            <span className="text-[8px] text-text-muted">·</span>
                            <span className="text-[8px] text-text-muted">{v.km}</span>
                            <span className="text-[8px] text-text-muted">·</span>
                            <span className="text-[8px] text-text-muted">{v.capacity}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[8px] font-semibold px-2 py-1 rounded-full ${v.statusColor}`}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <span className="inline-block px-3 py-1 rounded-full border border-surface-border bg-surface/50 text-[10px] font-mono font-semibold text-status-available tracking-wider mb-4">FLEET MANAGEMENT</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Asset Registry</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Granular control over your entire vehicle ecosystem. From heavy-duty long-haulers to urban electric fleets.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface/80 backdrop-blur-sm border border-surface-border p-5 rounded-xl">
                <div className="text-3xl font-bold text-text-primary mb-1">4,281</div>
                <div className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">ACTIVE UNITS</div>
              </div>
              <div className="bg-surface/80 backdrop-blur-sm border border-surface-border p-5 rounded-xl">
                <div className="text-3xl font-bold text-status-available mb-1">99.2%</div>
                <div className="text-[10px] font-mono font-semibold text-text-muted tracking-wider">RELIABILITY</div>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-text-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-status-available/20 text-status-available flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon />
                </div>
                Full lifecycle tracking from acquisition to retirement
              </li>
              <li className="flex items-center text-text-primary text-sm">
                <div className="w-6 h-6 rounded-full bg-status-inshop/20 text-status-inshop flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckIcon />
                </div>
                Automated maintenance scheduling & alerts
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-surface/80 backdrop-blur-md border border-surface-border rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Command the Future</h2>
          <p className="text-text-secondary mb-10 max-w-lg mx-auto relative z-10 text-lg">
            Join global leaders orchestrating the next generation of logistics with the TransitOps intelligence platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-background font-semibold rounded-xl hover:bg-primary-hover transition-all duration-200 shadow-xl shadow-primary/25 text-sm flex items-center justify-center">
              Request Console Access
              <ArrowUpRight size={16} className="ml-2" />
            </Link>
            <a href="#nodes" className="w-full sm:w-auto px-8 py-3.5 bg-background border border-surface-border text-text-primary font-semibold rounded-xl hover:bg-surface-border transition-all duration-200 text-sm flex items-center justify-center">
              View Architecture
            </a>
          </div>
          
          <div className="mt-10 text-[10px] font-mono font-semibold text-text-muted relative z-10 tracking-widest">
            ENTERPRISE-GRADE · SOC 2 · ISO 27001
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-background pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-md shadow-primary/20">
                <Truck className="text-background" size={14} />
              </div>
              <span className="font-bold tracking-tight">TransitOps</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Advancing global commerce through deep intelligence, real-time telemetry, and automated fleet orchestration.
            </p>
            <div className="flex space-x-4 text-text-muted">
              <Globe size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Network size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Lock size={18} className="hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[11px] tracking-widest text-text-primary mb-6">PLATFORM</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Command Console</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neural Registry</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Route Engine</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Edge Telemetry</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[11px] tracking-widest text-text-primary mb-6">INTELLIGENCE</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Predictive Routing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Health Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety Protocols</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Global Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[11px] tracking-widest text-text-primary mb-6">CORPORATE</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Security Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SLA Agreement</a></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
          <p>© 2024 TransitOps Intelligence Systems. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper SVG Icon
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Landing;
