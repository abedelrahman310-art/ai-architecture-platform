import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface Room { x: number; y: number; width: number; depth: number; name: string; category: string; area: number; }
interface DesignViewer3DProps { layout: Room[]; height?: number; }

function RoomBox({ room, height = 2.5 }: { room: Room; height: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const colors: Record<string, string> = { 'living': '#4CAF50', 'bedroom': '#2196F3', 'kitchen': '#FF9800', 'bathroom': '#00BCD4', 'dining': '#E91E63', 'office': '#9C27B0', 'default': '#757575' };
  const color = colors[room.category] || colors['default'];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });
  
  return (
    <group position={[room.x + room.width / 2, height / 2, room.y + room.depth / 2]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[room.width, height, room.depth]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(room.width, height, room.depth)]} />
        <lineBasicMaterial color="#000" linewidth={2} />
      </lineSegments>
      <Text position={[0, height + 0.5, 0]} fontSize={0.5} color="#000" anchorX="center" anchorY="middle" rotation={[-Math.PI / 2, 0, 0]}>{room.name}</Text>
      <Text position={[0, height / 2, 0]} fontSize={0.3} color="#fff" anchorX="center" anchorY="middle">{room.area}م2</Text>
    </group>
  );
}

function FloorGrid({ width, depth }: { width: number; depth: number }) {
  return <Grid position={[width / 2, 0, depth / 2]} args={[width + 4, depth + 4]} cellSize={1} cellThickness={0.5} cellColor="#6f6f6f" sectionSize={5} sectionThickness={1} sectionColor="#9d4b4b" fadeDistance={30} fadeStrength={1} />;
}

function Scene({ layout, height }: { layout: Room[]; height: number }) {
  const bounds = useMemo(() => {
    if (!layout.length) return { width: 20, depth: 15 };
    const maxX = Math.max(...layout.map(r => r.x + r.width));
    const maxY = Math.max(...layout.map(r => r.y + r.depth));
    return { width: maxX + 2, depth: maxY + 2 };
  }, [layout]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <FloorGrid width={bounds.width} depth={bounds.depth} />
      {layout.map((room, index) => (<RoomBox key={index} room={room} height={height} />))}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} target={[bounds.width / 2, height / 2, bounds.depth / 2]} />
    </>
  );
}

export default function DesignViewer3D({ layout, height = 2.5 }: DesignViewer3DProps) {
  if (!layout || layout.length === 0) {
    return <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg"><p className="text-gray-500">لا يوجد تصميم للعرض</p></div>;
  }
  
  return (
    <div className="w-full h-96 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-inner">
      <Canvas shadows camera={{ position: [15, 10, 15], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <Scene layout={layout} height={height} />
      </Canvas>
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-2 rounded-lg text-xs text-gray-600 shadow">
        <p>🖱️ سحب: تدوير | عجلة: تكبير | زر أيمن: تحريك</p>
      </div>
    </div>
  );
}
