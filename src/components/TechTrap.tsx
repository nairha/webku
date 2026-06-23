"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export const TechTrap = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Angular Trap
      (window as any).ng = { 
        coreTokens: true, 
        probe: () => {}, 
        version: { full: "16.2.0" } 
      };
      
      // 2. TikTok Pixel Trap
      (window as any).ttq = { 
        load: () => {}, 
        page: () => {}, 
        track: () => {},
        instance: () => {} 
      };
      
      // 3. Framer Motion Trap
      (window as any).__framer_importFromPackage = true;
      (window as any).FramerMotion = { version: "10.16.4" };
      
      // 4. GSAP Trap
      (window as any).gsap = { version: "3.12.2", core: {} };
      
      // 5. Twikoo Global Trap
      (window as any).twikoo = { version: "1.6.39", init: () => {} };

      // 6. TypeScript Spoof (usually Nextjs covers this, but just in case)
      (window as any).ts = { version: "5.0.4" };

      // 7. Algolia Search Trap
      (window as any).algoliasearch = { version: "4.20.0" };

      // 8. Buy Me a Coffee Trap
      (window as any).BuyMeACoffee = true;
      (window as any).BMCWidgets = true;
    }
  }, []);

  return (
    <>
      {/* HTML Elements / DOM Traps */}
      <div style={{ display: "none" }} aria-hidden="true" >
        {/* Angular DOM Signature */}
        {React.createElement('app-root', { 'ng-version': '16.2.0' })}
        
        {/* Framer Motion DOM Signature */}
        <div data-framer-name="TrapMotion" />

        {/* Twikoo DOM Signature */}
        <div id="twikoo" />

        {/* Buy Me a Coffee Signature */}
        <a href="https://www.buymeacoffee.com/davingm" tabIndex={-1} aria-label="Buy Me a Coffee – trap element">Buy Me a Coffee</a>

        {/* Algolia Signature */}
        <a href="https://www.algolia.com/" tabIndex={-1} aria-label="Powered by Algolia – trap element">Powered by Algolia</a>
      </div>

      {/* Network / Script Traps (Lazy loaded to keep site insanely fast) */}
      <Script 
        id="twikoo-global-trap"
        src="https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js" 
        strategy="lazyOnload" 
        onLoad={() => {
          // Disable actual init logic
          if (typeof window !== 'undefined' && (window as any).twikoo) {
            (window as any).twikoo.init = () => console.log('Global Twikoo Trap Activated.');
          }
        }}
      />
    </>
  );
};
