"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Rating {
  _id: string;
  rating: number;
}

interface Beer {
  _id: string;
  name: string;
  price?: number;
  alcoholPercentage?: number;
  imageUrl?: string;
  ratings: Rating[];
}

interface BeerWithStats {
  name: string;
  price?: number;
  alcoholPercentage?: number;
  averageRating: number;
  ratingCount: number;
}

interface TooltipPayload {
  payload: BeerWithStats;
}

export default function StatsPage() {
  const [beers, setBeers] = useState<BeerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/beers");
        if (!response.ok) throw new Error("Failed to fetch beers");
        const beersData: Beer[] = await response.json();

        // Filter beers with ratings and calculate stats
        const beersWithStats = beersData
          .filter((beer) => beer.ratings.length > 0)
          .map((beer) => ({
            name: beer.name,
            price: beer.price,
            alcoholPercentage: beer.alcoholPercentage,
            averageRating:
              beer.ratings.reduce((sum, r) => sum + r.rating, 0) /
              beer.ratings.length,
            ratingCount: beer.ratings.length,
          }));

        setBeers(beersWithStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate min and max price for X-axis domain
  const prices = beers
    .map((b) => b.price)
    .filter((p): p is number => p != null);

  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;

  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.1; // Add 10% padding on each side

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    // Only include beers with a defined price
    const validBeers = beers.filter((b) => b.price != null);
    if (validBeers.length < 2) return 0;

    const n = validBeers.length;

    // Destructure price to make TS happy
    const sumX = validBeers.reduce((sum, { price }) => sum + price!, 0);
    const sumY = validBeers.reduce(
      (sum, { averageRating }) => sum + averageRating,
      0
    );
    const sumXY = validBeers.reduce(
      (sum, { price, averageRating }) => sum + price! * averageRating,
      0
    );
    const sumX2 = validBeers.reduce(
      (sum, { price }) => sum + price! * price!,
      0
    );
    const sumY2 = validBeers.reduce(
      (sum, { averageRating }) => sum + averageRating * averageRating,
      0
    );

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const correlation = calculateCorrelation();

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          {data.price != undefined && (
            <p className="text-sm">Pris: {data.price.toFixed(2)} kr</p>
          )}
          <p className="text-sm">Betyg: {data.averageRating.toFixed(2)} / 5</p>
          <p className="text-sm">Antal betyg: {data.ratingCount}</p>
          {data.alcoholPercentage != undefined && (
            <p className="text-sm">
              Alkoholhalt: {data.alcoholPercentage.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8 flex items-center justify-center">
        <div className="text-2xl text-purple-900">Laddar statistik...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900">
            📊 Statistik & Analys
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              Resultat
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        {beers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              Ingen statistik tillgänglig ännu. Lägg till betyg för att se
              statistik!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Pris vs Betyg
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="Pris"
                  unit=" kr"
                  domain={[minPrice - pricePadding, maxPrice + pricePadding]}
                  label={{
                    value: "Pris (kr)",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="averageRating"
                  name="Betyg"
                  domain={[0, 5]}
                  label={{
                    value: "Genomsnittligt betyg",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter name="Öl" data={beers} fill="#8b5cf6" opacity={0.8} />
              </ScatterChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">
              {correlation > 0.3
                ? "Positiv korrelation: Dyrare öl tenderar att få högre betyg."
                : correlation < -0.3
                ? "Negativ korrelation: Dyrare öl tenderar att få lägre betyg."
                : "Svag eller ingen korrelation mellan pris och betyg."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
