import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface HousingLocation {
  id: string;
  name: string;
  status: 'OnProgress' | 'Onboard' | 'ToDo';
  units: number;
  lat: number;
  lng: number;
}

const housingLocations: HousingLocation[] = [
  {
    id: '1',
    name: 'Villa Bogor Indah',
    status: 'OnProgress',
    units: 1000,
    lat: -6.5885,
    lng: 106.7974
  },
  {
    id: '2',
    name: 'Teras Country',
    status: 'OnProgress',
    units: 300,
    lat: -6.6197,
    lng: 106.8168
  },
  {
    id: '3',
    name: 'Bukit Sultan',
    status: 'Onboard',
    units: 1000,
    lat: -6.5650,
    lng: 106.7850
  },
  {
    id: '4',
    name: 'INKOPAT',
    status: 'ToDo',
    units: 210,
    lat: -6.6050,
    lng: 106.8050
  },
  {
    id: '5',
    name: 'Griya Tajurhalang',
    status: 'ToDo',
    units: 300,
    lat: -6.5450,
    lng: 106.7650
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Onboard':
      return '#10b981'; // green
    case 'OnProgress':
      return '#f59e0b'; // orange
    case 'ToDo':
      return '#6b7280'; // gray
    default:
      return '#3b82f6'; // blue
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Onboard':
      return 'default' as const;
    case 'OnProgress':
      return 'secondary' as const;
    case 'ToDo':
      return 'outline' as const;
    default:
      return 'default' as const;
  }
};

// Custom marker icon based on status
const createCustomIcon = (status: string) => {
  const color = getStatusColor(status);
  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M16 0C10.48 0 6 4.48 6 10c0 7.5 10 22 10 22s10-14.5 10-22c0-5.52-4.48-10-10-10z"/>
      <circle cx="16" cy="10" r="4" fill="#fff"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

export default function HousingMap() {
  const center: [number, number] = [-6.5850, 106.7900]; // Center of Bogor area
  
  // Calculate totals
  const totalUnits = housingLocations.reduce((sum, loc) => sum + loc.units, 0);
  const statusCounts = housingLocations.reduce((acc, loc) => {
    acc[loc.status] = (acc[loc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Peta Lokasi Perumahan - Bogor</CardTitle>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-500">
              Onboard: {statusCounts.Onboard || 0}
            </Badge>
            <Badge variant="secondary" className="bg-orange-500">
              On Progress: {statusCounts.OnProgress || 0}
            </Badge>
            <Badge variant="outline" className="border-gray-500">
              To Do: {statusCounts.ToDo || 0}
            </Badge>
            <Badge variant="default" className="bg-blue-500 ml-2">
              Total: {totalUnits.toLocaleString('id-ID')} Unit
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full rounded-lg overflow-hidden border">
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {housingLocations.map((location) => (
              <div key={location.id}>
                {/* Marker with custom icon */}
                <Marker
                  position={[location.lat, location.lng]}
                  icon={createCustomIcon(location.status)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Status:</span>
                          <Badge variant={getStatusBadgeVariant(location.status)}>
                            {location.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-semibold">Unit:</span>{' '}
                          {location.units.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Koordinat: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Circle to show coverage area - radius based on units */}
                <Circle
                  center={[location.lat, location.lng]}
                  radius={Math.sqrt(location.units) * 50}
                  pathOptions={{
                    color: getStatusColor(location.status),
                    fillColor: getStatusColor(location.status),
                    fillOpacity: 0.15,
                    weight: 2,
                    opacity: 0.5
                  }}
                />
              </div>
            ))}
          </MapContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-5 gap-4">
          {housingLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-start gap-2 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: getStatusColor(location.status) }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{location.name}</div>
                <div className="text-xs text-muted-foreground">
                  {location.units.toLocaleString('id-ID')} unit
                </div>
                <Badge
                  variant={getStatusBadgeVariant(location.status)}
                  className="mt-1 text-xs"
                >
                  {location.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
