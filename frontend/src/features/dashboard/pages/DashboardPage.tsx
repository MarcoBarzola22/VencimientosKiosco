import { useState } from 'react';
import { Store, Package } from 'lucide-react';
import { ProductCard } from "@/features/products/components/ProductCard";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { AddProductModal } from "@/features/products/components/AddProductModal";
import { Product } from "@/features/products/types/product";

// Initial demo products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Yogur Ser Frutilla',
    expirationDate: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000), // Today
  },
  {
    id: '2',
    name: 'Pan Lactal Fargo',
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
  },
  {
    id: '3',
    name: 'Coca-Cola 2.5L',
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
  },
  {
    id: '4',
    name: 'Leche La Serenísima',
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
  },
  {
    id: '5',
    name: 'Galletitas Oreo',
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (name: string, expirationDate: Date) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      expirationDate,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Sort products by expiration date (soonest first)
  const sortedProducts = [...products].sort(
    (a, b) => a.expirationDate.getTime() - b.expirationDate.getTime()
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mi Kiosco</h1>
              <p className="text-sm text-muted-foreground">Control de vencimientos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Summary Section */}
        <SummaryCard products={products} />

        {/* Products List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-muted-foreground" />
              Productos ({products.length})
            </h2>
          </div>

          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No hay productos registrados</p>
              <p className="text-sm text-muted-foreground/70">
                Toca el botón + para agregar uno
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {/* Add Product Modal */}
      <AddProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default Index;
