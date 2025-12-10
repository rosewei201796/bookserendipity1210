import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components';
import { Zap } from 'lucide-react';
import { useAuth } from '@/state/AuthContext';
import { useChannels } from '@/state/ChannelContext';

export const CreateView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { createChannelWithCards } = useChannels();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim() || !user) return;
    setIsGenerating(true);
    
    try {
      // 使用冷启动方法创建 channel（5-7 张卡片）
      await createChannelWithCards(prompt.substring(0, 50), undefined, true);
        
      // Navigate to library to show the result
      alert(`Successfully generated channel for "${prompt}"!`);
      setPrompt('');
      navigate('/channels');
      
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate cards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="h-16 border-b-4 border-black flex items-center px-4 bg-[#FFD700] shrink-0">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Create</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-24 bg-white">
        
        {/* Input Block */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold uppercase bg-black text-white px-2 py-1 w-max">Prompt</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="DESCRIBE THE STRUCTURE..."
              className="w-full h-48 border-4 border-black p-4 text-xl font-bold uppercase resize-none focus:outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-4">
          {['Abstract', 'Linear', 'Cubist', 'Solid'].map((tag, idx) => (
            <button 
              key={tag} 
              className={`h-12 border-4 border-black font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                ${idx % 2 === 0 ? 'bg-white text-black' : 'bg-[#0000FF] text-white'}
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Action Footer - Sticky at bottom */}
      <div className="p-6 border-t-4 border-black bg-gray-100 shrink-0 mt-auto">
        <button 
          onClick={handleGenerate}
          disabled={!prompt || isGenerating}
          className={`w-full h-16 border-4 border-black text-xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            ${prompt 
              ? 'bg-white text-black hover:bg-gray-50' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none border-gray-400'}`}
        >
          {isGenerating ? 'GENERATING...' : 'GENERATE'}
          <Zap size={24} fill="currentColor" strokeWidth={3} />
        </button>
      </div>
    </Layout>
  );
};
