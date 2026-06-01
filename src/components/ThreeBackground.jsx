import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = ({
  weatherMain,
  timezoneOffset = 0,
  sunrise,
  sunset,
}) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameRef = useRef(null);
  const texturesRef = useRef({});
  const solarRef = useRef({ timezoneOffset: 0, sunrise: undefined, sunset: undefined });
  const baseObjectsRef = useRef({
    ambientLight: null,
    starField: null,
    starMaterial: null,
    moon: null,
  });
  const dynamicObjectsRef = useRef({
    clouds: [],
    weatherParticles: [],
  });
  const resourcesRef = useRef({
    geometries: [],
    materials: [],
    textures: [],
  });
  const stateRef = useRef({
    phase: 'day',
    lightningFrames: 0,
    weatherMain: weatherMain || 'Clear',
  });

  const getDayPhase = (offsetSeconds, sunriseUnix, sunsetUnix) => {
    const nowUnix = Math.floor(Date.now() / 1000);
    if (sunriseUnix && sunsetUnix) {
      const dawnStart = sunriseUnix - 1800;
      const sunriseEnd = sunriseUnix + 1800;
      const sunsetStart = sunsetUnix - 1800;
      const duskEnd = sunsetUnix + 1800;
      if (nowUnix >= dawnStart && nowUnix <= sunriseEnd) return 'sunrise';
      if (nowUnix > sunriseEnd && nowUnix < sunsetStart) return 'day';
      if (nowUnix >= sunsetStart && nowUnix <= duskEnd) return 'sunset';
      return 'night';
    }
    const utcHour = new Date().getUTCHours();
    const localHour = (utcHour + Math.round((offsetSeconds || 0) / 3600) + 24) % 24;
    if (localHour >= 6 && localHour < 18) return 'day';
    if (localHour >= 18 && localHour < 20) return 'sunset';
    return 'night';
  };

  const pushGeometry = (geometry) => { resourcesRef.current.geometries.push(geometry); return geometry; };
  const pushMaterial = (material) => { resourcesRef.current.materials.push(material); return material; };
  const pushTexture = (texture) => { resourcesRef.current.textures.push(texture); return texture; };

  const applyBackground = () => {
    const scene = sceneRef.current;
    const textures = texturesRef.current;
    const { weatherMain: currentWeather } = stateRef.current;
    const { timezoneOffset: tz, sunrise: sr, sunset: ss } = solarRef.current;
    const phase = getDayPhase(tz, sr, ss);
    if (!scene) return;

    if (phase === 'night') {
      if (textures.nightBackground) scene.background = textures.nightBackground;
      return;
    }
    if (phase === 'sunrise') {
      if (textures.sunriseBackground) {
        scene.background = textures.sunriseBackground;
      } else {
        scene.background = new THREE.Color(0xffb38a);
      }
      return;
    }
    if (phase === 'sunset') {
      if (textures.sunsetBackground) {
        scene.background = textures.sunsetBackground;
      } else {
        scene.background = new THREE.Color(0xff8a65);
      }
      return;
    }

    switch (currentWeather) {
      case 'Rain':
      case 'Drizzle':
        scene.background = new THREE.Color(0x4a6b8a);
        break;
      case 'Clouds':
        scene.background = new THREE.Color(0x87ceeb);
        break;
      case 'Snow':
        scene.background = new THREE.Color(0xe8f4f8);
        break;
      case 'Thunderstorm':
        scene.background = new THREE.Color(0x1a1a2e);
        break;
      case 'Mist':
      case 'Fog':
      case 'Haze':
        scene.background = new THREE.Color(0x8a9bb0);
        break;
      case 'Clear':
      default:
        if (textures.daylightBackground) {
          scene.background = textures.daylightBackground;
        } else {
          scene.background = new THREE.Color(0x87ceeb);
        }
        break;
    }
  };

  const updateCelestialVisibility = () => {
    const { timezoneOffset: tz, sunrise: sr, sunset: ss } = solarRef.current;
    const phase = getDayPhase(tz, sr, ss);
    const isNight = phase === 'night';
    const { moon, starField } = baseObjectsRef.current;
    if (moon) moon.visible = isNight;
    if (starField) starField.visible = isNight;
  };

  const clearDynamicObjects = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    dynamicObjectsRef.current.clouds.forEach((cloud) => {
      scene.remove(cloud);
      cloud.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });
    dynamicObjectsRef.current.weatherParticles.forEach((particle) => {
      scene.remove(particle);
      if (particle.geometry) particle.geometry.dispose();
      if (particle.material) particle.material.dispose();
    });
    dynamicObjectsRef.current.clouds = [];
    dynamicObjectsRef.current.weatherParticles = [];
  };

  const createCloud = (x, y, z, scaleValue = 1) => {
    const scene = sceneRef.current;
    if (!scene) return null;
    const group = new THREE.Group();
    const sphereConfigs = [
      { radius: 0.7, position: [0, 0, 0] },
      { radius: 0.5, position: [-0.8, -0.2, 0] },
      { radius: 0.5, position: [0.8, -0.2, 0] },
      { radius: 0.4, position: [-1.4, -0.35, 0] },
      { radius: 0.4, position: [1.4, -0.35, 0] },
      { radius: 0.45, position: [0.3, 0.4, 0] },
    ];
    sphereConfigs.forEach((config) => {
      const geometry = new THREE.SphereGeometry(config.radius, 20, 20);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...config.position);
      group.add(sphere);
    });
    group.position.set(x, y, z);
    group.scale.setScalar(scaleValue);
    dynamicObjectsRef.current.clouds.push(group);
    scene.add(group);
    return group;
  };

  const createRain = (count) => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (let i = 0; i < count; i += 1) {
      const x = Math.random() * 24 - 12;
      const y = Math.random() * 7 + 8;
      const z = -(Math.random() * 5 + 1);
      const positions = new Float32Array([x, y, z, x, y - 0.4, z]);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({ color: 0xaaaacc, transparent: true, opacity: 0.4 });
      const line = new THREE.Line(geometry, material);
      dynamicObjectsRef.current.weatherParticles.push(line);
      scene.add(line);
    }
  };

  const createSnow = (count) => {
    const scene = sceneRef.current;
    if (!scene) return;
    for (let i = 0; i < count; i += 1) {
      const geometry = new THREE.SphereGeometry(0.07, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
      const flake = new THREE.Mesh(geometry, material);
      flake.position.set(Math.random() * 46 - 23, Math.random() * 26 - 2, -(Math.random() * 16 + 4));
      flake.userData.speed = 0.04;
      flake.userData.offset = Math.random() * Math.PI * 2;
      dynamicObjectsRef.current.weatherParticles.push(flake);
      scene.add(flake);
    }
  };

  const rebuildDynamicScene = () => {
    clearDynamicObjects();
    const { weatherMain: currentWeather } = stateRef.current;
    if (currentWeather === 'Clouds' || currentWeather === 'Rain' || currentWeather === 'Drizzle') {
      for (let i = 0; i < 8; i += 1) {
        createCloud(Math.random() * 24 - 12, Math.random() * 4 + 1, -(Math.random() * 7 + 5), Math.random() * 1 + 0.8);
      }
    }
    if (currentWeather === 'Rain' || currentWeather === 'Drizzle') createRain(600);
    if (currentWeather === 'Thunderstorm') createRain(900);
    if (currentWeather === 'Snow') createSnow(260);
    applyBackground();
  };

  useEffect(() => {
    if (!mountRef.current) return undefined;
    const mountNode = mountRef.current;
    const resources = resourcesRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountNode.appendChild(renderer.domElement);

    stateRef.current.phase = getDayPhase(timezoneOffset, sunrise, sunset);
    stateRef.current.weatherMain = weatherMain || 'Clear';

    const ambientLight = new THREE.AmbientLight(0xffffff, stateRef.current.phase === 'night' ? 0.12 : 0.45);
    scene.add(ambientLight);
    baseObjectsRef.current.ambientLight = ambientLight;

    const textureLoader = new THREE.TextureLoader();

    textureLoader.load('/2k_stars_milky_way.jpg', (texture) => {
      texturesRef.current.nightBackground = pushTexture(texture);
      applyBackground();
    });

    textureLoader.load('/2k_sunrise.jpg', (texture) => {
      texturesRef.current.sunriseBackground = pushTexture(texture);
      applyBackground();
    });

    textureLoader.load('/2k_sunset.jpg', (texture) => {
      texturesRef.current.sunsetBackground = pushTexture(texture);
      applyBackground();
    });

    textureLoader.load('/2k_daylight.jpg', (texture) => {
      texturesRef.current.daylightBackground = pushTexture(texture);
      applyBackground();
    });

    textureLoader.load('/2k_moon.jpg', (texture) => {
      const moonGeometry = pushGeometry(new THREE.SphereGeometry(1.8, 48, 48));
      const moonMaterial = pushMaterial(new THREE.MeshBasicMaterial({ map: pushTexture(texture) }));
      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(5, 4, -8);
      scene.add(moon);
      baseObjectsRef.current.moon = moon;
      moon.visible = false;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 1, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.35, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.75, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    const starTexture = pushTexture(new THREE.CanvasTexture(canvas));
    const starCount = 320;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      starPositions[i3] = Math.random() * 50 - 25;
      starPositions[i3 + 1] = Math.random() * 30 - 15;
      starPositions[i3 + 2] = -(Math.random() * 18 + 6);
    }
    const starGeometry = pushGeometry(new THREE.BufferGeometry());
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = pushMaterial(new THREE.PointsMaterial({
      map: starTexture, size: 0.12, transparent: true, alphaTest: 0.01,
      opacity: 0.95, color: 0xffffff, depthWrite: false,
    }));
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    baseObjectsRef.current.starField = starField;
    baseObjectsRef.current.starMaterial = starMaterial;

    updateCelestialVisibility();
    rebuildDynamicScene();

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animationLoop = () => {
      frameRef.current = window.requestAnimationFrame(animationLoop);
      const rendererInstance = rendererRef.current;
      const sceneInstance = sceneRef.current;
      const cameraInstance = cameraRef.current;
      if (!rendererInstance || !sceneInstance || !cameraInstance) return;

      const time = Date.now() * 0.001;
      const { moon, starField: stars, starMaterial: sMat } = baseObjectsRef.current;
      const { clouds, weatherParticles } = dynamicObjectsRef.current;
      const { weatherMain: currentWeather } = stateRef.current;

      if (moon && moon.visible) moon.rotation.y += 0.0005;

      if (stars && stars.visible) {
        stars.rotation.y += 0.0003;
        if (sMat) {
          sMat.opacity = currentWeather === 'Clouds' || currentWeather === 'Mist'
            ? 0.35 + Math.sin(time * 1.5) * 0.04
            : 0.88 + Math.sin(time * 1.5) * 0.06;
        }
      }

      clouds.forEach((cloud) => {
        cloud.position.x += 0.003;
        if (cloud.position.x > 15) cloud.position.x = -15;
      });

      if (currentWeather === 'Rain' || currentWeather === 'Drizzle' || currentWeather === 'Thunderstorm') {
        weatherParticles.forEach((drop) => {
          const pos = drop.geometry.attributes.position.array;
          pos[1] -= 0.25; pos[4] -= 0.25;
          pos[0] += 0.05; pos[3] += 0.05;
          if (pos[1] < -8) {
            const newX = Math.random() * 24 - 12;
            pos[0] = newX; pos[3] = newX;
            pos[1] = 12; pos[4] = 11.6;
          }
          drop.geometry.attributes.position.needsUpdate = true;
        });
      }

      if (currentWeather === 'Snow') {
        weatherParticles.forEach((flake, index) => {
          flake.position.y -= flake.userData.speed;
          flake.position.x += Math.sin(time + flake.userData.offset + index * 0.02) * 0.01;
          if (flake.position.y < -10) {
            flake.position.y = 12;
            flake.position.x = Math.random() * 46 - 23;
          }
        });
      }

      if (currentWeather === 'Thunderstorm') {
        if (stateRef.current.lightningFrames > 0) {
          sceneInstance.background = new THREE.Color(0x4a4a6a);
          stateRef.current.lightningFrames -= 1;
        } else { applyBackground(); }
        if (Math.random() < 0.006) stateRef.current.lightningFrames = 3;
      } else { applyBackground(); }

      rendererInstance.render(sceneInstance, cameraInstance);
    };
    animationLoop();

    const timeCheckInterval = window.setInterval(() => {
      updateCelestialVisibility();
      applyBackground();
    }, 60000);

    return () => {
      window.clearInterval(timeCheckInterval);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      clearDynamicObjects();
      resources.geometries.forEach((g) => g && g.dispose && g.dispose());
      resources.materials.forEach((m) => m && m.dispose && m.dispose());
      resources.textures.forEach((t) => t && t.dispose && t.dispose());
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement?.parentNode === mountNode) {
          mountNode.removeChild(rendererRef.current.domElement);
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stateRef.current.weatherMain = weatherMain || 'Clear';
    rebuildDynamicScene();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherMain]);

  useEffect(() => {
    solarRef.current = { timezoneOffset, sunrise, sunset };
    const newPhase = getDayPhase(timezoneOffset, sunrise, sunset);
    stateRef.current.phase = newPhase;
    if (baseObjectsRef.current.ambientLight) {
      baseObjectsRef.current.ambientLight.intensity = newPhase === 'night' ? 0.12 : 0.45;
    }
    const isNight = newPhase === 'night';
    if (baseObjectsRef.current.moon) baseObjectsRef.current.moon.visible = isNight;
    if (baseObjectsRef.current.starField) baseObjectsRef.current.starField.visible = isNight;
    applyBackground();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezoneOffset, sunrise, sunset]);

  return (
    <div
      ref={mountRef}
      className="three-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

export default ThreeBackground;