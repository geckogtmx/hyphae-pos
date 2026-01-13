
import { useState, useEffect, useCallback } from 'react';
import { Concept, Category, Product, InventoryItem, RecipeDefinition } from '../types';
import { CONCEPTS, CATEGORIES, PRODUCTS, INVENTORY_ITEMS, RECIPES } from '../data/mock_data';

const API_URL = 'http://localhost:3001';

export const useMenuData = () => {
  // Initialize with local mock data immediately (Offline-First approach)
  const [concepts, setConcepts] = useState<Concept[]>(CONCEPTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  
  // New Inventory State (Mock only for now, but ready for Firebase)
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [recipes, setRecipes] = useState<RecipeDefinition[]>(RECIPES);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Background Fetch to sync with server if available
  const fetchMenuData = useCallback(async () => {
      // We don't set loading=true here because we already have initial data showing
      try {
        const [conceptsRes, categoriesRes, productsRes] = await Promise.all([
            fetch(`${API_URL}/concepts`),
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/products`)
        ]);

        if (!conceptsRes.ok || !categoriesRes.ok || !productsRes.ok) {
            throw new Error("Server responded with error");
        }

        // Only update state if server request succeeds
        setConcepts(await conceptsRes.json());
        setCategories(await categoriesRes.json());
        setProducts(await productsRes.json());
        setError(null);
        
      } catch (err) {
          console.warn("Offline Mode: Could not connect to json-server. Using local data.");
          // No need to setConcepts/etc because they are already initialized
          setError("Offline Mode"); 
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  // Update a single product (PUT)
  const saveProduct = useCallback(async (product: Product) => {
      // 1. Optimistically update local state immediately
      setProducts(prev => {
          const exists = prev.find(p => p.id === product.id);
          if (exists) {
              return prev.map(p => p.id === product.id ? product : p);
          }
          return [...prev, product];
      });

      // 2. Try to persist to server
      try {
          const response = await fetch(`${API_URL}/products/${product.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(product)
          });
          
          if (!response.ok) {
              // If 404, maybe it's new? Try POST
              if (response.status === 404) {
                 await fetch(`${API_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                 });
              } else {
                 throw new Error("Failed to save product");
              }
          }
          return true;

      } catch (e) {
          console.warn("Save Warning: Server unreachable. Change saved locally only.");
          return false;
      }
  }, []);

  // Batch Save with Dirty Checking
  const saveBatchProducts = useCallback(async (modifiedProducts: Product[]) => {
      // 1. Optimistically update local state
      setProducts(prev => {
          const newProducts = [...prev];
          modifiedProducts.forEach(mod => {
              const idx = newProducts.findIndex(p => p.id === mod.id);
              if (idx >= 0) {
                  newProducts[idx] = mod;
              } else {
                  newProducts.push(mod);
              }
          });
          return newProducts;
      });

      // 2. Filter for Dirty items and Execute Parallel Requests
      const promises = modifiedProducts.map(async (item) => {
          const original = products.find(p => p.id === item.id);
          
          // Dirty Check: Skip if identical
          if (original && JSON.stringify(original) === JSON.stringify(item)) {
              return; 
          }

          try {
              // Determine if Create (POST) or Update (PUT)
              // If it exists in our 'server source of truth' (products state), it's an update.
              // If it's not in 'products' but is in 'modifiedProducts', it's a new item.
              const method = original ? 'PUT' : 'POST';
              const url = original ? `${API_URL}/products/${item.id}` : `${API_URL}/products`;

              const res = await fetch(url, {
                  method,
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(item)
              });

              if (!res.ok) throw new Error(`Failed to ${method} ${item.name}`);
              
          } catch (e) {
              console.warn(`Sync Warning: Could not save ${item.name} to server. Kept local.`);
          }
      });

      await Promise.all(promises);
      return true;

  }, [products]);

  // --- GETTERS ---

  const getCategoriesByConcept = (conceptId: string) => {
    return categories.filter(cat => cat.conceptId === conceptId);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(prod => prod.categoryId === categoryId);
  };

  const getProductsByConcept = (conceptId: string) => {
    const conceptCatIds = categories
      .filter(cat => cat.conceptId === conceptId)
      .map(cat => cat.id);
    
    return products.filter(prod => conceptCatIds.includes(prod.categoryId));
  };

  return {
    concepts,
    categories,
    products,
    inventory, // New
    recipes,   // New
    loading,
    error,
    getCategoriesByConcept,
    getProductsByCategory,
    getProductsByConcept,
    saveProduct, 
    saveBatchProducts,
    fetchMenuData
  };
};