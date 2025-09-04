declare module "@react-three/postprocessing" {
  import { ReactNode } from "react";
  
  export interface EffectComposerProps {
    children?: ReactNode;
    disableNormalPass?: boolean;
    [key: string]: any;
  }
  
  export interface BloomProps {
    mipmapBlur?: boolean;
    luminanceThreshold?: number;
    levels?: number;
    intensity?: number;
    [key: string]: any;
  }
  
  export interface ToneMappingProps {
    [key: string]: any;
  }
  
  export const EffectComposer: React.FC<EffectComposerProps>;
  export const Bloom: React.FC<BloomProps>;
  export const ToneMapping: React.FC<ToneMappingProps>;
}