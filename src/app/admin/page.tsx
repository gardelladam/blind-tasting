"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [showNames, setShowNames] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setShowNames(data.showBeerNames);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900">🔧 Adminpanel</h1>
          <div className="flex gap-2">
            {showNames && (
              <button
                onClick={() => router.push("/stats")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
              >
                📊 Statistik
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              ← Tillbaka till Resultat
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              📝 Lägg till vara
            </h2>
            <p className="text-gray-600 mb-4">
              Lägg till en ny vara i testlistan med namn och pris.
            </p>
            <button
              onClick={() => router.push("/add")}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Gå till Lägg till-sida
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              ⭐ Betygsätt öl
            </h2>
            <p className="text-gray-600 mb-4">
              Lägg till betyg på öl, hantera befintliga betyg och kontrollera
              namnsynlighet på resultatsidan.
            </p>
            <button
              onClick={() => router.push("/rate")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Gå till Betygsättning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
