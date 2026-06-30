"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { Hospital } from "@/types/hospital.type";

interface SearchMapProps {
  hospitals?: Hospital[];
}

// Fix default marker icon broken in webpack/Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const SearchMap = ({ hospitals = [] }: SearchMapProps) => {
  useEffect(() => {
    // Inject Leaflet CSS into head on client only
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const center: [number, number] = hospitals.length > 0 
    ? [hospitals[0].coordinates.lat, hospitals[0].coordinates.lng] 
    : [23.7800, 90.3900];

  return (
    <MapContainer
      center={center}
      zoom={12}
      zoomControl={false}
      className="h-full w-full"
      style={{ minHeight: "100%" }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.coordinates.lat, hospital.coordinates.lng]}
          icon={defaultIcon}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{hospital.name}</p>
              <p className="text-gray-500 text-xs mt-1">{hospital.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
