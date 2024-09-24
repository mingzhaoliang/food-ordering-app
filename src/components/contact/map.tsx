"use client";

import { MapPin } from "lucide-react";
import MapLibre, { Marker, NavigationControl } from "react-map-gl/maplibre";

interface MapProps {
  latitude: number;
  longitude: number;
}

export default function Map({ latitude, longitude }: MapProps) {
  return (
    <MapLibre
      reuseMaps
      initialViewState={{
        zoom: 15,
        latitude,
        longitude,
      }}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "1rem",
      }}
      mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
      baseApiUrl="https://api.maptiler.com/maps/streets-v2/sprite"
    >
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <MapPin className="text-2xl sm:text-3xl text-destructive" />
      </Marker>
      <NavigationControl />
    </MapLibre>
  );
}
