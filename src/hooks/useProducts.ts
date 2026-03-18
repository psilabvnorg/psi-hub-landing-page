import { useState, useEffect } from 'react';
import type { ProductsConfig } from '@/types/product';

export function useProducts() {
  const [config, setConfig] = useState<ProductsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config/products.json');
        if (!response.ok) {
          throw new Error('Failed to load products configuration');
        }
        const data: ProductsConfig = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
