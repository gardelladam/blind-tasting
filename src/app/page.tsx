"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Rating {
  _id: string;
  rating: number;
}

interface Beer {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  ratings: Rating[];
}

interface BeerWithStats extends Beer {
  averageRating: number;
  beerNumber: number;
}

export default function HomePage() {
  const [beers, setBeers] = useState<BeerWithStats[]>([]);
  const [showNames, setShowNames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch beers
        const beersResponse = await fetch("/api/beers");
        if (!beersResponse.ok) throw new Error("Failed to fetch beers");
        const beersData: Beer[] = await beersResponse.json();

        // Fetch settings
        const settingsResponse = await fetch("/api/settings");
        if (!settingsResponse.ok) throw new Error("Failed to fetch settings");
        const settingsData = await settingsResponse.json();
        setShowNames(settingsData.showBeerNames);

        // Filter beers with ratings and calculate average
        const beersWithRatings = beersData
          .map((beer, index) => ({
            ...beer,
            beerNumber: index + 1,
            averageRating:
              beer.ratings.length > 0
                ? beer.ratings.reduce((sum, r) => sum + r.rating, 0) /
                  beer.ratings.length
                : 0,
          }))
          .filter((beer) => beer.ratings.length > 0)
          .sort((a, b) => b.averageRating - a.averageRating);

        setBeers(beersWithRatings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex items-center justify-center">
        <div className="text-2xl text-green-900">Laddar resultat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">🏆 Resultat</h1>
          <button
            onClick={() => router.push("/admin")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            Adminpanel
          </button>
        </div>

        {beers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Inga betygsatta öl ännu. Gå till adminpanelen för att lägga till
              och betygsätta öl!
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 cursor-pointer"
            >
              Gå till Adminpanel
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {beers.map((beer, index) => (
              <div
                key={beer._id}
                className={`bg-white rounded-lg shadow-md p-4 border-l-4 min-h-[100px] ${
                  index === 0
                    ? "border-yellow-500"
                    : index === 1
                    ? "border-gray-400"
                    : index === 2
                    ? "border-amber-700"
                    : "border-green-500"
                }`}
              >
                <div className="flex gap-3 mb-2">
                  {showNames && beer.imageUrl && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={beer.imageUrl}
                        alt={beer.name}
                        fill
                        className="object-contain rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex justify-between items-start flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {index < 3 && (
                          <span className="text-xl">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-800">
                          {showNames
                            ? `Öl #${beer.beerNumber}: ${beer.name}`
                            : `Öl #${beer.beerNumber}`}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Pris: {beer.price.toFixed(2)} kr
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">
                        {beer.averageRating.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">Medel</div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    Individuella betyg ({beer.ratings.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {beer.ratings.map((rating) => (
                      <div
                        key={rating._id}
                        className="flex items-center justify-center w-8 h-8 bg-green-600 text-white text-sm font-bold rounded-full shadow-sm"
                      >
                        {rating.rating}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
