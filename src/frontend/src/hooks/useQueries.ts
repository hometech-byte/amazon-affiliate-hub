import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category } from "../backend.d";
import type { Product } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTrendingProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "trending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchProducts(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useGetProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      title: string;
      description: string;
      price: number;
      originalPrice: number | null;
      imageUrl: string;
      affiliateUrl: string;
      category: Category;
      badge: string | null;
      rating: number;
      reviewCount: bigint;
      isFeatured: boolean;
      isTrending: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addProduct(
        p.title,
        p.description,
        p.price,
        p.originalPrice,
        p.imageUrl,
        p.affiliateUrl,
        p.category,
        p.badge,
        p.rating,
        p.reviewCount,
        p.isFeatured,
        p.isTrending,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: {
      id: bigint;
      title: string;
      description: string;
      price: number;
      originalPrice: number | null;
      imageUrl: string;
      affiliateUrl: string;
      category: Category;
      badge: string | null;
      rating: number;
      reviewCount: bigint;
      isFeatured: boolean;
      isTrending: boolean;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProduct(
        p.id,
        p.title,
        p.description,
        p.price,
        p.originalPrice,
        p.imageUrl,
        p.affiliateUrl,
        p.category,
        p.badge,
        p.rating,
        p.reviewCount,
        p.isFeatured,
        p.isTrending,
        p.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
