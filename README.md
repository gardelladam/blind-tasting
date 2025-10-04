# 🍺 Blind Beer Testing App

A Next.js application for conducting blind beer taste tests with friends. Rate beers anonymously and reveal rankings based on objective ratings!

## Features

- **Add Beers**: Create entries with beer name and price
- **Rate Beers**: Add ratings (1-5) for each beer, with the ability to add multiple ratings and remove them
- **View Results**: See all rated beers sorted by average rating with individual ratings displayed
- **Toggle Visibility**: Control whether beer names are visible on the results page
- **Local MongoDB Storage**: All data is stored in a local MongoDB database

## Prerequisites

- Node.js (v18 or higher)
- MongoDB installed and running locally

## Setup

1. **Install MongoDB** (if not already installed):

   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create a `.env.local` file in the root directory:

   ```
   MONGODB_URI=mongodb://localhost:27017/blind-beer
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. View Results (Home Page)

- The home page (/) displays all rated beers sorted by average rating
- Top 3 beers are marked with 🥇🥈🥉
- Individual ratings are displayed as circles
- Beer names appear only if toggled on from the admin panel
- Click "Admin Panel" to manage beers and ratings

### 2. Admin Panel (/admin)

- Navigate to /admin to access administrative features
- From here you can:
  - Add new beers
  - Rate existing beers

### 3. Add Beers (/add)

- Fill in the beer name and price
- Click "Add Beer" to save it to the database
- Repeat for all beers you want to test

### 4. Rate Beers (/rate)

- For each beer, click the rating buttons (1-5) to add ratings
- You can add multiple ratings per beer (for multiple testers)
- Remove individual ratings by clicking the "×" button next to them
- Toggle the "Show beer names on results page" switch if you want names visible on the home page

## Tech Stack

- **Framework**: Next.js 15.5.4
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **Runtime**: React 19

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Results page (home)
│   ├── admin/page.tsx        # Admin panel
│   ├── add/page.tsx          # Add beer form
│   ├── rate/page.tsx         # Rating page
│   └── api/
│       ├── beers/route.ts    # Beer API endpoints
│       ├── ratings/route.ts  # Rating API endpoints
│       └── settings/route.ts # Settings API endpoints
├── lib/
│   └── mongodb.ts            # Database connection
└── models/
    ├── Beer.ts               # Beer schema
    ├── Rating.ts             # Rating schema
    └── Settings.ts           # Settings schema
```

## API Endpoints

- `GET /api/beers` - Get all beers with ratings
- `POST /api/beers` - Create a new beer
- `POST /api/ratings` - Add a rating to a beer
- `DELETE /api/ratings?id={ratingId}` - Remove a rating
- `GET /api/settings` - Get app settings
- `PUT /api/settings` - Update app settings

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Notes

- This app is designed for local use only
- No authentication or admin system is required
- Data persists in the local MongoDB database
- Beer numbers are assigned based on creation order
