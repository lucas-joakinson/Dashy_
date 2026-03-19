import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/storeHook';
import { fetchProductById, clearSelectedProduct } from '../features/products/productsSlice';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { Badge } from '../components/Badge';
import { 
  ArrowLeft, Star, ShoppingCart, ShieldCheck, 
  Truck, RefreshCcw, Box, Tag, Layers 
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct, detailsStatus, error } = useAppSelector((state) => state.products);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.images[0] || selectedProduct.thumbnail);
    }
  }, [selectedProduct]);

  if (detailsStatus === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-rose-500">
        <Box size={64} className="mb-6 opacity-20" />
        <h2 className="text-2xl font-bold">Analysis Failed</h2>
        <p className="text-text-secondary mt-2">{error || 'Data packet lost during transmission.'}</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-8 px-6 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 hover:bg-primary-500/20 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Return to Inventory
        </button>
      </div>
    );
  }

  const isLoading = detailsStatus === 'loading' || !selectedProduct;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="space-y-8"
    >
      <button 
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-text-secondary hover:text-primary-400 transition-colors font-mono text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        BACK_TO_INVENTORY
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Visual Assets Sector */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-4 bg-hover-bg border-border-primary overflow-hidden group" hover={false}>
            {isLoading ? (
              <Skeleton className="aspect-video w-full" />
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/20">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={activeImage} 
                  alt={selectedProduct.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-6 left-6">
                  <Badge variant="success" className="bg-emerald-500/10 dark:bg-emerald-500/20">
                    Live Status
                  </Badge>
                </div>
              </div>
            )}
          </Card>

          <div className="grid grid-cols-4 gap-4">
            {isLoading ? (
              <Skeleton count={4} className="h-24 w-full" />
            ) : (
              selectedProduct.images.slice(0, 4).map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-primary-500' : 'border-border-primary hover:border-border-secondary'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Technical Specs Sector */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{selectedProduct.brand}</Badge>
                  <Badge variant="default" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    {selectedProduct.category}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-text-primary tracking-tight leading-tight">
                  {selectedProduct.title}
                </h1>
                <p className="text-text-secondary leading-relaxed">
                  {selectedProduct.description}
                </p>
              </>
            )}
          </div>

          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-600/20 to-indigo-600/10 border border-primary-500/20 relative overflow-hidden">
             {isLoading ? (
               <Skeleton className="h-12 w-32" />
             ) : (
               <div className="flex items-end justify-between relative z-10">
                 <div className="flex flex-col">
                   <span className="text-xs font-mono text-primary-400 uppercase tracking-widest mb-1">Market Valuation</span>
                   <div className="flex items-center gap-3">
                     <span className="text-5xl font-bold text-text-primary font-mono">${selectedProduct.price}</span>
                     <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                       -{selectedProduct.discountPercentage}%
                     </span>
                   </div>
                 </div>
                 <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-amber-400 mb-1">
                     <Star size={16} fill="currentColor" />
                     <span className="font-bold font-mono">{selectedProduct.rating}</span>
                   </div>
                   <span className="text-[10px] font-mono text-text-secondary uppercase">Customer Confidence</span>
                 </div>
               </div>
             )}
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SpecItem icon={<Layers size={18} />} label="Stock Levels" value={isLoading ? '...' : `${selectedProduct.stock} Units`} />
            <SpecItem icon={<Tag size={18} />} label="Unit ID" value={isLoading ? '...' : `#${id?.padStart(4, '0')}`} />
            <SpecItem icon={<Truck size={18} />} label="Distribution" value="Express Global" />
            <SpecItem icon={<ShieldCheck size={18} />} label="Warranty" value="2-Year Enterprise" />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 rounded-2xl bg-primary-500 text-white font-bold font-mono uppercase tracking-wider hover:bg-primary-400 transition-all flex items-center justify-center gap-2">
              <ShoppingCart size={20} /> Deploy Asset
            </button>
            <button className="p-4 rounded-2xl bg-hover-bg border border-border-primary text-text-secondary hover:text-text-primary hover:bg-hover-bg/2 transition-all">
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Extended Details */}
      {!isLoading && (
        <Card className="p-10 border-border-primary mt-10" hover={false}>
          <h3 className="text-xl font-bold text-text-primary mb-8 flex items-center gap-3">
             <div className="w-2 h-8 bg-primary-500 rounded-full" />
             TECHNICAL_MANIFESTO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <h4 className="text-primary-400 font-mono text-xs uppercase tracking-widest">Authentication</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every unit undergoes rigorous cryptographic verification to ensure hardware integrity and genuine origin tracking within the global supply chain.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-indigo-400 font-mono text-xs uppercase tracking-widest">Global Logistics</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Automated fulfillment protocols prioritize low-latency delivery paths, utilizing decentralized distribution centers for maximum efficiency.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-emerald-400 font-mono text-xs uppercase tracking-widest">Compliance</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                Certified under ISO-9001 and Tier-1 environmental standards, maintaining the highest level of corporate responsibility and safety.
              </p>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-hover-bg border border-border-primary flex items-center gap-4">
      <div className="text-primary-400 opacity-60">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-text-primary">{value}</span>
      </div>
    </div>
  );
}
