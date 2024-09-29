# Restaurant Food Ordering Web App

This is a fully responsive food ordering platform developed for a restaurant. Users can browse the menu, customize their orders, and make payments online. It includes features like real-time order tracking, account management, and an admin panel for managing orders.

## Features

- Browse restaurant menu with categories
- Add dishes to cart and customize orders
- User authentication and profile management
- Order tracking and notifications
- Payment gateway integration for secure online payments
- Admin panel for managing orders and updating menu
- Responsive design for mobile and desktop devices

## Demo

Check out the live demo: [Live Demo](https://food-ordering-app-demo-tim.vercel.app/)

## Technologies Used

- **Framework**: Next.js
- **Styling**: Tailwind CSS, Shadcn
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: Lucia
- **Payment Gateway**: Stripe API
- **Cloud Storage**: Cloudinary (for storing images)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mingzhaoliang/food-ordering-app.git
   cd food-ordering-app
   ```

2. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up environment variables in a .env file (example below):

   ```bash
   NODE_ENV=development
   BASE_URL=http://localhost:3000
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # mongodb

   DB_NAME=restaurant
   MONGODB_URI=<your-mongodb-uri>

   # cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   NEXT_PUBLIC_UPLOAD_PRESET=<your-cloudinary-upload-preset>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

   # google
   OAUTH_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   OAUTH_GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>

   # location iq
   LOCATIONIQ_ACCESS_TOKEN=<your-locationiq-access-token>

   # maptiler
   NEXT_PUBLIC_MAPTILER_API_KEY=<your-maptiler-api-key>

   # stripe
   STRIPE_API_KEY=<your-stripe-api-key>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   ```

4. Run the app in development mode:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 to view it in the browser.

## Usage

1. Browse the menu by categories (e.g., Antipasti, Primi, Secondi, Dolci).
2. Add items to your cart and customize your order.
3. Place your order without signing in.
4. Create an account or sign in to track your order in real time from your account dashboard.
5. Admins can sign in to view and update orders and manage the menu and restaurant information.
