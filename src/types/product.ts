export interface Product {
  id: string;
  name: string;
  logo: string;
  description: string;
  description_vi: string;
  screenshots: string[];
  demoUrl: string;
  status: 'Ready' | 'Beta' | 'Coming Soon';
  linkUrl: string;
}

export interface Brand {
  name: string;
  tagline: string;
  description: string;
}

export interface Contact {
  phone: string;
  facebook: string;
  website: string;
  youtube: string;
  tiktok: string;
  email: string;
  address: string;
  linkedin?: string;
}

export interface ProductsConfig {
  brand: Brand;
  products: Product[];
  contact: Contact;
}
