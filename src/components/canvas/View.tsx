'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef, useEffect } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

export const Common = ({ color }) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight intensity={2} />
    <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
    <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
    <PerspectiveCamera makeDefault fov={40} position={[0, 4, -2]} />
  </Suspense>
)

const View = forwardRef(({ children, orbit, onMovementDetected, onReset, ...props }, ref) => {
  const localRef = useRef(null)
  const controlsRef = useRef(null); // Ref to store the OrbitControls instance
  const initialValuesRef = useRef({ azimuthal: null, polar: null, distance: null }); // Use ref for initial values

  useImperativeHandle(ref, () => localRef.current)

  // Effect to log azimuthal angle every 100ms
  useEffect(() => {
    const checkMovement = () => {
      if (controlsRef.current) {
        const azimuthalAngle = controlsRef.current.getAzimuthalAngle();
        const polarAngle = controlsRef.current.getPolarAngle();
        const distance = controlsRef.current.getDistance();

        // Set initial values if they are not set
        if (initialValuesRef.current.azimuthal === null) {
          initialValuesRef.current = {
            azimuthal: azimuthalAngle,
            polar: polarAngle,
            distance: distance,
          };
        }

        if (
          Math.abs(azimuthalAngle - initialValuesRef.current.azimuthal) > 0.01 ||
          Math.abs(polarAngle - initialValuesRef.current.polar) > 0.01 ||
          Math.abs(distance - initialValuesRef.current.distance) > 0.01
        ) {
          //console.log('movement');
          if (onMovementDetected) {
            onMovementDetected(); // Call the parent's movement detection handler
          }
        }
      }
    };

    const intervalId = setInterval(checkMovement, 100); // Log every 100ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [onMovementDetected]); // Add onMovementDetected to the dependency array


  // Log when the reset action occurs
  useEffect(() => {
    if (onReset) {
      console.log('Reset action triggered child View'); // Log when onReset is called
      if (controlsRef.current) {
        //TODO: Figure out correct way to do this
        controlsRef.current.enableDamping = false;
        controlsRef.current.reset();
        controlsRef.current.enableDamping = true;
        controlsRef.current.reset();
      }
    }
  }, [onReset]); // Run whenever onReset changes (e.g., when the reset button is clicked)


  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls 
            ref={controlsRef} // Attach ref to OrbitControls
            maxDistance={2.5} 
            minDistance={0.5} />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
