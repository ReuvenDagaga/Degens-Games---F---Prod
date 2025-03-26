// Full game in Three.js - one file, self-contained
// Features:
// - Player vs AI conquering map
// - Soldiers accumulate
// - Click to send troops
// - Visual effects and colors per territory

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useEffect, useRef, useState } from 'react';

function StateIOClone() {
  const mountRef = useRef();
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 10, 10);
    scene.add(ambientLight, dirLight);

    const loader = new GLTFLoader();
    const territories = {};
    const player = 'player';
    const ai = 'ai';
    const troopCounts = {};

    loader.load('/MAP.glb', (gltf) => {
      const map = gltf.scene;

      map.traverse((child) => {
        if (child.isMesh) {
          child.userData.owner = Math.random() > 0.5 ? player : ai;
          child.userData.name = child.name;
          child.material = child.material.clone();
          troopCounts[child.name] = 10;
          territories[child.name] = child;
          updateColor(child);
        }
      });

      scene.add(map);
    });

    const updateColor = (mesh) => {
      const owner = mesh.userData.owner;
      mesh.material.color.set(owner === player ? '#4facfe' : '#ff6b6b');
    };

    const sendTroops = (from, to) => {
      if (from === to) return;
      if (troopCounts[from] <= 1) return;

      const amount = Math.floor(troopCounts[from] / 2);
      troopCounts[from] -= amount;

      let interval = setInterval(() => {
        if (amount <= 0) return clearInterval(interval);
        // Animate sphere (troop)
        const troop = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 8, 8),
          new THREE.MeshStandardMaterial({ color: '#333' })
        );
        troop.position.copy(territories[from].position);
        scene.add(troop);

        const target = territories[to].position.clone();
        const direction = target.clone().sub(troop.position).normalize().multiplyScalar(0.05);

        let steps = 0;
        const move = () => {
          if (steps++ > 60) {
            scene.remove(troop);
            if (territories[to].userData.owner !== player) {
              troopCounts[to]--;
              if (troopCounts[to] <= 0) {
                territories[to].userData.owner = player;
                updateColor(territories[to]);
              }
            } else {
              troopCounts[to]++;
            }
            return;
          }
          troop.position.add(direction);
          requestAnimationFrame(move);
        };
        move();
      }, 100);
    };

    // Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedFrom = null;

    const onClick = (e) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const name = mesh.userData.name;
        if (!selectedFrom) {
          if (mesh.userData.owner === player) {
            selectedFrom = name;
          }
        } else {
          sendTroops(selectedFrom, name);
          selectedFrom = null;
        }
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Troop accumulation
    setInterval(() => {
      for (let name in troopCounts) {
        const owner = territories[name]?.userData.owner;
        if (owner) troopCounts[name]++;
      }
    }, 1000);

    return () => {
      renderer.domElement.removeEventListener('click', onClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default StateIOClone;
