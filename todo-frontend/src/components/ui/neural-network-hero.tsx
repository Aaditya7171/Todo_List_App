import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

type CTA = { text: string; href: string; primary?: boolean };
type Props = {
  title: string;
  description: string;
  badgeText: string;
  badgeLabel: string;
  ctaButtons: CTA[];
  microDetails: string[];
};

gsap.registerPlugin(useGSAP);

function WavyPlane() {
  const ref = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      if (!ref.current) return;
      const geo = ref.current.geometry as any;
      geo.computeVertexNormals();
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 0.2;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      t += 0.02;
    }, 16);
    return () => clearInterval(id);
  }, []);
  return (
    <mesh ref={ref} rotation-x={-0.6} position={[0, 0, 0]}>
      <planeGeometry args={[8, 8, 64, 64]} />
      <meshStandardMaterial color={"#7D89B0"} metalness={0.2} roughness={0.9} />
    </mesh>
  );
}

export default function Hero({ title, description, badgeText, badgeLabel, ctaButtons, microDetails }: Props) {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!container.current) return;
    gsap.fromTo(
      container.current.querySelectorAll("[data-fade]"),
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={container} className="w-full h-full relative">
      <Canvas camera={{ position: [0, 1.5, 3.2], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 2]} intensity={1} />
        <WavyPlane />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-surface-900/40 to-surface-900/80 pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-soft px-3 py-1 text-xs text-text-muted" data-fade>
          <span className="text-text-secondary">{badgeText}</span>
          <span className="text-surface-100/70">•</span>
          <span className="text-accent">{badgeLabel}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-text-primary mb-3" data-fade>{title}</h1>
        <p className="max-w-xl text-text-secondary mb-4" data-fade>{description}</p>
        <div className="flex gap-3" data-fade>
          {ctaButtons.map((b, i) => (
            <a
              key={i}
              href={b.href}
              className={
                b.primary
                  ? "px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-surface-100 border border-border-soft"
                  : "px-4 py-2 rounded-md border border-border-soft text-text-secondary hover:text-text-primary"
              }
            >
              {b.text}
            </a>
          ))}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-text-faint" data-fade>
          {microDetails.map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </div>
  );
}