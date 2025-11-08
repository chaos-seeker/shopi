-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name_fa TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create index on name_fa for faster searches
CREATE INDEX IF NOT EXISTS idx_categories_name_fa ON categories(name_fa);

-- Create index on name_en for faster searches
CREATE INDEX IF NOT EXISTS idx_categories_name_en ON categories(name_en);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create trigger to automatically update updated_at for users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id BIGSERIAL PRIMARY KEY,
  name_fa TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- Create index on name_fa for faster searches
CREATE INDEX IF NOT EXISTS idx_brands_name_fa ON brands(name_fa);

-- Create index on name_en for faster searches
CREATE INDEX IF NOT EXISTS idx_brands_name_en ON brands(name_en);

-- Create trigger to automatically update updated_at for brands
DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name_fa TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  property JSONB NOT NULL DEFAULT '[]',
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Create index on category_id for faster joins
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Add brand_id column if it doesn't exist (for existing databases)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'brand_id'
  ) THEN
    -- Add column as nullable first (for existing data)
    ALTER TABLE products ADD COLUMN brand_id BIGINT;
  END IF;
  
  -- Add foreign key constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_products_brand_id'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT fk_products_brand_id 
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE RESTRICT;
  END IF;
  
  -- Remove image column if it exists (migration from image to gallery only)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'image'
  ) THEN
    ALTER TABLE products DROP COLUMN image;
  END IF;
  
  -- Note: If you have existing products, you'll need to update them with a brand_id
  -- before making this column NOT NULL
END $$;

-- Create index on brand_id for faster joins
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);

-- Create index on name_fa for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name_fa ON products(name_fa);

-- Create index on name_en for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products(name_en);

-- Create trigger to automatically update updated_at for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Create trigger to automatically update updated_at for orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

