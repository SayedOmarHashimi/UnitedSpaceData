"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StarField() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    canvasRef.current.appendChild(renderer.domElement);

    // Stars — three layers for depth
    const createStarLayer = (count: number, size: number, spread: number, color: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * spread;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });
      return new THREE.Points(geometry, material);
    };

    const stars1 = createStarLayer(3000, 1.2, 2000, 0xffffff);
    const stars2 = createStarLayer(800, 2.0, 1500, 0x00d4ff);
    const stars3 = createStarLayer(200, 2.8, 1200, 0x8b5cf6);
    scene.add(stars1, stars2, stars3);

    // Nebula — soft glowing cloud using sprite
    const createNebula = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, "rgba(0,80,120,0.4)");
      gradient.addColorStop(0.3, "rgba(20,0,80,0.3)");
      gradient.addColorStop(0.7, "rgba(0,30,60,0.1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.4 });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(800, 800, 1);
      sprite.position.set(-200, 100, -300);
      return sprite;
    };

    const nebula1 = createNebula();
    const nebula2 = createNebula();
    nebula2.position.set(300, -150, -400);
    scene.add(nebula1, nebula2);

    // Subtle rotating galaxy plane
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyCount = 1500;
    const galaxyPos = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    for (let i = 0; i < galaxyCount; i++) {
      const radius = Math.random() * 300;
      const spinAngle = radius * 3;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      const randomness = (Math.random() - 0.5) * radius * 0.1;
      galaxyPos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomness;
      galaxyPos[i * 3 + 1] = randomness * 0.2;
      galaxyPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomness - 400;
      const mixRatio = radius / 300;
      galaxyColors[i * 3] = 0.1 + mixRatio * 0.3;
      galaxyColors[i * 3 + 1] = 0.3 + mixRatio * 0.2;
      galaxyColors[i * 3 + 2] = 0.8 + mixRatio * 0.2;
    }
    galaxyGeo.setAttribute("position", new THREE.BufferAttribute(galaxyPos, 3));
    galaxyGeo.setAttribute("color", new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.6 });
    const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxy);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX * 30 - targetX) * 0.05;
      targetY += (-mouseY * 30 - targetY) * 0.05;

      stars1.rotation.y = elapsed * 0.02;
      stars2.rotation.y = elapsed * 0.015;
      stars3.rotation.y = elapsed * 0.01;
      galaxy.rotation.y = elapsed * 0.008;
      galaxy.rotation.x = Math.sin(elapsed * 0.1) * 0.1;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const container = canvasRef.current;
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container?.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
