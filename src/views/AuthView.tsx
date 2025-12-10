import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/state/AuthContext';
import { Button, Input, StatusBar } from '@/components'; // Directly use components, not Layout wrapper for auth to full control
import { ArrowRight } from 'lucide-react';

export const AuthView: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 新的签名：
      // login(username, password)
      // register(username, password)
      
      let res;
      if (isLogin) {
        res = await login(formData.username, formData.password);
      } else {
        res = await register(formData.username, formData.password);
      }

      if (res.success) {
        navigate('/explore');
      } else {
        setError(res.error || 'FAILED');
      }
    } catch (err) {
        setError('ERROR OCCURRED');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-mondrian-yellow pt-12">
      <StatusBar />
      
      {/* Header */}
      <div className="p-8 border-b-4 border-black bg-white">
        <div className="inline-block p-4 bg-mondrian-red border-4 border-black shadow-brutal mb-6">
          <span className="text-4xl">📚</span>
        </div>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.85]">
          BOOK<br/>CHANNELS
        </h1>
        <p className="mt-4 font-bold uppercase tracking-widest text-xs bg-black text-white inline-block px-2 py-1">
          Mondrian Edition
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-4 border-black">
        <button 
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-4 font-black uppercase text-lg transition-colors border-r-4 border-black
            ${isLogin ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-4 font-black uppercase text-lg transition-colors
            ${!isLogin ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white p-8 flex flex-col gap-6 overflow-y-auto">
        <Input
          label="USERNAME"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="NAME"
        />
        <Input
          label="PASSWORD"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="******"
        />

        {error && (
          <div className="bg-mondrian-red text-white p-4 border-4 border-black font-bold uppercase">
            ⚠️ {error}
          </div>
        )}

        <div className="mt-auto pt-8">
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleSubmit} 
            loading={loading}
            className="h-16 text-xl"
          >
            {isLogin ? 'ENTER SYSTEM' : 'JOIN NETWORK'} <ArrowRight size={24} strokeWidth={3} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
