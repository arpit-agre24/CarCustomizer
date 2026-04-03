import { useRef, useEffect, useState, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Component to load and display the actual 3D model
const ModelLoader = ({ modelPath, color }) => {
  const groupRef = useRef();
  
  // Load the 3D model
  const { scene } = useGLTF(modelPath);
  
  // Determine scale based on model path - Tesla needs larger scale
  const getScale = () => {
    if (modelPath?.includes('tesla')) {
      return 150.0; // Larger scale for Tesla
    }
    return 2.0; // Default scale for other models (Porsche)
  };

  useEffect(() => {
    if (!scene || !color) return;

    console.log('Applying color:', color, 'to model:', modelPath);
    
    let coloredParts = 0;
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone material
        child.material = child.material.clone();
        
        const matName = child.material.name?.toLowerCase() || '';
        const meshName = child.name?.toLowerCase() || '';
        
        // Body material detection
        const isBody = matName.includes('body') || 
                      matName.includes('paint') || 
                      matName.includes('carpaint') ||
                      matName.includes('car_paint') ||
                      matName.includes('exterior') ||
                      matName.includes('main') ||
                      matName.includes('base') ||
                      matName.includes('primary') ||
                      meshName.includes('body') ||
                      meshName.includes('paint') ||
                      meshName.includes('chassis') ||
                      meshName.includes('shell');
        
        // Skip non-body parts
        const isGlass = matName.includes('glass') || matName.includes('window') || meshName.includes('glass');
        const isChrome = matName.includes('chrome') || matName.includes('metal');
        const isRubber = matName.includes('rubber') || matName.includes('tire') || meshName.includes('tire') || meshName.includes('wheel');
        const isLight = matName.includes('light') || meshName.includes('light') || meshName.includes('lamp');
        const isInterior = matName.includes('interior') || meshName.includes('interior') || meshName.includes('seat');
        
        if (isBody && !isGlass && !isChrome && !isRubber && !isLight && !isInterior) {
          child.material.color.set(color);
          child.material.metalness = 0.7;
          child.material.roughness = 0.2;
          coloredParts++;
          console.log('✓ Colored:', meshName || matName);
        }
      }
    });
    
    console.log(`Colored ${coloredParts} parts`);
  }, [scene, color, modelPath]);

  // Auto-rotate
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={getScale()} 
        position={[0, -0.8, 0]}
        rotation={[0, Math.PI / 4, 0]}
      />
    </group>
  );
};

// Error boundary wrapper
const Car3D = ({ modelPath, color }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset error state when model changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    
    // Set a timeout for loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [modelPath]);

  // Error fallback component
  const FallbackCar = () => (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[4, 1, 1.8]} />
        <meshStandardMaterial color={color || '#e0e0e0'} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.5, 0.7, 1.4]} />
        <meshStandardMaterial color={color || '#e0e0e0'} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Wheels */}
      {[[1.3, 0.7], [1.3, -0.7], [-1.3, 0.7], [-1.3, -0.7]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.4, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  );

  if (hasError) {
    return <FallbackCar />;
  }

  return (
    <Suspense fallback={
      <group>
        {/* Loading placeholder */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.1, 1.5]} />
          <meshStandardMaterial color="#cccccc" wireframe />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial color="#cccccc" wireframe />
        </mesh>
      </group>
    }>
      <ModelLoader 
        modelPath={modelPath} 
        color={color}
      />
    </Suspense>
  );
};

export default Car3D;
