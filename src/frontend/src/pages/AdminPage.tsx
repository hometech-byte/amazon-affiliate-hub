import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend.d";
import type { Product } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useIsAdmin,
  useUpdateProduct,
} from "../hooks/useQueries";

const CATEGORIES: Category[] = [
  Category.laptops,
  Category.headphones,
  Category.kitchen,
  Category.smartHome,
  Category.fitness,
  Category.fashion,
];

const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  originalPrice: "",
  imageUrl: "",
  affiliateUrl: "",
  category: Category.laptops,
  badge: "",
  rating: "4.5",
  reviewCount: "0",
  isFeatured: false,
  isTrending: false,
  isActive: true,
};

type FormState = typeof EMPTY_FORM;

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        data-ocid="admin.card"
        className="bg-card rounded-xl shadow-card p-10 max-w-sm w-full text-center"
      >
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Admin Access</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Please log in to access the admin dashboard.
        </p>
        <Button
          data-ocid="admin.primary_button"
          onClick={login}
          disabled={isLoggingIn}
          className="w-full bg-primary text-primary-foreground"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}

function AccessDenied() {
  const goHome = () => {
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        data-ocid="admin.error_state"
        className="bg-card rounded-xl shadow-card p-10 max-w-sm w-full text-center"
      >
        <p className="text-5xl mb-4">🚫</p>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-sm">
          You do not have admin privileges.
        </p>
        <Button variant="outline" className="mt-4" onClick={goHome}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}

export function AdminPage() {
  const { identity, clear } = useInternetIdentity();
  const qc = useQueryClient();
  const isAuthenticated = !!identity;

  const adminQuery = useIsAdmin();
  const productsQuery = useGetAllProducts();
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  if (!isAuthenticated) return <LoginPrompt />;
  if (adminQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          data-ocid="admin.loading_state"
          className="w-8 h-8 animate-spin text-primary"
        />
      </div>
    );
  }
  if (!adminQuery.data) return <AccessDenied />;

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      originalPrice: p.originalPrice?.toString() || "",
      imageUrl: p.imageUrl,
      affiliateUrl: p.affiliateUrl,
      category: p.category as Category,
      badge: p.badge || "",
      rating: p.rating.toString(),
      reviewCount: p.reviewCount.toString(),
      isFeatured: p.isFeatured,
      isTrending: p.isTrending,
      isActive: p.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number.parseFloat(form.price),
        originalPrice: form.originalPrice
          ? Number.parseFloat(form.originalPrice)
          : null,
        imageUrl: form.imageUrl,
        affiliateUrl: form.affiliateUrl,
        category: form.category,
        badge: form.badge || null,
        rating: Number.parseFloat(form.rating),
        reviewCount: BigInt(form.reviewCount),
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
      };
      if (editingProduct) {
        await updateMutation.mutateAsync({
          ...payload,
          id: editingProduct.id,
          isActive: form.isActive,
        });
        toast.success("Product updated successfully");
      } else {
        await addMutation.mutateAsync(payload);
        toast.success("Product added successfully");
      }
      setDialogOpen(false);
    } catch (_e) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
    window.location.href = "/";
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              &larr; DealFinder
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-foreground">
              Admin Dashboard
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="admin.secondary_button"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Manage Products
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {productsQuery.data?.length || 0} products total
            </p>
          </div>
          <Button
            data-ocid="admin.primary_button"
            onClick={openAdd}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div
          data-ocid="admin.table"
          className="bg-card rounded-lg shadow-card overflow-hidden"
        >
          {productsQuery.isLoading ? (
            <div data-ocid="admin.loading_state" className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !productsQuery.data?.length ? (
            <div
              data-ocid="admin.empty_state"
              className="p-12 text-center text-muted-foreground"
            >
              <p className="text-4xl mb-3">📦</p>
              <p className="font-medium">
                No products yet. Add your first product!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Trending</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsQuery.data.map((p, i) => (
                  <TableRow
                    key={p.id.toString()}
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-10 h-10 object-contain rounded bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/assets/generated/product-laptop.dim_400x400.jpg";
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm line-clamp-1">
                            {p.title}
                          </p>
                          {p.badge && (
                            <Badge
                              variant="secondary"
                              className="text-xs mt-0.5"
                            >
                              {p.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">
                      {p.category}
                    </TableCell>
                    <TableCell className="text-sm font-semibold">
                      ${p.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isActive ? "default" : "secondary"}>
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isFeatured ? "default" : "outline"}>
                        {p.isFeatured ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.isTrending ? "default" : "outline"}>
                        {p.isTrending ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          data-ocid={`admin.edit_button.${i + 1}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              data-ocid={`admin.delete_button.${i + 1}`}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-ocid="admin.dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Product
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &ldquo;{p.title}
                                &rdquo;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="admin.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                data-ocid="admin.confirm_button"
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDelete(p.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          data-ocid="admin.modal"
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                data-ocid="admin.input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Product title"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                data-ocid="admin.textarea"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description"
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                data-ocid="admin.input"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="29.99"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, originalPrice: e.target.value }))
                }
                placeholder="49.99"
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="affiliateUrl">Affiliate URL *</Label>
              <Input
                id="affiliateUrl"
                value={form.affiliateUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, affiliateUrl: e.target.value }))
                }
                placeholder="https://amazon.com/dp/..."
              />
            </div>

            <div className="col-span-2 space-y-1">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v as Category }))
                }
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                value={form.badge}
                onChange={(e) =>
                  setForm((f) => ({ ...f, badge: e.target.value }))
                }
                placeholder="Hot Deal / Prime Deal"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="rating">Rating (0&ndash;5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reviewCount">Review Count</Label>
              <Input
                id="reviewCount"
                type="number"
                value={form.reviewCount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reviewCount: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.switch"
                id="isFeatured"
                checked={form.isFeatured}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isFeatured: v }))
                }
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                data-ocid="admin.switch"
                id="isTrending"
                checked={form.isTrending}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isTrending: v }))
                }
              />
              <Label htmlFor="isTrending">Trending</Label>
            </div>

            {editingProduct && (
              <div className="flex items-center gap-3">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isActive: v }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              data-ocid="admin.cancel_button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.save_button"
              onClick={handleSubmit}
              disabled={
                isPending || !form.title || !form.price || !form.affiliateUrl
              }
              className="bg-primary text-primary-foreground"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isPending
                ? "Saving..."
                : editingProduct
                  ? "Update"
                  : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
