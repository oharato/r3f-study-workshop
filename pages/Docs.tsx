import { ArrowLeft, Book, ExternalLink, Github, Layers } from "lucide-react";
import { Link } from "react-router-dom";

export default function Docs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Navigation */}
      <div className="mb-12">
           <Link to="/fin" className="text-slate-400 hover:text-white flex items-center gap-1 text-md font-medium transition-colors">
             <ArrowLeft size={16} /> Back to Finish
           </Link>
      </div>

      <h1 className="text-3xl font-bold text-slate-100 mb-2">Official References</h1>
      <p className="text-slate-300 mb-12">
        さらに深く学びたい方のための、公式ドキュメントリンク集です。<br />
        様々なサンプルページがあるのでお気軽に覗いてみてください！
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* R3F */}
        <a 
          href="https://r3f.docs.pmnd.rs/getting-started/introduction" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group block p-8 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50 transition-all hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl border border-blue-500/20">
              <Layers size={32} />
            </div>
            <ExternalLink className="text-slate-500 group-hover:text-blue-400 transition-colors" size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
            React Three Fiber
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            ReactのレンダラーとしてThree.jsを扱うためのコアライブラリ。
            APIリファレンスや基本的な使い方はこちら。
          </p>
        </a>

        {/* Drei */}
        <a 
          href="https://drei.docs.pmnd.rs/getting-started/introduction" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group block p-8 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl border border-purple-500/20">
              <Book size={32} />
            </div>
            <ExternalLink className="text-slate-500 group-hover:text-purple-400 transition-colors" size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
            Drei
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            R3Fのための便利なヘルパーライブラリ集。
            OrbitControls, Environment, Text, Loaderなど、よく使う機能はここから探せます。
          </p>
        </a>
      </div>
      {/* リポジトリ */}
      <h1 className="text-3xl font-bold text-slate-100 my-8">Github Repository</h1>
      <a 
        href="https://github.com/shiryu2002/r3f-study-workshop"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-12 sgroup block p-8 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all hover:-translate-y-1"
      >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl border border-purple-500/20">
              <Github size={32} />
            </div>
            <ExternalLink className="text-slate-500 group-hover:text-purple-400 transition-colors" size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">
            Repository
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            このWEBサイトのリポジトリです。<br />
            Github Actionを使ってGithub Pagesへ自動デプロイしています。
          </p>
      </a>
    </div>
  );
}