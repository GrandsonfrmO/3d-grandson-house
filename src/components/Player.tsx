import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';

export function Player({ bounds = { x: [-10, 10], z: [-10, 10] }, room = 'outside', onInteract }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as any;
  
  const navMode = useStore((state: any) => state.navMode);
  const playerPosition = useStore((state: any) => state.playerPosition);
  const setPlayerPosition = useStore((state: any) => state.setPlayerPosition);
  const playerRotation = useStore((state: any) => state.playerRotation);
  const setPlayerRotation = useStore((state: any) => state.setPlayerRotation);
  const joystickMove = useStore((state: any) => state.joystickMove);
  const isJumping = useStore((state: any) => state.isJumping);
  const isRunning = useStore((state: any) => state.isRunning);
  const setInteraction = useStore((state: any) => state.setInteraction);
  
  const shirtColor = useStore((state: any) => state.shirtColor);
  const pantsColor = useStore((state: any) => state.pantsColor);

  const [keys, setKeys] = useState({ w: false, a: false, s: false, d: false, shift: false, space: false });

  // Animation state
  const [animState, setAnimState] = useState('idle');
  const animTime = useRef(0);
  
  // Physics state
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3(...playerPosition));
  const prevPosition = useRef(new THREE.Vector3(...playerPosition));
  const isGrounded = useRef(true);

  // Limbs refs for animation
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (navMode !== 'play') return;
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) setKeys(k => ({ ...k, [key]: true }));
      if (e.key === 'Shift') setKeys(k => ({ ...k, shift: true }));
      if (e.key === ' ') setKeys(k => ({ ...k, space: true }));
      if (e.key === 'e' || e.key === 'E') {
        if (onInteract) onInteract();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (navMode !== 'play') return;
      const key = e.key.toLowerCase();
      if (keys.hasOwnProperty(key)) setKeys(k => ({ ...k, [key]: false }));
      if (e.key === 'Shift') setKeys(k => ({ ...k, shift: false }));
      if (e.key === ' ') setKeys(k => ({ ...k, space: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [navMode, onInteract]);

  useEffect(() => {
    position.current.set(...(playerPosition as [number, number, number]));
    prevPosition.current.set(...(playerPosition as [number, number, number]));
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = playerRotation;
    }
  }, [room]);

  useEffect(() => {
    if (navMode === 'play' && controls && camera) {
      prevPosition.current.copy(position.current);
      const offset = new THREE.Vector3(0, 5, 8); 
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRotation);
      camera.position.copy(position.current).add(offset);
      controls.target.copy(position.current).add(new THREE.Vector3(0, 1, 0));
      controls.update();
    }
  }, [navMode, room, controls, camera]);

  useFrame((state, delta) => {
    if (navMode !== 'play' || !groupRef.current) return;

    let moveX = 0;
    let moveZ = 0;
    let running = keys.shift || isRunning;

    if (keys.w) moveZ -= 1;
    if (keys.s) moveZ += 1;
    if (keys.a) moveX -= 1;
    if (keys.d) moveX += 1;

    let inputMag = 1;

    if (joystickMove.x !== 0 || joystickMove.y !== 0) {
      moveX = joystickMove.x;
      moveZ = -joystickMove.y;
      const mag = Math.sqrt(moveX * moveX + moveZ * moveZ);
      if (mag > 1) {
        moveX /= mag;
        moveZ /= mag;
        inputMag = 1;
      } else {
        inputMag = mag;
      }
      running = false;
    } else {
      const moveVector = new THREE.Vector3(moveX, 0, moveZ);
      if (moveVector.lengthSq() > 0) {
        moveVector.normalize();
        moveX = moveVector.x;
        moveZ = moveVector.z;
      }
    }

    let targetVelocityX = 0;
    let targetVelocityZ = 0;

    if (moveX !== 0 || moveZ !== 0) {
      const cameraEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      const moveVector = new THREE.Vector3(moveX, 0, moveZ);
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraEuler.y);
      
      const maxSpeed = running ? 6 : 4;
      const speed = maxSpeed * inputMag;
      
      targetVelocityX = moveVector.x * speed;
      targetVelocityZ = moveVector.z * speed;

      const targetRotation = Math.atan2(targetVelocityX, targetVelocityZ);
      let diff = targetRotation - playerRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      setPlayerRotation(playerRotation + diff * 12 * delta);

      setAnimState(running ? 'run' : 'walk');
    } else {
      setAnimState('idle');
    }

    const accel = isGrounded.current ? 10 : 3;
    velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelocityX, accel * delta);
    velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelocityZ, accel * delta);

    if ((keys.space || isJumping) && isGrounded.current) {
      velocity.current.y = 8;
      isGrounded.current = false;
      setAnimState('jump');
    }

    if (!isGrounded.current) {
      velocity.current.y -= 25 * delta;
    }

    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    let floorY = -2;
    if (room === 'outside') {
      if (Math.abs(position.current.x) < 4 && position.current.z > -2 && position.current.z < 2) {
        floorY = 0.7;
      } else {
        floorY = -1.5;
      }
    }
    
    const targetY = floorY;

    if (position.current.y <= targetY) {
      position.current.y = targetY;
      velocity.current.y = 0;
      isGrounded.current = true;
      if (animState === 'jump') setAnimState('idle');
    } else {
      isGrounded.current = false;
    }

    // REFINED COLLISION BOUNDS
    let roomBounds = { minX: -6.6, maxX: 6.6, minZ: -6.6, maxZ: 6.6 };
    let obstacles: { minX: number, maxX: number, minZ: number, maxZ: number }[] = [];

    if (room === 'inside') { // Gaming Room
      obstacles = [
        { minX: 0.5, maxX: 6.5, minZ: -6.25, maxZ: -3.75 }, // Desk
        { minX: -6.6, maxX: -5.0, minZ: -4.0, maxZ: 0.0 }, // Sofa
        { minX: -2.25, maxX: -0.75, minZ: -5.75, maxZ: -4.25 }, // Armchair
        { minX: 5.0, maxX: 6.8, minZ: 4.1, maxZ: 5.9 }, // Freezer
        { minX: 5.5, maxX: 6.5, minZ: -1.0, maxZ: 3.0 }, // TV Table
        { minX: -3.0, maxX: -2.0, minZ: 5.0, maxZ: 6.0 }, // Cat House
      ];
    } else if (room === 'bedroom') {
      obstacles = [
        { minX: -4.5, maxX: -0.5, minZ: -6.5, maxZ: -1.5 }, // Bed
        { minX: -6.5, maxX: -0.5, minZ: 6.3, maxZ: 7.3 }, // Black Display
        { minX: 0.9, maxX: 6.1, minZ: 6.0, maxZ: 7.0 }, // Clothing Rack
        { minX: 6.3, maxX: 7.3, minZ: -3.5, maxZ: 3.5 }, // Right Wall Shelves
        { minX: -7.3, maxX: -6.3, minZ: -3.5, maxZ: 3.5 }, // Left Wall Shelves
      ];
    } else if (room === 'bathroom') {
      roomBounds = { minX: -4.6, maxX: 4.6, minZ: -4.6, maxZ: 4.6 };
      obstacles = [
        { minX: 2.5, maxX: 5.0, minZ: -5.0, maxZ: -2.5 }, // Shower
        { minX: -4.1, maxX: -2.9, minZ: -0.75, maxZ: 0.75 }, // Toilet
        { minX: 4.0, maxX: 5.0, minZ: -1.0, maxZ: 1.0 }, // Sink
      ];
    } else if (room === 'hallway') {
      roomBounds = { minX: -3.6, maxX: 3.6, minZ: -3.6, maxZ: 3.6 };
    } else if (room === 'studio') {
      obstacles = [
        { minX: -3.0, maxX: 3.0, minZ: -3.5, maxZ: -0.5 }, // Work Table
        { minX: -6.75, maxX: -5.25, minZ: -3.5, maxZ: -0.5 }, // Wardrobe
        { minX: -6.5, maxX: -4.5, minZ: -5.75, maxZ: -4.25 }, // Small Table
        { minX: 4.0, maxX: 6.0, minZ: -5.25, maxZ: -4.75 }, // T-Shirt Rack
      ];
    } else if (room === 'outside') {
      roomBounds = { minX: -5.5, maxX: 5.5, minZ: -4.5, maxZ: 9.5 };
      obstacles = [
        { minX: -4, maxX: 4, minZ: -2, maxZ: 2 }, // House base
        { minX: -2, maxX: 2, minZ: 4, maxZ: 8 }, // Car
      ];
    }

    if (position.current.x < roomBounds.minX) position.current.x = roomBounds.minX;
    if (position.current.x > roomBounds.maxX) position.current.x = roomBounds.maxX;
    if (position.current.z < roomBounds.minZ) position.current.z = roomBounds.minZ;
    if (position.current.z > roomBounds.maxZ) position.current.z = roomBounds.maxZ;

    const playerRadius = 0.35; // Rayon ajusté pour plus de précision
    for (const obs of obstacles) {
      if (
        position.current.x + playerRadius > obs.minX &&
        position.current.x - playerRadius < obs.maxX &&
        position.current.z + playerRadius > obs.minZ &&
        position.current.z - playerRadius < obs.maxZ
      ) {
        const distLeft = (position.current.x + playerRadius) - obs.minX;
        const distRight = obs.maxX - (position.current.x - playerRadius);
        const distTop = (position.current.z + playerRadius) - obs.minZ;
        const distBottom = obs.maxZ - (position.current.z - playerRadius);

        const minDist = Math.min(distLeft, distRight, distTop, distBottom);
        const epsilon = 0.01;

        if (minDist === distLeft) {
          position.current.x = obs.minX - playerRadius - epsilon;
          velocity.current.x = 0;
        } else if (minDist === distRight) {
          position.current.x = obs.maxX + playerRadius + epsilon;
          velocity.current.x = 0;
        } else if (minDist === distTop) {
          position.current.z = obs.minZ - playerRadius - epsilon;
          velocity.current.z = 0;
        } else if (minDist === distBottom) {
          position.current.z = obs.maxZ + playerRadius + epsilon;
          velocity.current.z = 0;
        }
      }
    }

    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.y = playerRotation;

    setPlayerPosition([position.current.x, position.current.y, position.current.z]);

    const moveDelta = position.current.clone().sub(prevPosition.current);
    prevPosition.current.copy(position.current);

    if (controls) {
      controls.target.add(moveDelta);
      camera.position.add(moveDelta);
      controls.update();
    }

    animTime.current += delta;
    const t = animTime.current;

    if (leftLeg.current && rightLeg.current && leftArm.current && rightArm.current && torso.current && head.current) {
      if (animState === 'idle') {
        const breath = Math.sin(t * 2) * 0.02;
        torso.current.position.y = 0.1 + breath;
        head.current.position.y = 0.7 + breath;
        leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1);
        rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1);
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, 0.1);
        rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, 0.1);
        leftArm.current.rotation.z = THREE.MathUtils.lerp(leftArm.current.rotation.z, 0, 0.1);
        rightArm.current.rotation.z = THREE.MathUtils.lerp(rightArm.current.rotation.z, 0, 0.1);
      } else if (animState === 'walk' || animState === 'run') {
        torso.current.position.y = THREE.MathUtils.lerp(torso.current.position.y, 0.1, 0.1);
        head.current.position.y = THREE.MathUtils.lerp(head.current.position.y, 0.7, 0.1);
        const currentSpeed = Math.sqrt(velocity.current.x * velocity.current.x + velocity.current.z * velocity.current.z);
        const speedMult = currentSpeed * 2.5;
        const angle = Math.min(0.8, currentSpeed * 0.15);
        leftLeg.current.rotation.x = Math.sin(t * speedMult) * angle;
        rightLeg.current.rotation.x = Math.sin(t * speedMult + Math.PI) * angle;
        leftArm.current.rotation.x = Math.sin(t * speedMult + Math.PI) * angle;
        rightArm.current.rotation.x = Math.sin(t * speedMult) * angle;
        leftArm.current.rotation.z = 0.1;
        rightArm.current.rotation.z = -0.1;
      } else if (animState === 'jump') {
        torso.current.position.y = THREE.MathUtils.lerp(torso.current.position.y, 0.1, 0.1);
        head.current.position.y = THREE.MathUtils.lerp(head.current.position.y, 0.7, 0.1);
        if (velocity.current.y > 0) {
          leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, -0.4, 0.2);
          rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0.2, 0.2);
          leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -0.8, 0.2);
          rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, -0.8, 0.2);
        } else {
          leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0.1, 0.2);
          rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0.1, 0.2);
          leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0.5, 0.2);
          rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0.5, 0.2);
        }
      }
    }

    checkInteractions(position.current, room);
  });

  const checkInteractions = (pos: THREE.Vector3, currentRoom: string) => {
    let canInt = false;
    let type = null;
    let target = null;
    let text = '';

    const isFacingAndClose = (targetPos: THREE.Vector3, maxDist: number = 2.5, maxAngle: number = Math.PI / 1.5) => {
      const dist = pos.distanceTo(targetPos);
      if (dist > maxDist) return false;
      if (dist < 1.8) return true;
      const dirToTarget = targetPos.clone().sub(pos).normalize();
      const playerForward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerRotation);
      const angle = playerForward.angleTo(dirToTarget);
      return angle < maxAngle;
    };

    if (currentRoom === 'inside') {
      if (isFacingAndClose(new THREE.Vector3(3.5, 0, -4), 3)) {
        canInt = true; type = 'pc'; target = 'computer'; text = 'Utiliser le bureau';
      } else if (isFacingAndClose(new THREE.Vector3(-1.8, 0, 6.0), 3)) {
        canInt = true; type = 'cat'; target = 'cat_game'; text = 'Jouer avec le chat';
      } else if (isFacingAndClose(new THREE.Vector3(-6.9, 0, 3), 3)) {
        canInt = true; type = 'door'; target = 'hallway'; text = 'Entrer dans le couloir';
      } else if (isFacingAndClose(new THREE.Vector3(0, 0, 7), 2.5)) {
        canInt = true; type = 'door'; target = 'outside'; text = 'Sortir de la maison';
      } else if (isFacingAndClose(new THREE.Vector3(-1.8, 0.5, 6.9), 2.5)) {
        canInt = true; type = 'switch'; target = 'neon'; text = 'Mode Néon';
      }
    } else if (currentRoom === 'outside') {
      if (isFacingAndClose(new THREE.Vector3(2, 0, 2), 3)) {
        canInt = true; type = 'door'; target = 'inside'; text = 'Entrer dans la maison';
      } else if (isFacingAndClose(new THREE.Vector3(-2, 0, 2), 3)) {
        canInt = true; type = 'door'; target = 'studio'; text = 'Entrer dans le studio';
      }
    } else if (currentRoom === 'hallway') {
      if (isFacingAndClose(new THREE.Vector3(0, 0, 3.9), 2.5)) {
        canInt = true; type = 'door'; target = 'inside'; text = 'Aller au Gaming Room';
      } else if (isFacingAndClose(new THREE.Vector3(0, 0, -3.9), 2.5)) {
        canInt = true; type = 'door'; target = 'bedroom'; text = 'Aller à la chambre';
      } else if (isFacingAndClose(new THREE.Vector3(3.9, 0, 0), 2.5)) {
        canInt = true; type = 'door'; target = 'bathroom'; text = 'Aller à la salle de bain';
      }
    } else if (currentRoom === 'bedroom') {
      if (isFacingAndClose(new THREE.Vector3(4, 0, -6.9), 2.5)) {
        canInt = true; type = 'door'; target = 'hallway'; text = 'Sortir dans le couloir';
      } else if (isFacingAndClose(new THREE.Vector3(1.5, 0, 1), 3)) {
        canInt = true; type = 'basketball'; target = 'basketball_game'; text = 'Jouer au Basket';
      } else if (isFacingAndClose(new THREE.Vector3(-3.5, 0, 6.8), 3.5) || isFacingAndClose(new THREE.Vector3(3.5, 0, 6.5), 3.5)) {
        canInt = true; type = 'clothes'; target = 'customize'; text = 'Changer de tenue';
      } else if (isFacingAndClose(new THREE.Vector3(2.5, 0.5, -6.9), 2.5)) {
        canInt = true; type = 'switch'; target = 'neon'; text = 'Mode Néon';
      }
    } else if (currentRoom === 'studio') {
      if (isFacingAndClose(new THREE.Vector3(0, 0, 4.9), 2.5)) {
        canInt = true; type = 'door'; target = 'outside'; text = 'Sortir de la maison';
      } else if (isFacingAndClose(new THREE.Vector3(0, 0, -2), 3)) {
        canInt = true; type = 'tablet'; target = 'studio_game'; text = 'Dessiner';
      }
    }

    setInteraction(canInt, type, target, text);
  };

  if (navMode !== 'play') return null;

  const playerScale = room === 'outside' ? 0.85 : 1.6;
  const playerYOffset = 1.1 * playerScale;

  return (
    <group ref={groupRef}>
      <group position={[0, playerYOffset, 0]} scale={playerScale}>
        <mesh position={[0, 0.7, 0]} castShadow ref={head}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow ref={torso}>
          <boxGeometry args={[0.6, 0.8, 0.3]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <group position={[-0.4, 0.4, 0]} ref={leftArm}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
        </group>
        <group position={[0.4, 0.4, 0]} ref={rightArm}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
        </group>
        <group position={[-0.15, -0.3, 0]} ref={leftLeg}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
        <group position={[0.15, -0.3, 0]} ref={rightLeg}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.25, 0.8, 0.25]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      </group>
    </group>
  );
}