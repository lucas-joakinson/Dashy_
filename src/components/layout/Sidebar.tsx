import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { toggleSidebar } from '../../features/ui/uiSlice';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((state) => state.ui);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Products', icon: Package, path: '/products' },
  ];

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => dispatch(toggleSidebar())}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-surface/80 backdrop-blur-xl border-r border-border-primary transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-20 px-8 border-b border-border-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-glow-purple">
              <h1 className='font-bold flex items-center justify-center text-primary text-xl'>D_</h1>
            </div>
            <span className="text-xl font-bold font-mono tracking-tight text-primary">
              DASHY<span className="text-primary-400">_</span>
            </span>
          </div>
          <button 
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-500/10 text-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && dispatch(toggleSidebar())}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "text-primary-500 bg-primary-500/10 border border-primary-500/20 shadow-glow-purple"
                    : "text-text-secondary hover:text-text-primary hover:bg-hover-bg"
                )
              }
            >
              <item.icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                "group-hover:text-primary-400"
              )} />
              {item.name}
              <div className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full scale-y-0 group-[.active]:scale-y-100 transition-transform" />
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-border-primary">
          <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-hover-bg border border-border-primary">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-border-primary flex items-center justify-center text-primary-400 font-bold text-sm shadow-inner">
              LP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-text-primary">Lucas Pires</span>
              <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Administrator</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
