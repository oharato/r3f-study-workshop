import React, { Suspense, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Center } from "@react-three/drei";
import { ArrowLeft, UploadCloud, FileBox, CheckCircle2, AlertCircle, Box, Settings2, ZoomIn, RotateCw, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Loader, UploadedModel, PlyModel } from "../components/SceneComponents";
import { CodeBlock } from "../components/CodeBlock";

export default function Sample3() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Controls
  const [scale, setScale] = useState(1.0);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [envIntensity, setEnvIntensity] = useState(1.0);
  const [envPreset, setEnvPreset] = useState("city");

  const envPresets = [
    "apartment",
    "city",
    "dawn",
    "forest",
    "lobby",
    "night",
    "park",
    "studio",
    "sunset",
    "warehouse"
  ];

  // File Input Handler
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf') && !file.name.endsWith('.ply')) {
      setError("Please upload a .glb, .gltf or .ply file.");
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setFileName(file.name);
  }, []);

  const sampleCode = `
import { useGLTF } from "@react-three/drei";

// アップロードされたファイルを表示するコンポーネント
export function UploadedModel({ url, scale, rotationSpeed }) {
  // useGLTF: GLB/GLTFファイルをロードしてシーンオブジェクトを返す
  // 外部URLやBlob URLに対応しています
  const { scene } = useGLTF(url);
  const ref = useRef();
  
  // モデルサイズに合わせて位置を自動調整するロジック(省略)
  // ...
  
  // useFrameで回転アニメーションを適用
  // 親コンポーネントから受け取った rotationSpeed を使用
  useFrame((state, delta) => {
    if (rotationSpeed !== 0 && ref.current) {
      ref.current.rotation.y += delta * rotationSpeed;
    }
  });
  
  // primitive: Three.jsのオブジェクト(scene)をそのままReactツリーに追加します
  return <primitive object={scene} ref={ref} scale={scale} />;
}

// 【親コンポーネントでのファイル処理】
const handleFileChange = (e) => {
  const file = e.target.files[0];
  // URL.createObjectURL(): 
  // ブラウザのメモリ上にあるファイルオブジェクトへの一時的なアクセスURLを生成
  // これにより、サーバーにアップロードせずにローカルファイルを表示できます
  const url = URL.createObjectURL(file);
  setFileUrl(url);
};
`;

  return (
    <div className="w-full pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
           <Link to="/extra" className="text-slate-500 hover:text-slate-400 flex items-center gap-1 text-md font-medium">
             <ArrowLeft size={16} /> Back to Bonus: AI
           </Link>
             <Link to="/sample3" className="text-blue-600 hover:underline flex items-center gap-1 text-md font-medium">
              Next:  Fin <ArrowRight size={16} />
             </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Viewer Area (Main) */}
          <div className="lg:col-span-8 h-[500px] lg:h-[600px] bg-slate-900 rounded-3xl shadow-xl overflow-hidden relative">
            {!fileUrl ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-500 gap-4">
                    <Box size={64} strokeWidth={1} />
                    <p>Upload a model to view it in 3D space</p>
                </div>
            ) : (
                <Canvas camera={{ position: [0, 2, 5], fov: 45 }} shadows>
                    <color attach="background" args={['#111827']} />
                    <ambientLight intensity={0.8} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    
                    <Suspense fallback={<Loader />}>
                        <Center>
                            {fileName && fileName.toLowerCase().endsWith('.ply') ? (
                              <PlyModel url={fileUrl} scale={scale} rotationSpeed={rotationSpeed} />
                            ) : (
                              <UploadedModel url={fileUrl} scale={scale} rotationSpeed={rotationSpeed} />
                            )}
                        </Center>
                        <Environment preset={envPreset as any} environmentIntensity={envIntensity} />
                        <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="black" />
                    </Suspense>
                    
                    <OrbitControls makeDefault />
                </Canvas>
            )}
            
            <div className="absolute bottom-4 right-6 text-xs text-slate-500 pointer-events-none">
              Viewer Environment: {envPreset.charAt(0).toUpperCase() + envPreset.slice(1)} • Auto-Centered
            </div>
          </div>

          {/* Upload & Controls Area (Side) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upload Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <UploadCloud className="text-blue-600" size={20} />
                    Upload File
                </h3>
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-1 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                      <p className="text-xs text-slate-500">.GLB, .GLTF or .PLY files</p>
                    </div>
                    <input type="file" className="hidden" accept=".glb,.gltf,.ply" onChange={handleFileChange} />
                </label>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {fileName && !error && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                         <CheckCircle2 size={16} /> Loaded: {fileName}
                    </div>
                )}
            </div>

            {/* Controls Panel (Only shows when file is loaded) */}
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-opacity duration-300 ${!fileUrl ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
               <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Settings2 className="text-slate-900" size={20} />
                <h4 className="font-bold text-lg text-slate-900">Viewer Settings</h4>
              </div>

              <div className="space-y-6">
                {/* Scale Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <ZoomIn size={16} /> Scale
                    </div>
                    <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{scale.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                </div>

                {/* Rotation Speed Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <RotateCw size={16} /> Rotation Speed
                    </div>
                    <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded w-12 text-center">
                        {rotationSpeed.toFixed(1)}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                        type="range"
                        min="-5.0"
                        max="5.0"
                        step="0.1"
                        value={rotationSpeed}
                        onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                        <span>Left (-5.0)</span>
                        <span>Stop (0)</span>
                        <span>Right (5.0)</span>
                    </div>
                  </div>
                </div>

                 {/* Environment Settings */}
                 <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <span className="text-lg leading-none">☀</span> Lighting
                  </h5>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                      <ImageIcon size={16} />
                      Env Preset
                    </div>
                    <select
                      value={envPreset}
                      onChange={(e) => setEnvPreset(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium appearance-none cursor-pointer"
                    >
                      {envPresets.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Intensity Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 pl-6">Intensity</span>
                      <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{envIntensity.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3.0"
                      step="0.1"
                      value={envIntensity}
                      onChange={(e) => setEnvIntensity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <FileBox className="text-blue-600" size={16} />
                    What is GLTF?
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                    <strong>GLTF</strong> はWeb向けの軽量な3Dフォーマットです。<code>useGLTF</code> フックを使うことで、Reactコンポーネントとして簡単に扱えます。
                </p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Code Section (Bottom) */}
      <div className="w-full bg-slate-900 py-12 px-4 md:px-8 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-2">Implementation Details</h3>
            <p className="text-slate-400 mb-8">ユーザーがアップロードしたファイルをブラウザのメモリ上でURL化し、それを`useGLTF`フックに渡すことで動的にロードします。</p>
            <CodeBlock title="Sample3.tsx (Excerpt)" code={sampleCode} />
        </div>
      </div>
    </div>
  );
}