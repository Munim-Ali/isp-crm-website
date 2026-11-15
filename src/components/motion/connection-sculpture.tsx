"use client";

import { useEffect, useRef } from "react";
import { MoveUpRight } from "lucide-react";

export function ConnectionSculpture() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!container || reducedMotion.matches || window.innerWidth < 768) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let started = false;

    async function initialize() {
      const THREE = await import("three");
      if (cancelled || !container) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
      container.dataset.ready = "true";
      container.tabIndex = 0;
      container.setAttribute(
        "aria-label",
        "Interactive 3D connected network sculpture. Drag or use left and right arrow keys to rotate.",
      );

      const scene = new THREE.Scene();
      const theme = getComputedStyle(document.documentElement);
      const primary = theme.getPropertyValue("--primary-main").trim();
      const primaryLight = theme.getPropertyValue("--primary-light").trim();
      const primaryBg = theme.getPropertyValue("--primary-light-bg").trim();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
      camera.position.set(0, 0.35, 9.6);
      const assembly = new THREE.Group();
      scene.add(assembly);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x718dbb, 3.5));
      const key = new THREE.DirectionalLight(0xffffff, 4.5);
      key.position.set(3, 5, 7);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x8fbcff, 3);
      fill.position.set(-4, 0, 3);
      scene.add(fill);
      const rim = new THREE.PointLight(0xb9caff, 55);
      rim.position.set(2, -2, -3);
      scene.add(rim);

      const knotGeometry = new THREE.TorusKnotGeometry(
        1.22,
        0.36,
        128,
        20,
        2,
        3,
      );
      const knotMaterial = new THREE.MeshPhysicalMaterial({
        color: primary,
        metalness: 0.3,
        roughness: 0.19,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      });
      const knot = new THREE.Mesh(knotGeometry, knotMaterial);
      knot.rotation.set(0.55, 0.25, -0.2);
      assembly.add(knot);
      const ringGeometry = new THREE.TorusGeometry(2.55, 0.013, 8, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: primaryLight,
        transparent: true,
        opacity: 0.6,
      });
      const orbit = new THREE.Group();
      assembly.add(orbit);
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = 1.08;
      ring.rotation.z = -0.4;
      orbit.add(ring);
      const secondRing = new THREE.Mesh(ringGeometry, ringMaterial);
      secondRing.rotation.set(0.6, 0.9, 0.6);
      orbit.add(secondRing);
      const nodeGeometry = new THREE.SphereGeometry(0.21, 24, 16);
      const nodeMaterial = new THREE.MeshPhysicalMaterial({
        color: primaryBg,
        metalness: 0.16,
        roughness: 0.12,
        clearcoat: 1,
      });
      const accentMaterial = new THREE.MeshPhysicalMaterial({
        color: primaryLight,
        metalness: 0.3,
        roughness: 0.18,
        clearcoat: 1,
      });
      const nodes = Array.from({ length: 7 }, (_, index) => {
        const node = new THREE.Mesh(
          nodeGeometry,
          index % 3 === 0 ? accentMaterial : nodeMaterial,
        );
        orbit.add(node);
        return node;
      });

      let pointerX = 0,
        pointerY = 0,
        dragRotation = 0,
        dragging = false,
        lastX = 0,
        visible = true,
        lastFrame = 0;
      const render = (time: number) => {
        if (time - lastFrame < 32) return;
        lastFrame = time;
        knot.rotation.y = time * 0.00022 + dragRotation;
        knot.rotation.x = 0.5 + Math.sin(time * 0.0003) * 0.12;
        assembly.rotation.y += (pointerX * 0.25 - assembly.rotation.y) * 0.045;
        assembly.rotation.x += (-pointerY * 0.14 - assembly.rotation.x) * 0.045;
        assembly.position.y = Math.sin(time * 0.00065) * 0.09;
        orbit.rotation.y = time * 0.00007;
        nodes.forEach((node, index) => {
          const angle = index * ((Math.PI * 2) / nodes.length) + time * 0.00011;
          node.position.set(
            Math.cos(angle) * 2.55,
            Math.sin(angle) * 1.4,
            Math.sin(angle) * 2.05,
          );
        });
        renderer.render(scene, camera);
      };
      const update = () =>
        renderer.setAnimationLoop(
          visible && !document.hidden && !reducedMotion.matches ? render : null,
        );
      const onPointerMove = (event: PointerEvent) => {
        const bounds = container.getBoundingClientRect();
        pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;
        if (dragging) {
          dragRotation += (event.clientX - lastX) * 0.015;
          lastX = event.clientX;
        }
      };
      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        lastX = event.clientX;
        container.setPointerCapture(event.pointerId);
      };
      const onPointerUp = () => {
        dragging = false;
      };
      const onPointerLeave = () => {
        pointerX = 0;
        pointerY = 0;
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          dragRotation += event.key === "ArrowRight" ? 0.35 : -0.35;
        }
      };
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointercancel", onPointerUp);
      container.addEventListener("pointerleave", onPointerLeave);
      container.addEventListener("keydown", onKeyDown);
      const resize = new ResizeObserver(() => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        render(performance.now() + 40);
      });
      resize.observe(container);
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        update();
      });
      visibility.observe(container);
      document.addEventListener("visibilitychange", update);
      reducedMotion.addEventListener("change", update);
      update();
      cleanup = () => {
        renderer.setAnimationLoop(null);
        resize.disconnect();
        visibility.disconnect();
        document.removeEventListener("visibilitychange", update);
        reducedMotion.removeEventListener("change", update);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointerup", onPointerUp);
        container.removeEventListener("pointercancel", onPointerUp);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("keydown", onKeyDown);
        knotGeometry.dispose();
        knotMaterial.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        accentMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        delete container.dataset.ready;
        container.tabIndex = -1;
        container.setAttribute("aria-label", "Connected network sculpture.");
      };
    }
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          void initialize().catch(() => {});
        }
      },
      { rootMargin: "250px" },
    );
    lazy.observe(container);
    return () => {
      cancelled = true;
      lazy.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <div className="sculpture-stage">
      <div
        ref={ref}
        className="connection-sculpture"
        tabIndex={-1}
        role="img"
        aria-label="Connected network sculpture."
      >
        <div className="sculpture-fallback" aria-hidden="true">
          <span />
          <i />
          <b />
        </div>
      </div>
      <span className="sculpture-label sculpture-label--one">
        <span /> Your people
      </span>
      <span className="sculpture-label sculpture-label--two">
        <span /> Your connections
      </span>
      <span className="sculpture-caption">
        <MoveUpRight size={13} aria-hidden="true" /> One network. Every
        relationship.
      </span>
      <span className="sculpture-hint">
        Drag to explore · Arrow keys to rotate
      </span>
    </div>
  );
}
