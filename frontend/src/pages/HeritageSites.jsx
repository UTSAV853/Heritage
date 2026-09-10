import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Shield, AlertTriangle, Users, ExternalLink } from 'lucide-react'
import { getSites } from '../api/client'

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createColorIcon = (color) => L.divIcon({
  html: `<div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 0 8px ${color}88"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const HEALTH_COLOR = (score) =>
  score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'

export default function HeritageSites() {
  const [sites, setSites] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSites().then(res => {
      setSites(res.data)
      if (res.data.length > 0) setSelected(res.data[0])
    }).finally(() => setLoading(false))
  }, [])

  const center = [22.5, 72.0]

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Heritage Sites</h1>
        <p className="text-slate-400 text-sm mt-1">
          Interactive heritage map — AI-monitored sites with status overlays
        </p>
      </div>
      <div className="demo-banner">
        <span>⚠️</span>
        <span>Map markers use approximate coordinates for demo. Real deployment integrates GIS data from ASI/Survey of India.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden h-[480px]">
            {!loading && (
              <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <ZoomControl position="bottomright" />
                {sites.map(site => (
                  <React.Fragment key={site.id}>
                    <Marker
                      position={[site.latitude, site.longitude]}
                      icon={createColorIcon(HEALTH_COLOR(site.health_score))}
                      eventHandlers={{ click: () => setSelected(site) }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{site.name}</strong><br />
                          Health: {Math.round(site.health_score)}/100<br />
                          {site.unesco_status && '🏛️ UNESCO World Heritage'}
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[site.latitude, site.longitude]}
                      radius={3000}
                      pathOptions={{
                        color: HEALTH_COLOR(site.health_score),
                        fillColor: HEALTH_COLOR(site.health_score),
                        fillOpacity: 0.06,
                        weight: 1,
                        opacity: 0.4,
                      }}
                    />
                  </React.Fragment>
                ))}
              </MapContainer>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Healthy (&gt;70)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" /> Moderate (50–70)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Needs Attention (&lt;50)</span>
          </div>
        </div>

        {/* Site list */}
        <div className="space-y-3">
          <div className="label-text">All Monitored Sites</div>
          {sites.map(site => (
            <div
              key={site.id}
              onClick={() => setSelected(site)}
              className={`card-sm cursor-pointer hover:border-slate-600 transition-all ${selected?.id === site.id ? 'border-heritage-600 bg-heritage-950/20' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0`}
                    style={{ background: HEALTH_COLOR(site.health_score) }} />
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{site.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{site.location?.split(',')[0]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: HEALTH_COLOR(site.health_score) }}>
                    {Math.round(site.health_score)}/100
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="badge badge-gray">{site.site_type}</span>
                {site.unesco_status && <span className="badge badge-blue">UNESCO</span>}
                {site.established_year && (
                  <span className="badge badge-gray">Est. {site.established_year} CE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected site detail */}
      {selected && (
        <div className="card border-heritage-700/40">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">{selected.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                <MapPin size={14} /> {selected.location}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: HEALTH_COLOR(selected.health_score) }}>
                  {Math.round(selected.health_score)}/100
                </div>
                <div className="text-xs text-slate-500">Health Score</div>
              </div>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Type', value: selected.site_type },
              { label: 'Established', value: selected.established_year ? `${selected.established_year} CE` : 'Ancient' },
              { label: 'Max Capacity', value: `${selected.max_visitor_capacity?.toLocaleString()} visitors` },
              { label: 'UNESCO Status', value: selected.unesco_status ? 'World Heritage Site' : 'Protected Monument' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/50 rounded-lg p-3">
                <div className="label-text mb-1">{label}</div>
                <div className="text-sm font-medium text-slate-200">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
