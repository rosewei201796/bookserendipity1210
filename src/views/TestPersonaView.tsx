import React, { useState } from 'react';
import { Button } from '@/components';
import { BookCard, Persona } from '@/types';
import { PERSONAS, generatePersonaCommentary } from '@/services/serendipity';
import { RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TestPersonaView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const testCard: BookCard = {
    id: 'test-1',
    text: '生存还是毁灭，这是一个问题。',
    cardType: 'Quote',
    bookTitle: '哈姆雷特',
    author: '莎士比亚',
    createdAt: new Date().toISOString(),
    userId: 'test-user',
    likesCount: 0,
  };

  const addLog = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = isError ? '❌' : '✅';
    setLogs(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  const handleTest = async () => {
    setIsGenerating(true);
    setResult('');
    setError('');
    setLogs([]);

    addLog('🔧 开始测试 API 调用...');
    addLog(`Persona: ${selectedPersona.emoji} ${selectedPersona.name} (${selectedPersona.nameCn})`);
    addLog(`测试卡片: "${testCard.text}"`);

    try {
      const startTime = Date.now();
      const commentary = await generatePersonaCommentary(testCard, selectedPersona);
      const elapsed = Date.now() - startTime;

      addLog(`✨ 成功生成评论！耗时 ${elapsed}ms`);
      addLog(`字符数: ${commentary.length}`);
      setResult(commentary);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addLog(`错误: ${errorMsg}`, true);
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b-4 border-black flex items-center justify-between px-4 bg-[#FF0000] shrink-0 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/explore')}
            className="w-10 h-10 bg-white text-black flex items-center justify-center border-2 border-transparent hover:bg-gray-100"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h2 className="text-3xl font-black uppercase tracking-tighter">API TEST</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Test Card */}
        <div className="border-4 border-black p-4 bg-gray-50 shadow-brutal">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-black" />
            <span className="font-bold text-xs uppercase text-gray-600">测试卡片</span>
          </div>
          <h3 className="font-black text-lg uppercase mb-1">{testCard.bookTitle}</h3>
          <p className="text-sm font-bold text-gray-600 mb-2">{testCard.author}</p>
          <p className="text-base font-medium">"{testCard.text}"</p>
        </div>

        {/* Persona Selection */}
        <div className="border-4 border-black p-4 bg-white shadow-brutal">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-black" />
            <span className="font-bold text-xs uppercase text-gray-600">选择 Persona</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PERSONAS.map((persona) => (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`p-3 border-4 border-black text-left transition-colors ${
                  selectedPersona.id === persona.id
                    ? 'bg-[#FFD700]'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{persona.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-xs truncate">{persona.name}</div>
                    <div className="font-bold text-xs text-gray-600 truncate">{persona.nameCn}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Button */}
        <div className="flex justify-center">
          <Button
            variant="accent"
            onClick={handleTest}
            loading={isGenerating}
            disabled={isGenerating}
          >
            <RefreshCw size={20} className="mr-2" />
            测试 API 调用
          </Button>
        </div>

        {/* Result */}
        {result && (
          <div className="border-4 border-[#00FF00] p-4 bg-white shadow-brutal">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-bold text-xs uppercase text-green-600">生成成功</span>
            </div>
            <div className="border-l-4 border-[#FFD700] pl-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedPersona.emoji}</span>
                <div>
                  <span className="font-black text-sm">{selectedPersona.name}</span>
                  <span className="text-xs text-gray-600 ml-2">({selectedPersona.nameCn})</span>
                </div>
              </div>
              <p className="font-bold text-base leading-relaxed">{result}</p>
            </div>
            <div className="text-xs font-bold text-gray-600">
              字符数: {result.length} | 预估字数: {Math.round(result.length / 2)}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border-4 border-[#FF0000] p-4 bg-red-50 shadow-brutal">
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={20} className="text-red-600" />
              <span className="font-bold text-xs uppercase text-red-600">调用失败</span>
            </div>
            <p className="font-bold text-sm text-red-800 break-words">{error}</p>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="border-4 border-black p-4 bg-black text-green-400 shadow-brutal">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-400" />
              <span className="font-bold text-xs uppercase">调用日志</span>
            </div>
            <div className="font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* API Configuration Info */}
        <div className="border-4 border-black p-4 bg-blue-50 shadow-brutal">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-600" />
            <span className="font-bold text-xs uppercase text-blue-600">API 配置信息</span>
          </div>
          <div className="space-y-2 text-sm font-bold">
            <div>
              <span className="text-gray-600">Base URL: </span>
              <code className="bg-gray-200 px-2 py-1 text-xs">
                {import.meta.env.VITE_VERTEX_AI_BASE_URL || 'https://llm.jp.one2x.ai'}
              </code>
            </div>
            <div>
              <span className="text-gray-600">Model: </span>
              <code className="bg-gray-200 px-2 py-1 text-xs">
                vertex_ai/gemini-3-pro-preview
              </code>
            </div>
            <div>
              <span className="text-gray-600">API Key: </span>
              <code className="bg-gray-200 px-2 py-1 text-xs">
                {import.meta.env.VITE_VERTEX_AI_API_KEY
                  ? `${import.meta.env.VITE_VERTEX_AI_API_KEY.substring(0, 10)}...`
                  : '未配置 ❌'}
              </code>
            </div>
            <div>
              <span className="text-gray-600">Temperature: </span>
              <code className="bg-gray-200 px-2 py-1 text-xs">0.7</code>
            </div>
            <div>
              <span className="text-gray-600">Max Tokens: </span>
              <code className="bg-gray-200 px-2 py-1 text-xs">8192</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

