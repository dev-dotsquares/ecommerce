import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm">Your one-stop shop for everything you need. Quality products, amazing prices.</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="hover:text-primary"><Instagram size={20} /></Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/category/electronics" className="hover:text-primary">Electronics</Link></li>
              <li><Link href="/category/fashion" className="hover:text-primary">Fashion</Link></li>
              <li><Link href="/cart" className="hover:text-primary">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-primary">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>123 ShopSphere Ave, Ecom City, 12345</li>
              <li>Email: support@shopsphere.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
