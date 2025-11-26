import React, { useRef, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { Html, useProgress, Float, useGLTF, MeshDistortMaterial } from "@react-three/drei";
import { Mesh, Box3, Vector3, BufferGeometry } from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { ModelProps } from "../types";

// ローダーコンポーネント
export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <div className="text-xs font-bold text-blue-300 bg-slate-900/80 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30">
          {Math.floor(progress)}%
        </div>
      </div>
    </Html>
  );
}

// デモ用モデル（Sample1, 2で使用）
// ファイルをロードせず、Three.jsのGeometryを生成して表示します
export function Model({ scale = 1, color = "orange", rotationSpeed = 0, enableDistort = false, distort = 0.4, speed = 2 }: ModelProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    // rotationSpeedがマイナスでも動作するように条件を変更（0の場合は加算しても変化しないためそのまま実行）
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale}>
        <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
        {enableDistort ? (
          <MeshDistortMaterial
            color={color}
            roughness={0.2}
            metalness={0.8}
            distort={distort} // 歪みの強さ
            speed={speed} // 歪みのアニメーション速度
          />
        ) : (
          <meshStandardMaterial 
            color={color} 
            roughness={0.3} 
            metalness={0.8} 
          />
        )}
      </mesh>
    </Float>
  );
}

// アップロードされたファイルを表示するモデル（Sample3で使用）
export function UploadedModel({ url, scale = 1, rotationSpeed = 0 }: ModelProps) {
  const { scene } = useGLTF(url || "");
  const ref = useRef<any>(null);
  const { camera } = useThree();

  // モデルのサイズに合わせてカメラ位置などを自動調整するためのロジック
  useEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      
      // モデルを中心に配置
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
    }
  }, [scene]);

  useFrame((state, delta) => {
    // rotationSpeedがマイナスでも動作するように条件を変更
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <primitive 
      ref={ref}
      object={scene} 
      scale={scale} 
    />
  );
}

// PLYファイルをロードして表示するコンポーネント
export function PlyModel({ url, scale = 1, rotationSpeed = 0 }: ModelProps) {
  const geometry = useLoader(PLYLoader, url || "") as BufferGeometry;
  const ref = useRef<any>(null);
  const [autoScale, setAutoScale] = React.useState(1);

  // ジオメトリの前処理: 中心合わせ、法線計算（面がある場合）、自動スケーリング
  useEffect(() => {
    if (!geometry) return;

    try {
      // バウンディングボックスからサイズを計算して自動スケールを決定
      geometry.computeBoundingBox();
      const box = geometry.boundingBox as Box3;
      const size = box.getSize(new Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const desired = 2; // シーン上での目標サイズ (units)
      const auto = maxDim > 0 ? desired / maxDim : 1;
      setAutoScale(auto);

      // 中心を原点へ移動（位置属性を直接移動）
      if (geometry.center) {
        geometry.center();
      } else {
        const center = box.getCenter(new Vector3());
        const pos = geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          pos.setX(i, pos.getX(i) - center.x);
          pos.setY(i, pos.getY(i) - center.y);
          pos.setZ(i, pos.getZ(i) - center.z);
        }
        pos.needsUpdate = true;
      }

      // 面情報がある（indexが存在する）場合のみ法線を計算
      if (!geometry.attributes.normal && geometry.index) {
        geometry.computeVertexNormals();
      }
    } catch (e) {
      // 無害な失敗は無視
    }
  }, [geometry]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });

  if (!geometry) return null;

  const hasVertexColors = Boolean(geometry.attributes.color);

  // 点群（faces/indexがない）なら Points で描画
  if (!geometry.index) {
    return (
      <points ref={ref} geometry={geometry} scale={[autoScale * scale, autoScale * scale, autoScale * scale]}>
        <pointsMaterial size={0.02 * scale} vertexColors={hasVertexColors} sizeAttenuation={true} />
      </points>
    );
  }

  // 通常のメッシュとして描画
  return (
    <mesh ref={ref} geometry={geometry} scale={[autoScale * scale, autoScale * scale, autoScale * scale]}>
      <meshStandardMaterial
        vertexColors={hasVertexColors}
        color={hasVertexColors ? undefined : "#bdbdbd"}
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
}