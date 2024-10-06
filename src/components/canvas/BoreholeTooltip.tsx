import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BoreholeTooltipProps {
  position: { x: number; y: number; z: number }; // Ensure z is included
  content: string;
  visible: boolean;
}

const BoreholeTooltip: React.FC<BoreholeTooltipProps> = ({ position, content, visible }) => {
  const spriteRef = useRef<THREE.Sprite | null>(null);

  useEffect(() => {
    if (!visible) {
      if (spriteRef.current) {
        spriteRef.current.visible = false;
      }
      return;
    }

    // Create a canvas for the tooltip content
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      const fontSize = 20;
      context.font = `${fontSize}px Arial`;
      const textWidth = context.measureText(content).width;
      canvas.width = textWidth + 20; // Add padding
      canvas.height = fontSize + 10; // Add padding

      // Draw background
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      context.fillStyle = 'black';
      context.fillText(content, 10, fontSize + 5);
    }

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create the sprite
    if (!spriteRef.current) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      spriteRef.current = new THREE.Sprite(spriteMaterial);
      spriteRef.current.scale.set(1, 0.5, 1); // Adjust size as needed
    } else {
      spriteRef.current.material.map = texture;
      spriteRef.current.visible = true;
    }

    // Set the position of the sprite
    spriteRef.current.position.set(position.x, position.y, position.z); // Ensure z is set as needed
  }, [position, content, visible]);

  return null; // No need to render a div; the sprite is added to the scene
};

export default BoreholeTooltip;
