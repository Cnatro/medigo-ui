import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../api/firebase';

export const loginWithGoogle = async () => {
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
  
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();

  return idToken;
};
