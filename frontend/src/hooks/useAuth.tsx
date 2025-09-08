import { use } from 'react';

import AuthContext from '@contexts/AuthContext';

import type { AuthContextValue } from '@contexts/AuthContext';

const useAuth = () => {
  const ctx = use(AuthContext);
  if (!(ctx as undefined | AuthContextValue)) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
};

export default useAuth;
