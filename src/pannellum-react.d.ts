declare module 'pannellum-react' {
    import React from 'react';
  
    export interface PannellumProps {
      width: string;
      height: string;
      image: string;
      pitch?: number;
      yaw?: number;
      hfov?: number;
      autoLoad?: boolean;
      showZoomCtrl?: boolean;
      [key: string]: any; // Catch-all for unsupported props
    }
  
    export const Pannellum: React.FC<PannellumProps>;
  
    export default Pannellum;
  }
  