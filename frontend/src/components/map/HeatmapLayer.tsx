import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { HeatmapPoint } from '../../types';

export default function HeatmapLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    // Custom lightweight circle-based heatmap to avoid complex plugin dependencies
    const layerGroup = L.layerGroup();

    points.forEach(point => {
      // Calculate color and radius based on intensity
      const radius = 30 * point.intensity + 10;
      
      // Color gradient from green (low) to red (high)
      let color = '#10b981'; // Default green
      if (point.intensity > 0.8) color = '#ef4444'; // Red
      else if (point.intensity > 0.5) color = '#f97316'; // Orange
      else if (point.intensity > 0.3) color = '#f59e0b'; // Amber

      L.circle([point.latitude, point.longitude], {
        radius: radius,
        color: 'transparent',
        fillColor: color,
        fillOpacity: 0.4 * point.intensity,
        weight: 0
      }).addTo(layerGroup);
    });

    layerGroup.addTo(map);

    return () => {
      map.removeLayer(layerGroup);
    };
  }, [map, points]);

  return null;
}
