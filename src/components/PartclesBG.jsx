import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBG() {
  const init = async (engine) => {
    await loadFull(engine);
  };

  return (
    <Particles
      init={init}
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            repulse: { distance: 120, duration: 0.4 },
          },
        },
        particles: {
          number: { value: 80 },
          color: { value: "#38bdf8" },
          opacity: { value: 0.25 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 1,
            outModes: "out",
          },
        },
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
