import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticleBackground: React.FC = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: 'transparent' },
        particles: {
          number: { value: 60, density: { enable: true, area: 800 } },
          color: { value: ['#FFC0CB', '#B794F4', '#81E6D9'] },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 2.5, random: true },
          move: { enable: true, speed: 0.5, direction: 'none', outModes: 'out' },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
          modes: { repulse: { distance: 80, duration: 0.3 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
