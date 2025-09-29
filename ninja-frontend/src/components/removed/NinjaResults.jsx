// not in use atleast not now

import React, {useState} from "react";

// Separate component for displaying ninja results
export default function NinjaResults({ninjas, unit}) {
  const getRankEmoji = (rank) => {
    const rankMap = {
      "black belt": "🥋",
      "red belt": "❤️",
      "blue belt": "💙",
      "yellow belt": "💛",
      "green belt": "💚",
      "pink belt": "💗",
      "white belt": "🤍",
      "brown belt": "🤎",
      "purple belt": "💜",
      "orange belt": "🧡",
    };
    return rankMap[rank?.toLowerCase()] || "🥋";
  };

  const formatDistance = (distance, unit) => {
    if (unit === "km") {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  // Don't render anything if ninjas array is empty
  if (!ninjas || ninjas.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-3 animate-fadeIn">
      <div className="text-center mb-4">
        <div className="mb-2 text-3xl">🎯</div>
        <h3 className="text-lg font-bold text-green-200">
          Top {ninjas.length} Ninjas Found!
        </h3>
      </div>

      {ninjas.map((ninja, index) => (
        <div
          key={ninja._id}
          className={`relative rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
            index === 0
              ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50"
              : index === 1
              ? "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/50"
              : "bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-400/50"
          }`}
        >
          {/* Rank badge */}
          <div className="absolute -top-2 -right-2">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-300 to-slate-400 text-black"
                  : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
              }`}
            >
              {index + 1}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🥷</span>
                <div>
                  <h4 className="font-bold text-white text-lg">{ninja.name}</h4>
                  <div className="flex items-center text-sm text-purple-200">
                    <span className="mr-1">{getRankEmoji(ninja.rank)}</span>
                    <span className="capitalize">{ninja.rank}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-purple-200">
                  <span className="mr-1">📏</span>
                  <span>{formatDistance(ninja.distance, unit)} away</span>
                </div>

                <div className="flex items-center">
                  <span className="mr-1">
                    {ninja.availability ? "✅" : "❌"}
                  </span>
                  <span
                    className={
                      ninja.availability ? "text-green-300" : "text-red-300"
                    }
                  >
                    {ninja.availability ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coordinates info */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="text-xs text-purple-300 flex items-center">
              <span className="mr-1">📍</span>
              <span>
                {ninja.geometry.coordinates[1].toFixed(4)},{" "}
                {ninja.geometry.coordinates[0].toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// export default NinjaResults
