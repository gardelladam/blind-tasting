"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBeerPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [alcoholPercentage, setAlcoholPercentage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      alert("Vänligen fyll i alla obligatoriska fält");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/beers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: price != "" ? parseFloat(price) : undefined,
          alcoholPercentage:
            alcoholPercentage != "" ? parseFloat(alcoholPercentage) : undefined,
          imageUrl: imageUrl || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add beer");
      }

      setName("");
      setPrice("");
      setAlcoholPercentage("");
      setImageUrl("");
      alert("Öl tillagd!");
    } catch (error) {
      console.error("Error adding beer:", error);
      alert("Kunde inte lägga till öl");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900">
            🍺 Lägg till ny öl
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
          >
            ← Tillbaka till Admin
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ölnamn
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="t.ex. IPA, Lager, Stout..."
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pris (kr)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="t.ex. 29.90"
              />
            </div>

            <div>
              <label
                htmlFor="alcoholPercentage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alkoholhalt %
              </label>
              <input
                type="number"
                id="alcoholPercentage"
                value={alcoholPercentage}
                onChange={(e) => setAlcoholPercentage(e.target.value)}
                step="0.1"
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="t.ex. 5.0"
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bild URL (valfritt)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                placeholder="t.ex. https://example.com/beer.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bilden visas endast när ölnamn är synliga på resultatsidan
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              {isSubmitting ? "Lägger till..." : "Lägg till öl"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
