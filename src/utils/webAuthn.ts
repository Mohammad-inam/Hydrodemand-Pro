const BIOMETRIC_STORAGE_KEY = 'hydrodemand_biometric_settings';

export interface BiometricSettings {
  isEnabled: boolean;
  pin: string;
  hasHardwareSupport: boolean;
  registeredCredentialId: string | null;
  lastAuthenticatedAt: string | null;
  autoLockMinutes: number;
}

const DEFAULT_SETTINGS: BiometricSettings = {
  isEnabled: false,
  pin: '1234',
  hasHardwareSupport: false,
  registeredCredentialId: null,
  lastAuthenticatedAt: null,
  autoLockMinutes: 15
};

export function getBiometricSettings(): BiometricSettings {
  try {
    const raw = localStorage.getItem(BIOMETRIC_STORAGE_KEY);
    if (raw) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(raw)
      };
    }
  } catch (err) {
    console.error('Failed to load biometric settings:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveBiometricSettings(settings: BiometricSettings): void {
  try {
    localStorage.setItem(BIOMETRIC_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save biometric settings:', err);
  }
}

export async function checkBiometricHardware(): Promise<boolean> {
  if (window.PublicKeyCredential &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
  return false;
}

export async function registerBiometricPasskey(): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  if (!window.PublicKeyCredential) {
    return { success: false, error: 'WebAuthn is not supported on this browser.' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: 'Hydrodemand Pro Engineering Suite',
          id: window.location.hostname || 'localhost'
        },
        user: {
          id: userId,
          name: 'engineer@hydrodemand.pro',
          displayName: 'Mohammad Inam (Lead Engineer)'
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256
          { alg: -257, type: 'public-key' } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred'
        },
        timeout: 60000
      }
    })) as PublicKeyCredential | null;

    if (credential) {
      return {
        success: true,
        credentialId: credential.id
      };
    }
    return { success: false, error: 'Registration cancelled.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Biometric registration failed.';
    console.warn('WebAuthn registration error:', errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function verifyBiometricPasskey(): Promise<{ success: boolean; error?: string }> {
  if (!window.PublicKeyCredential) {
    return { success: false, error: 'WebAuthn not supported.' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        userVerification: 'preferred',
        timeout: 60000
      }
    });

    if (assertion) {
      return { success: true };
    }
    return { success: false, error: 'Authentication cancelled.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Authentication failed.';
    return { success: false, error: errorMsg };
  }
}
