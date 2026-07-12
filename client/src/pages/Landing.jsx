import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Network, Cpu, ShieldAlert, BarChart3, ChevronRight, Globe, Lock } from 'lucide-react';

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
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <Network className="text-background" size={20} />
            </div>
            <span className="font-bold text-lg tracking-wide">TransitOps</span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm font-medium text-text-secondary">
            <a href="#intelligence" className="hover:text-text-primary transition-colors">Intelligence</a>
            <a href="#nodes" className="hover:text-text-primary transition-colors">Nodes</a>
            <a href="#enterprise" className="hover:text-text-primary transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Request Console Access
            </Link>
            <Link to="/login" className="px-4 py-2 bg-primary text-background text-sm font-medium rounded-md hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              Launch Console
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 max-w-4xl flex flex-col items-center">
          
          <motion.div variants={fadeUp} className="px-4 py-1.5 rounded-full border border-surface-border bg-surface/50 text-xs font-medium text-primary mb-8 flex items-center space-x-2 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Intelligence V2.4 Powered by Neural Routing</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Intelligence-Driven <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Fleet Orchestration</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
            The high-performance command center for modern global logistics. 
            Real-time telemetry meets predictive AI to define the next era of operational efficiency.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center shadow-xl shadow-primary/20">
              Launch Command Console
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-surface border border-surface-border text-text-primary font-medium rounded-lg hover:bg-surface-border transition-colors flex items-center justify-center">
              Technical Specifications
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Intelligence Nodes */}
      <section id="nodes" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Intelligence Nodes</h2>
            <p className="text-text-secondary">Precision metrics and systems engineered for enterprise, scale fleet visibility.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface border border-surface-border rounded-xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-surface-border rounded-lg flex items-center justify-center mb-6 text-text-secondary group-hover:text-primary transition-colors">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Neural Telemetry</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">Continuous sync coordinates across global assets with multi-constellation GPS fallback.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-xs font-mono text-text-muted">SIGNAL INTEGRITY</span>
                <span className="text-sm font-mono font-bold text-text-primary">99.999%</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface border border-surface-border rounded-xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#81c995]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-surface-border rounded-lg flex items-center justify-center mb-6 text-text-secondary group-hover:text-[#81c995] transition-colors">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Automated Dispatch</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">Autonomous route matching utilizing probabilistic models for system-wide efficiency.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-xs font-mono text-text-muted">ALLOCATION DELTA</span>
                <span className="text-sm font-mono font-bold text-[#81c995]">+38% SHIFT</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-surface border border-surface-border rounded-xl p-6 relative group overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffb786]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 bg-surface-border rounded-lg flex items-center justify-center mb-6 text-text-secondary group-hover:text-[#ffb786] transition-colors">
                <ShieldAlert size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Predictive Health</h3>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">AI-driven component analysis identifying mechanical anomalies before failure occurs.</p>
              <div className="flex justify-between items-end border-t border-surface-border pt-4 mt-auto">
                <span className="text-xs font-mono text-text-muted">UPTIME FORECAST</span>
                <span className="text-sm font-mono font-bold text-[#ffb786]">+420 HRS</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Enterprise Hub (Zig Zag) */}
      <section id="enterprise" className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Hub</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              The ultimate high-contrast interface designed for rapid decision making. 
              Monitor thousands of concurrent operations from a single unified view.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                  <CheckIcon />
                </div>
                Real-time data visualization engine
              </li>
              <li className="flex items-center text-text-primary">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                  <CheckIcon />
                </div>
                Multi-region global fleet mapping
              </li>
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ perspective: '1000px' }}
            className="lg:w-1/2 relative"
          >
            {/* 3D Dashboard Mockup Effect */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full pointer-events-none transform translate-y-10" />
            <div className="relative bg-surface rounded-xl border border-surface-border shadow-2xl overflow-hidden transform-gpu hover:scale-[1.02] hover:rotate-1 transition-transform duration-500">
              
              {/* Mockup Topbar */}
              <div className="h-8 bg-background border-b border-surface-border flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#ffb4ab]" />
                <div className="w-3 h-3 rounded-full bg-[#ffb786]" />
                <div className="w-3 h-3 rounded-full bg-[#81c995]" />
              </div>
              
              {/* Mockup Body (Abstracted Dashboard) */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-4">
                  <div className="h-24 bg-background rounded-lg border border-surface-border p-3 flex flex-col justify-end">
                    <div className="w-1/2 h-3 bg-surface-border rounded mb-2" />
                    <div className="w-3/4 h-6 bg-primary/20 rounded" />
                  </div>
                  <div className="h-32 bg-background rounded-lg border border-surface-border p-3">
                    <div className="w-full h-full border-b border-l border-surface-border flex items-end justify-between px-2">
                      <div className="w-3 bg-status-available h-[40%]" />
                      <div className="w-3 bg-status-available h-[60%]" />
                      <div className="w-3 bg-status-available h-[30%]" />
                      <div className="w-3 bg-primary h-[80%]" />
                      <div className="w-3 bg-primary h-[100%]" />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-8 bg-background rounded border border-surface-border flex items-center px-3">
                    <div className="w-1/3 h-2 bg-surface-border rounded" />
                  </div>
                  <div className="h-48 bg-background rounded-lg border border-surface-border p-4">
                    <div className="space-y-3">
                      <div className="w-full h-6 bg-surface-border/50 rounded" />
                      <div className="w-full h-6 bg-surface-border/50 rounded" />
                      <div className="w-full h-6 bg-surface-border/50 rounded" />
                      <div className="w-full h-6 bg-surface-border/50 rounded" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Asset Registry (Zig Zag Reverse) */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50, rotateY: -10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ perspective: '1000px' }}
            className="lg:w-1/2 relative"
          >
             {/* 3D Laptop Mockup Effect */}
             <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full pointer-events-none transform translate-y-10" />
            <div className="relative bg-[#0d1015] rounded-xl border-4 border-[#272a31] shadow-2xl overflow-hidden transform-gpu hover:scale-[1.02] hover:-rotate-1 transition-transform duration-500 pb-12">
              {/* Screen Content */}
              <div className="p-4 border-b border-surface-border flex justify-between">
                <div className="w-1/4 h-4 bg-surface-border rounded" />
                <div className="flex space-x-2"><div className="w-4 h-4 bg-primary/20 rounded" /><div className="w-4 h-4 bg-primary/20 rounded" /></div>
              </div>
              <div className="p-4 space-y-4">
                <div className="h-10 bg-surface rounded border border-surface-border" />
                <div className="h-32 bg-surface rounded border border-surface-border flex items-center justify-center space-x-4">
                   <div className="w-20 h-20 rounded-full border-4 border-primary/30 border-t-primary animate-spin-slow" />
                   <div className="flex flex-col space-y-2">
                     <div className="w-32 h-4 bg-surface-border rounded" />
                     <div className="w-24 h-4 bg-surface-border rounded" />
                     <div className="w-40 h-4 bg-surface-border rounded" />
                   </div>
                </div>
              </div>
              {/* Laptop bottom lip */}
              <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-b from-[#272a31] to-[#10131a]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Asset Registry</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Granular control over your entire vehicle ecosystem. From heavy-duty long-haulers to urban electric fleets.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface border border-surface-border p-4 rounded-lg">
                <div className="text-3xl font-bold text-text-primary mb-1">4,281</div>
                <div className="text-xs font-mono text-text-muted">ACTIVE UNITS</div>
              </div>
              <div className="bg-surface border border-surface-border p-4 rounded-lg">
                <div className="text-3xl font-bold text-[#81c995] mb-1">99.2%</div>
                <div className="text-xs font-mono text-text-muted">RELIABILITY</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-surface border border-surface-border rounded-2xl p-12 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50" />
          
          <h2 className="text-4xl font-bold mb-6 relative z-10">Command the Future</h2>
          <p className="text-text-secondary mb-10 max-w-lg mx-auto relative z-10">
            Join the global leaders orchestrating the next generation of logistics with the TransitOps intelligence platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
            <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              Request Console Access
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3 bg-background border border-surface-border text-text-primary font-medium rounded-lg hover:bg-surface-border transition-colors">
              View Network Map
            </Link>
          </div>
          
          <div className="mt-8 text-xs font-mono text-text-muted relative z-10">
            READY FOR ENTERPRISE DEPLOYMENT
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-background pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <Network className="text-background" size={14} />
              </div>
              <span className="font-bold tracking-wide">TransitOps</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Advancing global commerce through deep intelligence, real-time telemetry, and automated fleet orchestration.
            </p>
            <div className="flex space-x-4 text-text-muted">
              {/* Social icons mocked */}
              <Globe size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Network size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Lock size={18} className="hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest text-text-primary mb-6">PLATFORM</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Command Console</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neural Registry</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Route Engine</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Edge Telemetry</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest text-text-primary mb-6">INTELLIGENCE</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Quantum Routing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Predictive Hub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety Protocols</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Global Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest text-text-primary mb-6">CORPORATE</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Security Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SLA Agreement</a></li>
            </ul>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto border-t border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted">
          <p>© 2024 TransitOps Intelligence Systems. Secure Channel J-9.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-text-primary">System Access</a>
            <a href="#" className="hover:text-text-primary">Compliance</a>
            <a href="#" className="hover:text-text-primary">Registry</a>
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
