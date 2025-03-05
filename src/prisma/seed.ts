import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync('10203040', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob',
      status: 'active',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: hashedPassword,
      name: 'Alice',
      status: 'locked out',
    },
  });

  console.log('Users created:', { user1, user2 });

  const category1 = await prisma.category.create({ data: { name: 'Electronics' } });
  const category2 = await prisma.category.create({ data: { name: 'Books' } });
  const category3 = await prisma.category.create({ data: { name: 'Furniture' } });
  const category4 = await prisma.category.create({ data: { name: 'Clothing' } });

  console.log('Categories created:', { category1, category2, category3, category4 });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const productImagesBasePath = `${appUrl}/uploads/products/`;

  const product1 = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'A brand new smartphone with amazing features.',
      price: 699.99,
      imageUrl: `${productImagesBasePath}smartphone.png`,
      categoryId: category1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'A powerful laptop for work and play.',
      price: 999.99,
      imageUrl: `${productImagesBasePath}laptop.png`,
      categoryId: category1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'JavaScript for Beginners',
      description: 'A comprehensive guide to learning JavaScript.',
      price: 19.99,
      imageUrl: `${productImagesBasePath}javascript-for-beginners.png`,
      categoryId: category2.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Modern Sofa',
      description: 'A comfy and stylish modern sofa.',
      price: 899.99,
      imageUrl: `${productImagesBasePath}mordern-sofa.png`,
      categoryId: category3.id,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Designer Shirt',
      description: 'A trendy shirt for all occasions.',
      price: 49.99,
      imageUrl: `${productImagesBasePath}designer-shirt.png`,
      categoryId: category4.id,
    },
  });

  const product6 = await prisma.product.create({
    data: {
      name: 'Gaming Headset',
      description: 'An immersive gaming headset with surround sound.',
      price: 129.99,
      imageUrl: `${productImagesBasePath}gaming-headset.png`,
      categoryId: category1.id,
    },
  });

  console.log('Products created:', { product1, product2, product3, product4, product5, product6 });

  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: product1.id, quantity: 2 },
          { productId: product3.id, quantity: 1 },
        ],
      },
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [
          { productId: product2.id, quantity: 1 },
          { productId: product4.id, quantity: 2 },
        ],
      },
    },
  });

  console.log('Carts created:', { cart1, cart2 });

  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      status: 'completed',
      total: 1499.98,
      OrderItem: {
        create: [
          { productId: product1.id, quantity: 2 },
          { productId: product3.id, quantity: 1 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      status: 'pending',
      total: 1799.98,
      OrderItem: {
        create: [
          { productId: product2.id, quantity: 1 },
          { productId: product4.id, quantity: 2 },
        ],
      },
    },
  });

  console.log('Orders created:', { order1, order2 });

  const address1 = await prisma.shippingAddress.create({
    data: {
      userId: user1.id,
      fullName: 'Bob',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
      country: 'USA',
    },
  });

  const address2 = await prisma.shippingAddress.create({
    data: {
      userId: user2.id,
      fullName: 'Alice',
      addressLine1: '456 Oak St',
      city: 'Othertown',
      state: 'NY',
      postalCode: '67890',
      country: 'USA',
    },
  });

  console.log('Shipping addresses created:', { address1, address2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
