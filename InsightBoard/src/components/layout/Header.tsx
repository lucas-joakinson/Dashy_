import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { toggleSidebar, toggleTheme } from '../../features/ui/uiSlice';
import { useLocation } from 'react-router-dom';

export function Header() {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useAppSelector((state) => state.ui);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/products') return 'Product Inventory';
    if (path.startsWith('/products/')) return 'Product Details';
    return 'InsightBoard';
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-8 bg-background/80 backdrop-blur-md border-b border-border-primary">
      <div className="flex items-center gap-6">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 rounded-xl bg-hover-bg border border-border-primary hover:border-primary-500/30 text-text-secondary hover:text-primary-400 transition-all lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-text-primary glow-text leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] font-mono text-text-secondary uppercase tracking-widest hidden sm:block">
            Management & Analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl bg-hover-bg border border-border-primary hover:border-primary-500/30 text-text-secondary hover:text-primary-400 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-background shadow-glow-purple" />
        </button>
        
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2.5 rounded-xl bg-hover-bg border border-border-primary hover:border-primary-500/30 text-text-secondary hover:text-primary-400 transition-all"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
