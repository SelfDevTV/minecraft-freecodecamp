import { useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Vector3 } from "three";
import { useKeyboard } from "../hooks/useKeyboard";

const JUMP_SPEED = 2;
const SPEED = 4;

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 100,
    type: "Dynamic",
    position: [0, 1, 10],
  }));

  const { moveForward, jump, moveBackward, moveLeft, moveRight } =
    useKeyboard();

  const pos = useRef([0, 0, 0]);
  const vel = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => (vel.current = v));
  }, [api.velocity]);

  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  const move = () => {
    const zVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    );
    const xVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);
    const direction = new Vector3();

    direction
      .subVectors(zVector, xVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    const { x, z } = direction;
    api.velocity.set(x, vel.current[1], z);
  };

  useFrame(() => {
    camera.position.copy(
      new Vector3(pos.current[0], pos.current[1], pos.current[2])
    );

    move();
    // api.velocity.set(vel);
    if (jump && pos.current[1] < 2) {
      api.velocity.set(vel.current[0], JUMP_SPEED, vel.current[2]);
    }
  });

  return <mesh ref={ref} />;
};
