"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StarField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Stars — dark navy dots against tan bg, very subtle
    const makeStars = (count: number, spread: number, size: number, opacity: number, color: number) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true });
      return new THREE.Points(geo, mat);
    };

    // Three layers: deep navy, mid navy, accent sky — all muted
    const layer1 = makeStars(1800, 2200, 1.4, 0.18, 0x0A1628);
    const layer2 = makeStars(600, 1600, 2.0, 0.12, 0x1B3A6B);
    const layer3 = makeStars(150, 1200, 2.6, 0.15, 0x4A90D9);
    scene.add(layer1, layer2, layer3);

    // Subtle constellation lines
    const lineGeo = new THREE.BufferGeometry();
    const linePoints: number[] = [];
    for (let i = 0; i < 12; i++) {
      const x1 = (Math.random() - 0.5) * 800;
      const y1 = (Math.random() - 0.5) * 400;
      const x2 = x1 + (Math.random() - 0.5) * 120;
      const y2 = y1 + (Math.random() - 0.5) * 120;
      linePoints.push(x1, y1, -200, x2, y2, -200);
    }
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePoints), 3));
    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: 0x1B3A6B, transparent: true, opacity: 0.06 })
    );
    scene.add(lineMat);

    // Mouse parallax — very gentle
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 20;
      my = -(e.clientY / window.innerHeight - 0.5) * 20;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      tx += (mx - tx) * 0.04;
      ty += (my - ty) * 0.04;

      layer1.rotation.y = t * 0.008;
      layer2.rotation.y = t * 0.005;
      layer3.rotation.y = t * 0.003;

      camera.position.x = tx;
      camera.position.y = ty;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
