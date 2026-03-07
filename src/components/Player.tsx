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

    let inputMag = 0;

    if (joystickMove.x !== 0 || joystickMove.y !== 0) {
      moveX = joystickMove.x;
      moveZ = -joystickMove.y;
      inputMag = Math.sqrt(moveX * moveX + moveZ * moveZ);
      if (inputMag > 1) {
        moveX /= inputMag;
        moveZ /= inputMag;
        inputMag = 1;
      }
      running = false;
    } else {
      const moveVector = new THREE.Vector3(moveX, 0, moveZ);
      if (moveVector.lengthSq() > 0) {
        moveVector.normalize();
        moveX = moveVector.x;
        moveZ = moveVector.z;
        inputMag = 1;
      }
    }

    let targetVelocityX = 0;
    let targetVelocityZ = 0;

    if (inputMag > 0) {
      const cameraEuler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      const moveVector = new THREE.Vector3(moveX, 0, moveZ);
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraEuler.y);
      
      const maxSpeed = running ? 7 : 4.5;
      const speed = maxSpeed * inputMag;
      
      targetVelocityX = moveVector.x * speed;
      targetVelocityZ = moveVector.z * speed;

      // Smooth Rotation
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      let diff = targetRotation - playerRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      setPlayerRotation(playerRotation + diff * 10 * delta);

      setAnimState(running ? 'run' : 'walk');
    } else {
      setAnimState('idle');
    }

    // Acceleration and Friction
    const accel = isGrounded.current ? 15 : 5;
    const friction = isGrounded.current ? 12 : 2;
    
    if (inputMag > 0) {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, targetVelocityX, accel * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, targetVelocityZ, accel * delta);
    } else {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, friction * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, friction * delta);
    }

    // Jump Logic
    if ((keys.space || isJumping) && isGrounded.current) {
      velocity.current.y = 8.5;
      isGrounded.current = false;
      setAnimState('jump');
    }

    if (!isGrounded.current) {
      velocity.current.y -= 28 * delta; // Gravity
    }

    // Apply Velocity
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Floor Detection
    let floorY = -2;
    if (room === 'outside') {
      if (Math.abs(position.current.x) < 4 && position.current.z > -2 && position.current.z < 2) {
        floorY = 0.7;
      } else {
        floorY = -1.5;
      }
    }
    
    if (position.current.y <= floorY) {
      position.current.y = floorY;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    // Collisions (Keep existing logic but refined)
    let roomBounds = { minX: -6.6, maxX: 6.6, minZ: -6.6, maxZ: 6.6 };
    let obstacles: { minX: number, maxX: number, minZ: number, maxZ: number }[] = [];

    if (room === 'inside') {
      obstacles = [
        { minX: 0.5, maxX: 6.5, minZ: -6.25, maxZ: -3.75 },
        { minX: -6.6, maxX: -5.0, minZ: -4.0, maxZ: 0.0 },
        { minX: -2.25, maxX: -0.75, minZ: -5.75, maxZ: -4.25 },
        { minX: 5.0, maxX: 6.8, minZ: 4.1, maxZ: 5.9 },
        { minX: 5.5, maxX: 6.5, minZ: -1.0, maxZ: 3.0 },
        { minX: 5.5, maxX: 7.0, minZ: 1.5, maxZ: 4.5 }, // New Cat Area
      ];
    } else if (room === 'bedroom') {
      obstacles = [
        { minX: -4.5, maxX: -0.5, minZ: -6.5, maxZ: -1.5 },
        { minX: -6.5, maxX: -0.5, minZ: 6.3, maxZ: 7.3 },
        { minX: 0.9, maxX: 6.1, minZ: 6.0, maxZ: 7.0 },
        { minX: 6.3, maxX: 7.3, minZ: -3.5, maxZ: 3.5 },
        { minX: -7.3, maxX: -6.3, minZ: -3.5, maxZ: 3.5 },
      ];
    } else if (room === 'bathroom') {
      roomBounds = { minX: -4.6, maxX: 4.6, minZ: -4.6, maxZ: 4.6 };
      obstacles = [
        { minX: 2.5, maxX: 5.0, minZ: -5.0, maxZ: -2.5 },
        { minX: -4.1, maxX: -2.9, minZ: -0.75, maxZ: 0.75 },
        { minX: 4.0, maxX: 5.0, minZ: -1.0, maxZ: 1.0 },
      ];
    } else if (room === 'hallway') {
      roomBounds = { minX: -3.6, maxX: 3.6, minZ: -3.6, maxZ: 3.6 };
    } else if (room === 'studio') {
      obstacles = [
        { minX: -3.0, maxX: 3.0, minZ: -3.5, maxZ: -0.5 },
        { minX: -6.75, maxX: -5.25, minZ: -3.5, maxZ: -0.5 },
        { minX: -6.5, maxX: -4.5, minZ: -5.75, maxZ: -4.25 },
        { minX: 4.0, maxX: 6.0, minZ: -5.25, maxZ: -4.75 },
      ];
    } else if (room === 'outside') {
      roomBounds = { minX: -5.5, maxX: 5.5, minZ: -4.5, maxZ: 9.5 };
      obstacles = [
        { minX: -4, maxX: 4, minZ: -2, maxZ: 2 },
        { minX: -2, maxX: 2, minZ: 4, maxZ: 8 },
      ];
    }

    const playerRadius = 0.3;
    for (const obs of obstacles) {
      if (position.current.x + playerRadius > obs.minX && position.current.x - playerRadius < obs.maxX &&
          position.current.z + playerRadius > obs.minZ && position.current.z - playerRadius < obs.maxZ) {
        const dx1 = Math.abs(position.current.x + playerRadius - obs.minX);
        const dx2 = Math.abs(position.current.x - playerRadius - obs.maxX);
        const dz1 = Math.abs(position.current.z + playerRadius - obs.minZ);
        const dz2 = Math.abs(position.current.z - playerRadius - obs.maxZ);
        const min = Math.min(dx1, dx2, dz1, dz2);
        if (min === dx1) position.current.x = obs.minX - playerRadius;
        else if (min === dx2) position.current.x = obs.maxX + playerRadius;
        else if (min === dz1) position.current.z = obs.minZ - playerRadius;
        else if (min === dz2) position.current.z = obs.maxZ + playerRadius;
      }
    }

    if (position.current.x < roomBounds.minX) position.current.x = roomBounds.minX;
    if (position.current.x > roomBounds.maxX) position.current.x = roomBounds.maxX;
    if (position.current.z < roomBounds.minZ) position.current.z = roomBounds.minZ;
    if (position.current.z > roomBounds.maxZ) position.current.z = roomBounds.maxZ;

    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.y = playerRotation;

    setPlayerPosition([position.current.x, position.current.y, position.current.z]);

    // Camera Follow
    const moveDelta = position.current.clone().sub(prevPosition.current);
    prevPosition.current.copy(position.current);
    if (controls) {
      controls.target.add(moveDelta);
      camera.position.add(moveDelta);
      controls.update();
    }

    // Animations
    animTime.current += delta;
    const t = animTime.current;
    const currentSpeed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);

    if (leftLeg.current && rightLeg.current && leftArm.current && rightArm.current && torso.current && head.current) {
      if (animState === 'idle') {
        const breath = Math.sin(t * 2) * 0.02;
        torso.current.position.y = 0.1 + breath;
        head.current.position.y = 0.7 + breath;
        leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, 0.1);
        rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, 0.1);
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, 0.1);
        rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, 0.1);
      } else if (animState === 'walk' || animState === 'run') {
        const speedMult = currentSpeed * 2.2;
        const angle = Math.min(0.8, currentSpeed * 0.18);
        const bob = Math.abs(Math.sin(t * speedMult)) * 0.05;
        
        torso.current.position.y = 0.1 + bob;
        head.current.position.y = 0.7 + bob;
        
        leftLeg.current.rotation.x = Math.sin(t * speedMult) * angle;
        rightLeg.current.rotation.x = Math.sin(t * speedMult + Math.PI) * angle;
        leftArm.current.rotation.x = Math.sin(t * speedMult + Math.PI) * angle * 0.8;
        rightArm.current.rotation.x = Math.sin(t * speedMult) * angle * 0.8;
      } else if (animState === 'jump') {
        leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, velocity.current.y > 0 ? -0.5 : 0.2, 0.1);
        rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, velocity.current.y > 0 ? 0.3 : 0.2, 0.1);
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, -1, 0.1);
        rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, -1, 0.1);
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
      } else if (isFacingAndClose(new THREE.Vector3(6.2, 0, 3.5), 3)) {
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