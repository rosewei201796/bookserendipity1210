/**
 * Debug utility to inspect localStorage data
 * Usage in browser console: 
 *   import { debugStorage } from '@/utils/debugStorage'
 *   debugStorage()
 */

export const debugStorage = () => {
  const STORAGE_KEY = 'ai-book-channels-data';
  const PASSWORDS_KEY = 'ai-book-channels-passwords';

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const passwords = localStorage.getItem(PASSWORDS_KEY);

    console.log('=== AI Book Channels - Storage Debug ===');
    console.log('');
    
    if (data) {
      const parsed = JSON.parse(data);
      console.log('📊 Total Users:', parsed.users?.length || 0);
      console.log('📚 Total Channels:', parsed.channels?.length || 0);
      console.log('👤 Current User ID:', parsed.currentUserId || 'None (logged out)');
      console.log('');
      
      if (parsed.users) {
        console.log('👥 Users:');
        parsed.users.forEach((u: any) => {
          console.log(`  - ${u.username} (${u.email})`);
          console.log(`    ID: ${u.id}`);
          console.log(`    Liked Cards: ${u.likedCardIds?.length || 0}`);
          console.log(`    Created: ${u.createdAt}`);
        });
      }
      
      console.log('');
      
      if (parsed.channels) {
        console.log('📖 Channels:');
        parsed.channels.forEach((ch: any) => {
          console.log(`  - ${ch.name} by ${ch.author || 'Unknown'}`);
          console.log(`    Owner: ${ch.userId}`);
          console.log(`    Cards: ${ch.cards?.length || 0}`);
          console.log(`    Drop to Feed: ${ch.dropToFeed}`);
        });
      }
    } else {
      console.log('❌ No data found in localStorage');
    }

    console.log('');
    console.log('🔐 Passwords stored:', passwords ? Object.keys(JSON.parse(passwords)).length : 0);
    console.log('');
    console.log('=== End Debug ===');
  } catch (error) {
    console.error('Error reading storage:', error);
  }
};

// Make it available globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).debugStorage = debugStorage;
}

