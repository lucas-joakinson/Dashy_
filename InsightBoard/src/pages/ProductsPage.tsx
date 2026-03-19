import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHook';
import { 
  fetchProducts, 
  fetchCategories, 
  setSearchQuery, 
  setSelectedCategory 
} from '../features/products/productsSlice';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';
import { Search, Filter, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    status, 
    searchQuery, 
    selectedCategory 
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white glow-text leading-tight">Product Inventory</h2>
          <p className="text-gray-400 mt-1 font-mono text-xs uppercase tracking-widest">Global catalog management</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="System search..."
              className="w-full sm:w-64 pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all font-mono text-sm"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              className="w-full sm:w-48 pl-12 pr-10 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer font-mono text-sm hover:bg-white/10 transition-all"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-surface text-white">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {status === 'loading' ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col h-full overflow-hidden border-white/5" hover={false}>
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
                  <div className="relative h-56 overflow-hidden bg-white/5">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="default" className="backdrop-blur-md bg-black/40">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Asset Value</span>
                          <span className="text-2xl font-bold text-white font-mono">
                            ${product.price}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Stability</span>
                          <div className="flex items-center gap-1 text-primary-400 text-sm font-bold font-mono">
                            <Star size={12} fill="currentColor" />
                            {product.rating}
                          </div>
                        </div>
                      </div>

                      <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-gray-400 group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-400 group-hover:shadow-glow-purple transition-all flex items-center justify-center gap-2">
                        Analyze Specs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Effects */}
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-glow-purple">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-600 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No results found in current sector.</p>
              <button 
                onClick={() => {
                  dispatch(setSearchQuery(''));
                  dispatch(setSelectedCategory('All'));
                }}
                className="mt-4 text-primary-400 hover:underline font-mono text-sm"
              >
                Reset System Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
