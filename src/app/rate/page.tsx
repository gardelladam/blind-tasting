"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function RatePage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [showNames, setShowNames] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBeerId, setEditingBeerId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    imageUrl: "",
  });
  const router = useRouter();

  const fetchBeers = async () => {
    try {
      const response = await fetch("/api/beers");
      if (!response.ok) throw new Error("Failed to fetch beers");
      const data = await response.json();
      setBeers(data);
    } catch (error) {
      console.error("Error fetching beers:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchBeers();
    fetchSettings();
  }, []);

  const handleAddRating = async (beerId: string, rating: number) => {
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ beerId, rating }),
      });

      if (!response.ok) throw new Error("Failed to add rating");

      await fetchBeers();
    } catch (error) {
      console.error("Error adding rating:", error);
      alert("Kunde inte lägga till betyg");
    }
  };

  const handleRemoveRating = async (ratingId: string) => {
    try {
      const response = await fetch(`/api/ratings?id=${ratingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove rating");

      await fetchBeers();
    } catch (error) {
      console.error("Error removing rating:", error);
      alert("Kunde inte ta bort betyg");
    }
  };

  const handleToggleNames = async () => {
    const newValue = !showNames;
    setShowNames(newValue);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showBeerNames: newValue }),
      });

      if (!response.ok) throw new Error("Failed to update settings");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Kunde inte uppdatera inställningar");
      setShowNames(!newValue);
    }
  };

  const handleDeleteBeer = async (beerId: string, beerName: string) => {
    if (
      !confirm(
        `Är du säker på att du vill ta bort "${beerName}"? Detta tar även bort alla betyg för denna öl.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/beers?id=${beerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete beer");

      await fetchBeers();
    } catch (error) {
      console.error("Error deleting beer:", error);
      alert("Kunde inte ta bort öl");
    }
  };

  const handleEditBeer = (beer: Beer) => {
    setEditingBeerId(beer._id);
    setEditForm({
      name: beer.name,
      price: beer.price.toString(),
      imageUrl: beer.imageUrl || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingBeerId(null);
    setEditForm({ name: "", price: "", imageUrl: "" });
  };

  const handleUpdateBeer = async (beerId: string) => {
    if (!editForm.name || !editForm.price) {
      alert("Namn och pris är obligatoriska");
      return;
    }

    try {
      const response = await fetch(`/api/beers?id=${beerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          price: parseFloat(editForm.price),
          imageUrl: editForm.imageUrl || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to update beer");

      setEditingBeerId(null);
      setEditForm({ name: "", price: "", imageUrl: "" });
      await fetchBeers();
    } catch (error) {
      console.error("Error updating beer:", error);
      alert("Kunde inte uppdatera öl");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-2xl text-blue-900">Laddar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Betygsätt öl</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              Visa Resultat
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              ← Tillbaka till Admin
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold text-gray-800">
              Visa ölnamn på resultatsidan
            </label>
            <button
              onClick={handleToggleNames}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors cursor-pointer ${
                showNames ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  showNames ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {beers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              Inga öl tillagda ännu. Gå tillbaka och lägg till några öl!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {beers.map((beer, index) => (
              <div key={beer._id} className="bg-white rounded-lg shadow-lg p-6">
                {editingBeerId === beer._id ? (
                  <div className="mb-4 space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      Redigera Öl #{index + 1}
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ölnamn
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pris (kr)
                      </label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bild URL (valfritt)
                      </label>
                      <input
                        type="url"
                        value={editForm.imageUrl}
                        onChange={(e) =>
                          setEditForm({ ...editForm, imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateBeer(beer._id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                      >
                        ✓ Spara
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                      >
                        ✕ Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          Öl #{index + 1}: {beer.name}
                        </h3>
                        <p className="text-gray-600">
                          Pris: {beer.price.toFixed(2)} kr
                        </p>
                        {beer.imageUrl && (
                          <p className="text-gray-500 text-xs mt-1">
                            📷 Bild tillgänglig
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBeer(beer)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-lg transition duration-200 cursor-pointer text-sm"
                          title="Redigera öl"
                        >
                          ✏️ Redigera
                        </button>
                        <button
                          onClick={() => handleDeleteBeer(beer._id, beer.name)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-lg transition duration-200 cursor-pointer text-sm"
                          title="Ta bort öl"
                        >
                          🗑️ Ta bort
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {editingBeerId !== beer._id && (
                  <>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Lägg till betyg:
                      </p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleAddRating(beer._id, rating)}
                            className="w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>

                    {beer.ratings.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Betyg ({beer.ratings.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {beer.ratings.map((rating) => (
                            <div
                              key={rating._id}
                              className="flex items-center bg-blue-100 rounded-full px-3 py-1"
                            >
                              <span className="font-semibold text-blue-900">
                                {rating.rating}
                              </span>
                              <button
                                onClick={() => handleRemoveRating(rating._id)}
                                className="ml-2 text-red-600 hover:text-red-800 font-bold cursor-pointer"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            Visa Resultat →
          </button>
        </div>
      </div>
    </div>
  );
}
