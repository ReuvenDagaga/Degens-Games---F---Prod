import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Map3D() {
  const { nodes } = useGLTF('./Map.glb');

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight />
      <directionalLight position={[10, 10, 10]} />
      <group>
        {Object.entries(nodes).map(([key, mesh]) => (
          <mesh
            key={key}
            geometry={mesh.geometry}
            material={mesh.material}
            onClick={() => console.log('נבחרה טריטוריה:', key)}
          />
        ))}
      </group>
    </Canvas>
  );
}

export default Map3D;