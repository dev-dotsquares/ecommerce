import { products, reviews } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { ProductImageGallery } from '@/components/product/product-image-gallery';
import { RatingStars } from '@/components/shared/rating-stars';
import { Separator } from '@/components/ui/separator';
import { ProductCarousel } from '@/components/product/product-carousel';
import { AddToCartButton } from './_components/add-to-cart-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck, XCircle } from 'lucide-react';

interface ProductPageProps {
    params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 8);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="container py-8 md:py-12">
        <Breadcrumb 
            items={[
                { label: 'Home', href: '/' },
                { label: 'Products', href: `/category/${product.category}` },
                { label: product.name }
            ]}
            className="mb-6"
        />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <ProductImageGallery images={product.images} productName={product.name} />
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <RatingStars rating={product.rating} />
                            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewsCount} reviews)</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                    <span className="text-xl text-muted-foreground line-through">${product.mrp.toFixed(2)}</span>
                    {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
                </div>
                
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2">
                            {product.inStock ? 
                                <><CheckCircle className="w-5 h-5 text-green-600"/> <span className="font-medium">In Stock</span></> : 
                                <><XCircle className="w-5 h-5 text-destructive"/> <span className="font-medium">Out of Stock</span></>
                            }
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-muted-foreground"/>
                            <span>Get it by <span className="font-bold">tomorrow</span></span>
                        </div>
                    </CardContent>
                </Card>

                {Object.keys(product.attributes).length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {Object.entries(product.attributes).map(([key, value]) => (
                            <div key={key} className="flex">
                                <span className="text-muted-foreground w-24 flex-shrink-0">{key}</span>
                                <span className="font-medium">{value}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                
                <AddToCartButton product={product} />
            </div>
        </div>

        <Separator className="my-12" />

        <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Reviews ({productReviews.length})</h2>
                {productReviews.length > 0 ? (
                    <div className="space-y-6">
                        {productReviews.map(review => (
                            <Card key={review.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base">{review.title}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">by {review.author} on {new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                        <RatingStars rating={review.rating}/>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No reviews for this product yet.</p>
                )}
            </div>
        </div>

        <ProductCarousel title="Similar Products" products={similarProducts} />
    </div>
  );
}
