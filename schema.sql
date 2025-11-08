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
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
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

-- Create index on name_fa for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name_fa ON products(name_fa);

-- Create index on name_en for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products(name_en);

-- Create trigger to automatically update updated_at for products
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
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

