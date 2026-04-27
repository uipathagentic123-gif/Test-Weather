/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  Wind, 
  Droplet, 
  Thermometer, 
  ChevronRight, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCcw,
  Factory,
  Truck,
  CloudSun
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRegionalWeatherAnalysis } from './services/geminiService';
import { PRODUCTS } from './constants';
import { Advisory, WeatherData } from './types';

export default function App() {
  const [location, setLocation] = useState('New York');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRegionalWeatherAnalysis(loc);
      setWeatherData(result.weather);
      setAdvisory(result.advisory);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. Please check your network or try a different region.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performAnalysis(location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(location);
  };

  const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);

  return (
    <div className="min-h-screen tech-grid flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-blue-500 uppercase flex items-center gap-2">
            <Factory className="w-6 h-6" />
            Vanguard Supply Pulse
          </h1>
          <p className="text-sm text-zinc-500 font-mono">INTELLIGENT MANUFACTURING & LOGISTICS ADVISORY</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search region..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : "Analyze"}
          </button>
        </form>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Status */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CloudSun className="w-24 h-24" />
            </div>
            <h2 className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest mb-6">Regional Metrics</h2>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-zinc-800 rounded w-1/2" />
                <div className="h-4 bg-zinc-800 rounded w-full" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-12 bg-zinc-800 rounded" />
                  <div className="h-12 bg-zinc-800 rounded" />
                  <div className="h-12 bg-zinc-800 rounded" />
                </div>
              </div>
            ) : weatherData ? (
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-display font-bold">{weatherData.location}</p>
                  <p className="text-zinc-400 text-sm mt-1">{weatherData.condition}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <Thermometer className="w-4 h-4 text-orange-500 mb-2" />
                    <p className="text-xs text-zinc-500 font-mono">TEMP</p>
                    <p className="text-lg font-display font-medium">{weatherData.temp}°C</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <Droplet className="w-4 h-4 text-blue-500 mb-2" />
                    <p className="text-xs text-zinc-500 font-mono">HUMIDITY</p>
                    <p className="text-lg font-display font-medium">{weatherData.humidity}%</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <Wind className="w-4 h-4 text-emerald-500 mb-2" />
                    <p className="text-xs text-zinc-500 font-mono">WIND</p>
                    <p className="text-lg font-display font-medium">MOD</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <p className="text-xs font-mono text-blue-400 uppercase mb-2">Climate Pulse</p>
                  <p className="text-sm text-zinc-300 leading-relaxed italic">"{weatherData.forecastSummary}"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Initiate region search to begin analysis</p>
              </div>
            )}
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 h-fit">
            <h2 className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest mb-4">Operations Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 uppercase">Analysis Precision</span>
                <span className="text-emerald-500">98.4%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98.4%]" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 uppercase">System Latency</span>
                <span className="text-zinc-300">12ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* Advisory Content */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          {/* Immediate Logistics */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-display font-bold">Immediate Supply Directives</h2>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-zinc-800 rounded-xl" />)}
              </div>
            ) : advisory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advisory.immediateSupply.map((item, idx) => {
                  const product = getProduct(item.productId);
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-start gap-4 hover:border-zinc-700 transition-colors"
                    >
                      <div className={`mt-1 h-3 w-3 rounded-full shrink-0 ${
                        item.priority === 'High' ? 'bg-red-500' : 
                        item.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-zinc-200 font-bold mb-1">{product?.name}</p>
                        <p className="text-xs text-zinc-500 leading-snug">{item.reason}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">System awaiting geographic input parameters...</p>
            )}
          </div>

          {/* Manufacturing Pipeline */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Factory className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-display font-bold">Manufacturing Advisory (3M Horizon)</h2>
            </div>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map(i => <div key={i} className="h-24 bg-zinc-800 rounded-xl" />)}
              </div>
            ) : advisory ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2 py-1 bg-zinc-950 w-fit rounded border border-zinc-800 mb-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">Current Phase: April 27</span>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-tighter">Target Horizon: Late July</span>
                </div>
                
                {advisory.manufacturingAdvice.map((item, idx) => {
                  const product = getProduct(item.productId);
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx + 4) * 0.1 }}
                      className="group relative"
                    >
                      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:bg-zinc-950/50 transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold font-display">{product?.name}</span>
                            <span className="text-[10px] py-0.5 px-2 bg-zinc-900 rounded-full text-zinc-500 uppercase font-mono">{product?.category}</span>
                          </div>
                          <p className="text-sm text-zinc-400 max-w-md">{item.rationale}</p>
                        </div>
                        
                        <div className={`flex items-center gap-3 py-3 px-6 rounded-xl border ${
                          item.action === 'Increase' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          item.action === 'Decrease' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                          'bg-zinc-800/10 border-zinc-800 text-zinc-400'
                        }`}>
                          <div className="text-right">
                            <p className="text-[10px] font-mono uppercase tracking-widest opacity-60">STRATEGY</p>
                            <p className="text-sm font-bold uppercase">{item.action}</p>
                          </div>
                          {item.action === 'Increase' ? <ArrowUpRight className="w-6 h-6" /> : 
                           item.action === 'Decrease' ? <ArrowDownRight className="w-6 h-6" /> : 
                           <RefreshCcw className="w-5 h-5 opacity-40" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">Waiting for supply chain telemetry...</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="w-full max-w-6xl mt-12 pt-6 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-600 mb-8">
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><Droplet className="w-3 h-3" /> DATA SYNC: ACTIVE</span>
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> ANALYTICS: CALIBRATED</span>
        </div>
        <p>© 2026 VANGUARD SYSTEMS OVERVIEW • INTERNAL LOGISTICS ONLY</p>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 p-4 bg-red-900 border border-red-700 text-white rounded-xl shadow-2xl flex items-center gap-3 z-50"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-4 p-1 hover:bg-white/10 rounded">
              < RefreshCcw className="w-3 h-3 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
