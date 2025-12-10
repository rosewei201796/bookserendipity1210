import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/state/AuthContext';
import { ChannelProvider } from '@/state/ChannelContext';
import { ChatProvider } from '@/state/ChatContext';
import { IPhoneFrame } from '@/components';
import {
  AuthView,
  ExploreView,
  MyChannelsView,
  SerendipityView,
  TestPersonaView,
} from '@/views';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public route wrapper (redirect to explore if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthView />
          </PublicRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/channels"
        element={
          <ProtectedRoute>
            <MyChannelsView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/serendipity"
        element={
          <ProtectedRoute>
            <SerendipityView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-api"
        element={<TestPersonaView />}
      />
      <Route path="/" element={<Navigate to="/explore" replace />} />
      <Route path="*" element={<Navigate to="/explore" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChannelProvider>
          <ChatProvider>
            <IPhoneFrame>
              <AppRoutes />
            </IPhoneFrame>
          </ChatProvider>
        </ChannelProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

