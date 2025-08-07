"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Play, Satellite, RotateCcw, Send, X, Minimize2 } from "lucide-react"

interface TelemetryData {
  // Atmospheric & Kinematic Variables
  pressureSP: number
  pressureC: number
  descentRateSP: number
  altitudeC: number
  altitudeSP: number
  altitude: number

  // Temperature data
  iotStation1Temp: number
  iotStation2Temp: number

  // Axis Attitude
  pitch: number
  roll: number
  yaw: number

  // GNSS Data
  gpsLat: number
  gpsLon: number
  gpsAlt: number

  // Filter Command
  filterStatus: string
  lastCommand: string
  cameraStatus: string
  batteryVoltage: number
  filterMechanism: string
  camera: string
  storage: string

  // Mission data
  missionTime: number
  connectionStatus: string

  // IAS Parameters
  errorCode: string
  descentRateC: string
  descentRateSPStatus: string
  pressureDataC: string
  orientationDataSP: string
  separationActivation: string
  filteringMechanism: string

  // Status
  overallStatus: string
}

export default function Component() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({
    // Atmospheric & Kinematic Variables
    pressureSP: 96560,
    pressureC: 96560,
    descentRateSP: 7.2,
    altitudeC: 225.4,
    altitudeSP: 218.7,
    altitude: 6.9,

    // Temperature data
    iotStation1Temp: 26.8,
    iotStation2Temp: 27.4,

    // Axis Attitude
    pitch: 44.2,
    roll: 6.4,
    yaw: 94.0,

    // GNSS Data
    gpsLat: 40.412233,
    gpsLon: 29.998477,
    gpsAlt: 247.5,

    // Filter Command
    filterStatus: "Activated",
    lastCommand: "669R",
    cameraStatus: "Recording",
    batteryVoltage: 8.4,
    filterMechanism: "Responding",
    camera: "ON",
    storage: "OK",

    // Mission data
    missionTime: 0,
    connectionStatus: "Connected",

    // IAS Parameters
    errorCode: "010041",
    descentRateC: "IN RANGE",
    descentRateSPStatus: "O.F.RANGE",
    pressureDataC: "NORMAL",
    orientationDataSP: "STABLE",
    separationActivation: "FAILED",
    filteringMechanism: "ACTIVE",

    // Status
    overallStatus: "Critical",
  })

  const [chartData, setChartData] = useState({
    altitude1: {
      orange: Array.from({ length: 50 }, (_, i) => 520 - i * 2 + Math.sin(i * 0.1) * 10),
      blue: Array.from({ length: 50 }, (_, i) => 500 - i * 1.8 + Math.cos(i * 0.08) * 8),
    },
    altitude2: {
      orange: Array.from({ length: 50 }, (_, i) => 520 - i * 2 + Math.sin(i * 0.12) * 12),
      blue: Array.from({ length: 50 }, (_, i) => 500 - i * 1.8 + Math.cos(i * 0.09) * 9),
    },
    descentRate1: {
      orange: Array.from({ length: 50 }, (_, i) => 12 + Math.sin(i * 0.3) * 8),
      blue: Array.from({ length: 50 }, (_, i) => 10 + Math.sin(i * 0.25 + 1) * 6),
    },
    descentRate2: {
      orange: Array.from({ length: 50 }, (_, i) => 12 + Math.sin(i * 0.28) * 8),
      blue: Array.from({ length: 50 }, (_, i) => 10 + Math.sin(i * 0.22 + 1.5) * 6),
    },
  })

  // Minimal data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryData((prev) => ({
        ...prev,
        missionTime: prev.missionTime + 1,
        iotStation1Temp: prev.iotStation1Temp + (Math.random() - 0.5) * 0.2,
        iotStation2Temp: prev.iotStation2Temp + (Math.random() - 0.5) * 0.2,
        pitch: prev.pitch + (Math.random() - 0.5) * 1,
        roll: prev.roll + (Math.random() - 0.5) * 0.5,
        yaw: prev.yaw + (Math.random() - 0.5) * 2,
        batteryVoltage: Math.max(6.0, prev.batteryVoltage - Math.random() * 0.01),
      }))

      // Update chart data
      setChartData((prev) => ({
        altitude1: {
          orange: [...prev.altitude1.orange.slice(1), 520 - Date.now() * 0.001 + Math.sin(Date.now() * 0.0001) * 10],
          blue: [...prev.altitude1.blue.slice(1), 500 - Date.now() * 0.0008 + Math.cos(Date.now() * 0.00008) * 8],
        },
        altitude2: {
          orange: [...prev.altitude2.orange.slice(1), 520 - Date.now() * 0.001 + Math.sin(Date.now() * 0.00012) * 12],
          blue: [...prev.altitude2.blue.slice(1), 500 - Date.now() * 0.0008 + Math.cos(Date.now() * 0.00009) * 9],
        },
        descentRate1: {
          orange: [...prev.descentRate1.orange.slice(1), 12 + Math.sin(Date.now() * 0.003) * 8],
          blue: [...prev.descentRate1.blue.slice(1), 10 + Math.sin(Date.now() * 0.0025 + 1) * 6],
        },
        descentRate2: {
          orange: [...prev.descentRate2.orange.slice(1), 12 + Math.sin(Date.now() * 0.0028) * 8],
          blue: [...prev.descentRate2.blue.slice(1), 10 + Math.sin(Date.now() * 0.0022 + 1.5) * 6],
        },
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const createChartPath = (data: number[], maxVal = 600) => {
    const points = data.map((value, i) => `${(i * 280) / data.length},${120 - (value * 100) / maxVal}`).join(" L ")
    return `M ${points}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN RANGE":
      case "NORMAL":
      case "STABLE":
      case "ACTIVE":
      case "Connected":
      case "Activated":
      case "Recording":
      case "Responding":
        return "text-green-400"
      case "O.F.RANGE":
        return "text-red-400"
      case "FAILED":
        return "text-red-400"
      case "Critical":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "IN RANGE":
      case "NORMAL":
      case "STABLE":
      case "ACTIVE":
        return "bg-green-500"
      case "O.F.RANGE":
      case "FAILED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden" style={{ backgroundColor: "#1F2937" }}>
      {/* Top Menu Bar */}
      <div className="bg-gray-800 border-b border-gray-600 px-4 py-1 flex items-center justify-between text-sm h-12">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <span className="text-white">File</span>
            <span className="text-white">Edit</span>
            <span className="text-white">Selection</span>
            <span className="text-white">View</span>
            <span className="text-white">Help</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 h-7">
            <Download className="w-3 h-3 mr-1" />
            Export as CSV
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-7">
            <RotateCcw className="w-3 h-3 mr-1" />
            Sync with PC Time
          </Button>
          <div className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs">Live ▼</div>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 h-7">
            <Download className="w-3 h-3 mr-1" />
            Export Graphs
          </Button>
          <div className="flex items-center space-x-2">
            <Minimize2 className="w-4 h-4 text-gray-400" />
            <X className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-2 grid grid-cols-12 gap-3 h-[calc(100vh-48px)] bg-gray-900">
        {/* Top Charts Row - 4 charts with 2 plots each */}
        <div className="col-span-12 grid grid-cols-4 gap-3 h-32">
          {/* Altitude Chart 1 - Two plots in one */}
          <div className="bg-gray-800 border-2 border-purple-500 rounded p-1">
            <div className="text-purple-400 text-xs mb-1">Altitude</div>
            <div className="h-28 relative">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                {/* Grid */}
                <defs>
                  <pattern id="grid1" width="30" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 12" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid1)" />
                {/* Add complete border */}
                <rect x="20" y="5" width="260" height="100" fill="none" stroke="#4B5563" strokeWidth="1" />

                {/* Y-axis labels */}
                <text x="5" y="12" fill="#9CA3AF" fontSize="7">
                  520
                </text>
                <text x="5" y="32" fill="#9CA3AF" fontSize="7">
                  500
                </text>
                <text x="5" y="52" fill="#9CA3AF" fontSize="7">
                  480
                </text>
                <text x="5" y="72" fill="#9CA3AF" fontSize="7">
                  460
                </text>
                <text x="5" y="92" fill="#9CA3AF" fontSize="7">
                  440
                </text>

                {/* X-axis labels */}
                <text x="50" y="115" fill="#9CA3AF" fontSize="6">
                  1
                </text>
                <text x="100" y="115" fill="#9CA3AF" fontSize="6">
                  2
                </text>
                <text x="150" y="115" fill="#9CA3AF" fontSize="6">
                  3
                </text>
                <text x="200" y="115" fill="#9CA3AF" fontSize="6">
                  4
                </text>
                <text x="250" y="115" fill="#9CA3AF" fontSize="6">
                  5
                </text>
                <text x="120" y="115" fill="#9CA3AF" fontSize="6">
                  Time (minutes)
                </text>

                {/* Both chart lines in same graph */}
                <path
                  d={createChartPath(chartData.altitude1.orange, 600)}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                />
                <path d={createChartPath(chartData.altitude1.blue, 600)} fill="none" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Altitude Chart 2 - Two plots in one */}
          <div className="bg-gray-800 border-2 border-purple-500 rounded p-1">
            <div className="text-purple-400 text-xs mb-1">Altitude</div>
            <div className="h-28 relative">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <defs>
                  <pattern id="grid2" width="30" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 12" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid2)" />
                {/* Add complete border */}
                <rect x="20" y="5" width="260" height="100" fill="none" stroke="#4B5563" strokeWidth="1" />
                <text x="5" y="12" fill="#9CA3AF" fontSize="7">
                  520
                </text>
                <text x="5" y="32" fill="#9CA3AF" fontSize="7">
                  500
                </text>
                <text x="5" y="52" fill="#9CA3AF" fontSize="7">
                  480
                </text>
                <text x="5" y="72" fill="#9CA3AF" fontSize="7">
                  460
                </text>
                <text x="5" y="92" fill="#9CA3AF" fontSize="7">
                  440
                </text>
                <text x="120" y="115" fill="#9CA3AF" fontSize="6">
                  Time (minutes)
                </text>
                <path
                  d={createChartPath(chartData.altitude2.orange, 600)}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                />
                <path d={createChartPath(chartData.altitude2.blue, 600)} fill="none" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Descent Rate Chart 1 - Two plots in one */}
          <div className="bg-gray-800 border-2 border-purple-500 rounded p-1">
            <div className="text-purple-400 text-xs mb-1">Descent Rate</div>
            <div className="h-28 relative">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <defs>
                  <pattern id="grid3" width="30" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 12" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid3)" />
                {/* Add complete border */}
                <rect x="20" y="5" width="260" height="100" fill="none" stroke="#4B5563" strokeWidth="1" />
                <text x="5" y="12" fill="#9CA3AF" fontSize="7">
                  25
                </text>
                <text x="5" y="32" fill="#9CA3AF" fontSize="7">
                  20
                </text>
                <text x="5" y="52" fill="#9CA3AF" fontSize="7">
                  15
                </text>
                <text x="5" y="72" fill="#9CA3AF" fontSize="7">
                  10
                </text>
                <text x="5" y="92" fill="#9CA3AF" fontSize="7">
                  5
                </text>
                <text x="120" y="115" fill="#9CA3AF" fontSize="6">
                  Time (minutes)
                </text>
                <path
                  d={createChartPath(chartData.descentRate1.orange, 25)}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                />
                <path
                  d={createChartPath(chartData.descentRate1.blue, 25)}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Descent Rate Chart 2 - Two plots in one */}
          <div className="bg-gray-800 border-2 border-purple-500 rounded p-1">
            <div className="text-purple-400 text-xs mb-1">Descent Rate</div>
            <div className="h-28 relative">
              <svg className="w-full h-full" viewBox="0 0 300 120">
                <defs>
                  <pattern id="grid4" width="30" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 12" fill="none" stroke="#4B5563" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid4)" />
                {/* Add complete border */}
                <rect x="20" y="5" width="260" height="100" fill="none" stroke="#4B5563" strokeWidth="1" />
                <text x="5" y="12" fill="#9CA3AF" fontSize="7">
                  25
                </text>
                <text x="5" y="32" fill="#9CA3AF" fontSize="7">
                  20
                </text>
                <text x="5" y="52" fill="#9CA3AF" fontSize="7">
                  15
                </text>
                <text x="5" y="72" fill="#9CA3AF" fontSize="7">
                  10
                </text>
                <text x="5" y="92" fill="#9CA3AF" fontSize="7">
                  5
                </text>
                <text x="120" y="115" fill="#9CA3AF" fontSize="6">
                  Time (minutes)
                </text>
                <path
                  d={createChartPath(chartData.descentRate2.orange, 25)}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2"
                />
                <path
                  d={createChartPath(chartData.descentRate2.blue, 25)}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Left Panel */}
        <div className="col-span-3 space-y-3">
          {/* Atmospheric & Kinematic Variables */}
          <div className="bg-gray-800 rounded p-2">
            <div className="text-white text-sm mb-2">Atmospheric & Kinematic Variables</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Pressure SP:</div>
                  <div className="text-white font-mono">{telemetryData.pressureSP} Pa</div>
                </div>
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Descent Rate SP:</div>
                  <div className="text-white font-mono">{telemetryData.descentRateSP} m/s</div>
                </div>
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Altitude SP:</div>
                  <div className="text-white font-mono">{telemetryData.altitudeSP} m</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Pressure C:</div>
                  <div className="text-white font-mono">{telemetryData.pressureC} Pa</div>
                </div>
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Altitude C:</div>
                  <div className="text-white font-mono">{telemetryData.altitudeC} m</div>
                </div>
                <div className="bg-gray-700 p-1 rounded text-xs">
                  <div className="text-gray-300">Altitude:</div>
                  <div className="text-white font-mono">{telemetryData.altitude} m</div>
                </div>
              </div>
            </div>
          </div>

          {/* Orientation Dial & Positional Telemetry */}
          <div className="bg-gray-800 rounded p-2">
            <div className="text-white text-sm mb-2">Orientation Dial & Positional Telemetry</div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12">
                <Satellite className="w-full h-full text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-white text-xs mb-1">Temperature</div>
                <div className="space-y-1">
                  <div className="bg-gray-700 p-1 rounded text-xs">
                    <span className="text-gray-300">IoT Station 1 Temp: </span>
                    <span className="text-white font-mono">{telemetryData.iotStation1Temp.toFixed(1)} °C</span>
                  </div>
                  <div className="bg-gray-700 p-1 rounded text-xs">
                    <span className="text-gray-300">IoT Station 2 Temp: </span>
                    <span className="text-white font-mono">{telemetryData.iotStation2Temp.toFixed(1)} °C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Axis Attitude */}
            <div className="bg-gray-800 rounded p-2">
              <div className="text-white text-xs mb-1">Axis Attitude</div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-300">PITCH: </span>
                  <span className="text-white font-mono">{telemetryData.pitch.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-gray-300">ROLL: </span>
                  <span className="text-white font-mono">{telemetryData.roll.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-gray-300">YAW: </span>
                  <span className="text-white font-mono">{telemetryData.yaw.toFixed(1)}°</span>
                </div>
              </div>
            </div>

            {/* GNSS Data */}
            <div className="bg-gray-800 rounded p-2">
              <div className="text-white text-xs mb-1">GNSS Data</div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-gray-300">GPS Lat: </span>
                  <span className="text-white font-mono">{telemetryData.gpsLat.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-300">GPS Long: </span>
                  <span className="text-white font-mono">{telemetryData.gpsLon.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-300">GPS Alt: </span>
                  <span className="text-white font-mono">{telemetryData.gpsAlt.toFixed(1)} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Live Video Stream (16:9) */}
        <div className="col-span-6 space-y-3">
          <div className="bg-gray-800 rounded p-2 flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="text-blue-400 text-sm">📺 Live Video Stream</div>
              </div>
              <div className="bg-purple-600 px-2 py-1 rounded text-white text-xs">■ Stop</div>
            </div>

            {/* 16:9 aspect ratio video container - smaller */}
            <div className="relative w-full mb-2" style={{ paddingBottom: "42%" }}>
              <div className="absolute inset-0 bg-gray-700 rounded overflow-hidden">
                <img
                  src="/placeholder.svg?height=240&width=427&text=Aerial+Satellite+View+with+Green+Circle+Overlay"
                  alt="Live satellite feed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-green-400 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Status Section */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-white text-xs">Record</span>
                  <div className="w-2 h-2 bg-gray-600 rounded-full ml-3"></div>
                  <span className="text-white text-xs">Save</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-gray-300">Filter: </span>
                    <span className="text-green-400">● {telemetryData.filterStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Last Command: </span>
                    <span className="text-white font-mono">{telemetryData.lastCommand}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Camera Status: </span>
                    <span className="text-green-400">{telemetryData.cameraStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Battery Voltage: </span>
                    <span className="text-white font-mono">{telemetryData.batteryVoltage.toFixed(1)} V</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Filter Mechanism: </span>
                    <span className="text-green-400">{telemetryData.filterMechanism}</span>
                  </div>
                </div>
              </div>

              {/* Filter Command */}
              <div>
                <div className="text-white text-sm mb-1">Filter Command</div>
                <div className="bg-gray-700 p-2 rounded mb-1">
                  <div className="text-2xl font-mono text-center text-white">669R</div>
                </div>
                <div className="flex space-x-1 mb-1">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1 text-xs px-2 py-1">
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1">
                    <RotateCcw className="w-3 h-3" />
                    Reset to N
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <span className="text-gray-300">Camera: </span>
                    <span className="text-white">{telemetryData.camera}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Storage: </span>
                    <span className="text-white">{telemetryData.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Interface Alarm Status Console */}
        <div className="col-span-3 space-y-3">
          <div className="bg-gray-800 rounded p-2">
            <div className="text-white text-sm mb-1">Interface Alarm Status Console - IAS</div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white text-xs">Error Code: </span>
              <span className="text-red-400 font-mono text-xs">{telemetryData.errorCode}</span>
            </div>

            <div className="bg-gray-700 rounded p-2 mb-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-1">
                <div className="text-gray-300">BIT PARAMETERS</div>
                <div className="text-gray-300">STATUS</div>
              </div>
              <Separator className="bg-gray-600 mb-1" />
              <div className="space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">1 Descent Rate C</div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.descentRateC)}`}></div>
                    <span className={getStatusColor(telemetryData.descentRateC)}>{telemetryData.descentRateC}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">2 Descent Rate SP</div>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.descentRateSPStatus)}`}
                    ></div>
                    <span className={getStatusColor(telemetryData.descentRateSPStatus)}>
                      {telemetryData.descentRateSPStatus}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">3 Pressure Data C</div>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.pressureDataC)}`}></div>
                    <span className={getStatusColor(telemetryData.pressureDataC)}>{telemetryData.pressureDataC}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">4 Orientation Data SP</div>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.orientationDataSP)}`}
                    ></div>
                    <span className={getStatusColor(telemetryData.orientationDataSP)}>
                      {telemetryData.orientationDataSP}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">5 Separation Activation</div>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.separationActivation)}`}
                    ></div>
                    <span className={getStatusColor(telemetryData.separationActivation)}>
                      {telemetryData.separationActivation}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-300">6 Filtering Mechanism</div>
                  <div className="flex items-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(telemetryData.filteringMechanism)}`}
                    ></div>
                    <span className={getStatusColor(telemetryData.filteringMechanism)}>
                      {telemetryData.filteringMechanism}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-white text-xs">Status: </span>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-400 text-xs">{telemetryData.overallStatus}</span>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1">
                <Download className="w-3 h-3 mr-1" />
                View Alert Log
              </Button>
            </div>

            <div className="mt-2">
              <div className="text-white text-xs mb-1">Alarm Diagnostic</div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1">
                <Play className="w-3 h-3 mr-1" />
                RUN
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="col-span-12 bg-gray-800 rounded p-2 h-16">
          <div className="grid grid-cols-5 gap-4 items-center text-center h-full">
            <div>
              <div className="text-white text-sm font-bold">LAUNCH PAD</div>
              <div className="text-gray-400 text-xs">State</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">749160</div>
              <div className="text-gray-400 text-xs">Team ID</div>
            </div>
            <div>
              <div className="text-white text-sm font-bold">PSIT VYOMNAUTS</div>
              <div className="text-gray-400 text-xs">Team Name</div>
            </div>
            <div>
              <div className="text-green-400 text-sm font-bold">{telemetryData.connectionStatus}</div>
              <div className="text-gray-400 text-xs">Status</div>
            </div>
            <div>
              <div className="text-white text-lg font-mono">{formatTime(telemetryData.missionTime)}</div>
              <div className="text-gray-400 text-xs">Mission Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
