import React from 'react';
import { Layout, Button } from '@/components';
import { useAuth } from '@/state/AuthContext';
import { useChannels } from '@/state/ChannelContext';
import { LogOut, Settings, Info } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();
  const { channels } = useChannels();
  const totalCards = channels.reduce((sum, c) => sum + c.cards.length, 0);

  return (
    <Layout>
      {/* Create View style header - Black Theme */}
      <div className="h-16 border-b-4 border-black flex items-center px-4 bg-black shrink-0">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white">PROFILE</h2>
      </div>

      <div className="p-6 flex flex-col gap-6 bg-mondrian-yellow min-h-full">
        {/* User Block */}
        <div className="border-4 border-black bg-white shadow-brutal p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-mondrian-blue border-4 border-black rounded-full mb-4 flex items-center justify-center shadow-brutal-sm">
            <span className="text-4xl font-black text-white uppercase">{user?.username?.[0]}</span>
          </div>
          <h3 className="text-2xl font-black uppercase">{user?.username}</h3>
          <p className="font-bold text-gray-500 uppercase text-sm">{user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border-4 border-black bg-mondrian-red p-4 shadow-brutal text-white">
            <div className="text-4xl font-black">{channels.length}</div>
            <div className="text-xs font-bold uppercase tracking-widest">SETS</div>
          </div>
          <div className="border-4 border-black bg-black p-4 shadow-brutal text-white">
            <div className="text-4xl font-black">{totalCards}</div>
            <div className="text-xs font-bold uppercase tracking-widest">CARDS</div>
          </div>
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-4">
          {[
            { label: 'SETTINGS', icon: Settings, bg: 'bg-white' },
            { label: 'ABOUT', icon: Info, bg: 'bg-white' }
          ].map(item => (
            <button 
              key={item.label}
              className={`h-14 border-4 border-black ${item.bg} flex items-center px-4 gap-4 font-bold uppercase shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
            >
              <item.icon size={24} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 border-t-4 border-black pt-8">
          <Button variant="black" fullWidth onClick={logout} icon={LogOut}>
            DISCONNECT
          </Button>
        </div>
      </div>
    </Layout>
  );
};
