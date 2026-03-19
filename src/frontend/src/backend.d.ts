import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    title: string;
    originalPrice?: number;
    description: string;
    affiliateUrl: string;
    isActive: boolean;
    imageUrl: string;
    isFeatured: boolean;
    category: string;
    badge?: string;
    rating: number;
    price: number;
    reviewCount: bigint;
    isTrending: boolean;
}
export enum Category {
    laptops = "laptops",
    headphones = "headphones",
    kitchen = "kitchen",
    smartHome = "smartHome",
    fitness = "fitness",
    fashion = "fashion"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(title: string, description: string, price: number, originalPrice: number | null, imageUrl: string, affiliateUrl: string, category: Category, badge: string | null, rating: number, reviewCount: bigint, isFeatured: boolean, isTrending: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProductsByCategory(_category: Category): Promise<Array<Product>>;
    getTrendingProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    productExists(id: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(keyword: string): Promise<Array<Product>>;
    seedData(): Promise<void>;
    updateProduct(id: bigint, title: string, description: string, price: number, originalPrice: number | null, imageUrl: string, affiliateUrl: string, category: Category, badge: string | null, rating: number, reviewCount: bigint, isFeatured: boolean, isTrending: boolean, isActive: boolean): Promise<void>;
}
