"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Definindo tipos para as props
type Event = {
  id: string;
  name: string;
  date: string;
  description: string;
  image?: string;
};

type Location = {
  name: string;
  coords: [number, number];
  images: string[];
  events: Event[];
};

type InteractiveMapProps = {
  locations: Location[];
  onSelectLocation?: (location: string) => void;
  onSelectEvent?: (eventId: string) => void;
};

export default function InteractiveMap({
  locations,
  onSelectLocation,
  onSelectEvent,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar o mapa apenas se ainda não estiver inicializado
    if (!leafletMap.current) {
      // Corrigir o ícone do marcador - problema comum com Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/img/map/marker-icon-2x.png",
        iconUrl: "/img/map/marker-icon.png",
        shadowUrl: "/img/map/marker-shadow.png",
      });

      // Criar mapa
      leafletMap.current = L.map(mapRef.current, {
        center: [20, 0], // Centro do mapa para uma visão mundial
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: true,
        scrollWheelZoom: true,
        layers: [
          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            
            
          ),
        ],
      });

      // Adicionar limites para evitar que o usuário arraste o mapa para fora dos limites
      leafletMap.current.setMaxBounds([
        [-90, -180], // Canto sudoeste
        [90, 180], // Canto nordeste
      ]);
    }

    // Limpar marcadores existentes
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove();
    });
    markersRef.current = {};

    // Adicionar marcadores para cada localização
    locations.forEach((location) => {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div class="bg-purple-600 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white relative group">
            <div class="absolute -top-1 -right-1 bg-white text-purple-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">${location.events.length}</div>
            <div class="absolute -bottom-2 transform -translate-x-1/2 left-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-t-[7px] border-t-purple-600 border-r-[5px] border-r-transparent"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      // Criar marcador
      const marker = L.marker(location.coords, { icon: customIcon })
        .addTo(leafletMap.current!)
        .on("click", () => {
          setSelectedLocation(location.name);
          if (onSelectLocation) onSelectLocation(location.name);

          // Zoom no marcador
          leafletMap.current?.flyTo(location.coords, 5, {
            animate: true,
            duration: 1,
          });
        });

      // Adicionar popup
      marker.bindTooltip(
        `<div class="bg-black bg-opacity-80 p-2 rounded text-white text-xs">
          <strong>${location.name}</strong><br>
          ${location.events.length} evento(s)
        </div>`,
        {
          direction: "top",
          offset: L.point(0, -15),
        }
      );

      // Armazenar referência ao marcador
      markersRef.current[location.name] = marker;
    });

    // Limpar na desmontagem
    return () => {
      // Não destruímos o mapa aqui para evitar problemas com hot reloading
    };
  }, [locations, onSelectLocation]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1" style={{ minHeight: "100%" }}>
        {/* Mapa */}
        <div
          ref={mapRef}
          className="h-full w-full z-10"
          style={{ minHeight: "100%" }}
        />

        {/* Instruções de uso */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg text-white text-xs z-20 max-w-xs">
          <p className="font-medium mb-1">Como usar o mapa:</p>
          <ul className="space-y-1 text-gray-300">
            <li>• Clique nos marcadores para ver detalhes</li>
            <li>• Use a roda do rato para ampliar/reduzir</li>
            <li>• Arraste para navegar pelo mapa</li>
          </ul>
        </div>

        {/* Legenda */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm p-3 rounded-lg text-white text-xs z-20">
          <p className="font-medium mb-2">Legenda:</p>
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 w-4 h-4 rounded-full relative">
              <div className="absolute -bottom-1 transform -translate-x-1/2 left-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-t-[4px] border-t-purple-600 border-r-[3px] border-r-transparent"></div>
            </div>
            <span>Locais com eventos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
