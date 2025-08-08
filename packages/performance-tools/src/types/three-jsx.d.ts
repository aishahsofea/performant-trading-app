// Three.js JSX support for React 19
import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js primitives
      group: any;
      mesh: any;
      
      // Geometries
      sphereGeometry: any;
      ringGeometry: any;
      
      // Materials
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      
      // Lights
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

export {};