import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  stock: number;
  seller: string;
}

interface ProductCardProps {
  product: Product;
  onAddToBasket: (product: Product) => void;
}

const ProductCard = ({ product, onAddToBasket }: ProductCardProps) => {
  const { toast } = useToast();

  const handleAdd = () => {
    if (product.stock <= 0) {
      toast({ title: "Out of stock", description: `${product.name} is currently unavailable`, variant: "destructive" });
      return;
    }
    onAddToBasket(product);
    toast({ title: "Added to basket", description: `${product.name} added` });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in flex flex-col">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-body font-semibold text-sm text-foreground">{product.name}</h3>
        <p className="text-primary font-bold text-sm">{product.price}</p>
        <p className="text-xs text-muted-foreground mb-2">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-auto text-xs"
          onClick={handleAdd}
          disabled={product.stock <= 0}
          aria-label={`Add ${product.name} to basket`}
        >
          Add to basket
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
