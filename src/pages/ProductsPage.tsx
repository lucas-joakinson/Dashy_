import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHook';
import { 
  fetchProducts, 
  setSearchQuery, 
  setSelectedCategory,
  setSortBy
} from '../features/products/productsSlice';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';
import { Search, Star, ShoppingBag, ArrowRight, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    products, 
    status, 
    searchQuery, 
    selectedCategory,
    sortBy
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const categories = useMemo(() => {
    const cats = products.map(p => p.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-text-primary leading-tight">Product Inventory</h2>
            <p className="text-text-secondary mt-1 font-mono text-xs uppercase tracking-widest">Global catalog management</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-hover-bg border border-border-primary text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-mono text-sm"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border-primary/50">
          <div className="flex items-center gap-2 text-text-secondary mr-2">
            <SlidersHorizontal size={16} />
            <span className="text-xs font-mono uppercase tracking-wider">Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2 flex-1">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setSelectedCategory(category))}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all border ${
                  selectedCategory === category
                    ? 'bg-primary-500/10 border-primary-500/50 text-primary-400 shadow-glow-purple/20'
                    : 'bg-hover-bg border-border-primary text-text-secondary hover:border-primary-500/30'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value as any))}
              className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-hover-bg border border-border-primary text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
            >
              <option value="none">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={14} />
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {status === 'loading' ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full overflow-hidden border-border-primary" hover={false}>
                <Skeleton className="h-56 w-full rounded-none" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" count={2} />
                  <div className="flex justify-between items-center pt-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="group flex flex-col h-[460px] cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="relative h-56 overflow-hidden bg-hover-bg">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="backdrop-blur-md bg-white/80 dark:bg-black/40">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-sans">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Asset Value</span>
                          <span className="text-2xl font-bold text-text-primary font-mono">
                            ${product.price}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Stability</span>
                          <div className="flex items-center gap-1 text-primary-400 text-sm font-bold font-mono">
                            <Star size={12} fill="currentColor" />
                            {product.rating}
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 rounded-xl bg-hover-bg border border-border-primary text-xs font-mono font-bold uppercase tracking-wider text-text-secondary group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-400 group-hover:shadow-glow-purple transition-all flex items-center justify-center gap-2">
                        Analyze Specs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Effects */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-secondary bg-hover-bg rounded-[2rem] border border-dashed border-border-primary">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No results found.</p>
              <button 
                onClick={() => {
                  dispatch(setSearchQuery(''));
                  dispatch(setSelectedCategory('all'));
                  dispatch(setSortBy('none'));
                }}
                className="mt-4 text-primary-400 hover:underline font-mono text-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
