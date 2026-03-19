import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHook';
import { fetchUsers } from '../features/users/usersSlice';
import { fetchProducts } from '../features/products/productsSlice';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { Users, Package, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { total: totalUsers, status: usersStatus } = useAppSelector((state) => state.users);
  const { products, total: totalProducts, status: productsStatus } = useAppSelector((state) => state.products);

  const isLoading = usersStatus === 'loading' || productsStatus === 'loading';
  const hasError = usersStatus === 'failed' || productsStatus === 'failed';

  useEffect(() => {
    if (usersStatus === 'idle') dispatch(fetchUsers());
    if (productsStatus === 'idle') dispatch(fetchProducts());
  }, [dispatch, usersStatus, productsStatus]);

  const productStats = useMemo(() => {
    if (!products.length) return { categories: [], prices: [] };

    // Products per category
    const categoryMap = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Price distribution (binned)
    const priceBins = [
      { range: '0-50', count: 0 },
      { range: '51-200', count: 0 },
      { range: '201-500', count: 0 },
      { range: '501-1000', count: 0 },
      { range: '1000+', count: 0 },
    ];

    products.forEach(p => {
      if (p.price <= 50) priceBins[0].count++;
      else if (p.price <= 200) priceBins[1].count++;
      else if (p.price <= 500) priceBins[2].count++;
      else if (p.price <= 1000) priceBins[3].count++;
      else priceBins[4].count++;
    });

    return { categories, prices: priceBins };
  }, [products]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-rose-500">
        <AlertCircle size={64} className="mb-6 opacity-20" />
        <h2 className="text-2xl font-bold glow-text">Initialization Error</h2>
        <p className="text-text-secondary mt-2">Could not synchronize with the analytics server.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500/20 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <header>
        <h2 className="text-3xl font-bold text-text-primary glow-text">Ecosystem Health</h2>
        <p className="text-text-secondary mt-1 font-mono text-xs uppercase tracking-widest">Real-time performance metrics</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Users" 
          value={totalUsers} 
          icon={<Users size={24} />} 
          loading={isLoading} 
          trend="+12.5%"
          color="primary"
        />
        <StatCard 
          title="Inventory Assets" 
          value={totalProducts} 
          icon={<Package size={24} />} 
          loading={isLoading} 
          trend="+3.2%"
          color="emerald"
        />
        <StatCard 
          title="Market Capital" 
          value={`$${(totalProducts * 452).toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          loading={isLoading} 
          trend="+8.1%"
          color="amber"
        />
        <StatCard 
          title="Growth Velocity" 
          value="98.2%" 
          icon={<TrendingUp size={24} />} 
          loading={isLoading} 
          trend="+2.4%"
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 h-[450px] flex flex-col group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary glow-text">Sector Distribution</h3>
              <p className="text-xs font-mono text-primary-400/60 uppercase tracking-widest">Top Product Categories</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-hover-bg border border-border-primary flex items-center justify-center text-primary-400">
              <Package size={20} />
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
             {isLoading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productStats.categories} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{fill: 'currentColor', fontSize: 11, fontFamily: 'JetBrains Mono'}} 
                    width={100}
                    className="text-text-secondary"
                  />
                  <Tooltip 
                     cursor={{fill: 'rgba(139, 92, 246, 0.05)'}}
                     contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        borderColor: 'rgba(139, 92, 246, 0.2)', 
                        borderRadius: '16px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                     }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8b5cf6" 
                    radius={[0, 8, 8, 0]} 
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
             )}
          </div>
        </Card>

        <Card className="p-8 h-[450px] flex flex-col group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary glow-text">Price Dynamics</h3>
              <p className="text-xs font-mono text-indigo-400/60 uppercase tracking-widest">Inventory Valuation Spreads</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-hover-bg border border-border-primary flex items-center justify-center text-indigo-400">
              <DollarSign size={20} />
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
             {isLoading ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productStats.prices}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" vertical={false} />
                  <XAxis 
                    dataKey="range" 
                    tick={{fill: 'currentColor', fontSize: 10, fontFamily: 'JetBrains Mono'}} 
                    axisLine={false}
                    tickLine={false}
                    className="text-text-secondary"
                  />
                  <YAxis 
                    tick={{fill: 'currentColor', fontSize: 10, fontFamily: 'JetBrains Mono'}} 
                    axisLine={false}
                    tickLine={false}
                    className="text-text-secondary"
                  />
                  <Tooltip 
                     contentStyle={{ 
                        backgroundColor: 'var(--surface)', 
                        borderColor: 'rgba(99, 102, 241, 0.2)', 
                        borderRadius: '16px',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                     }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
             )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, loading, trend, color }: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  loading: boolean,
  trend: string,
  color: 'primary' | 'emerald' | 'amber' | 'indigo'
}) {
  const colorMap = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <Card className="p-6 relative group border-border-primary hover:border-border-secondary" hover={true}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono font-semibold text-text-secondary uppercase tracking-widest mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-9 w-24 mt-2" />
          ) : (
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-text-primary tracking-tight">{value}</span>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                {trend} <span className="text-text-secondary opacity-50">vs last cycle</span>
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl border ${colorMap[color]} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
