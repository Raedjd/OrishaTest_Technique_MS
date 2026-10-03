
import CryptoJS from 'crypto-js';
import {DecodedToken,LoginResult} from "@client/shared/types/auth";
import {MOCK_TOKEN} from "@client/lib/mockAuth";

const ENCRYPTION_KEY ='ProdINNOV@2024$VerySecureKey#Encrypt';
let inMemoryToken: string | null = null;


export async function loginUser(username: string, password: string): Promise<LoginResult> {
    try {
        if (username !== "raed.jaidi@gmail.com" || password !== "Admin123") {
            return {
                success: false,
                error: 401
            };
        }

        const data = {
            access_token: MOCK_TOKEN,
            expires_in: 86400
        };

        const expirationTime = Date.now() + (data.expires_in * 1000);

        inMemoryToken = data.access_token;
        if (typeof window !== 'undefined') {
            const encryptedToken = encryptData(data.access_token);
            syncCookie('auth_token', encryptedToken, data.expires_in);
            syncCookie('token_expiry', expirationTime.toString(), data.expires_in);
        }

        return {
            success: true,
            token: data.access_token
        };

    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 500
        };
    }
}

export const getTokenFromSession = (): string | null => {
    if (typeof window === 'undefined') return null;

    try {
        const encryptedToken = getCookie('auth_token');

        if (!encryptedToken) return null;

        if (isTokenExpired()) {
            logout();
            return null;
        }

        return decryptData(encryptedToken);
    } catch (error) {
        console.error('Error getting token from session:', error);
        return null;
    }
};


export const logout = (): void => {
    inMemoryToken = null;

    if (typeof window !== 'undefined') {
        ['auth_token', 'token_expiry', 'tenant_id'].forEach(key => {
            document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });
    }
};

export const isTokenExpired = (): boolean => {
    if (typeof window === 'undefined') return true;

    try {
        const expiryTime = getCookie('token_expiry');

        if (!expiryTime) return true;

        const expiry = parseInt(expiryTime, 10);
        const currentTime = Date.now();
        return currentTime >= expiry;
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return true;
    }
};


export const getUsername = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const token = getTokenFromSession();
        if (!token) {
            return null;
        }

        const decoded = decodeJWT(token);

        if (decoded?.preferred_username) {
            return decoded?.preferred_username;
        }

        return null;
    } catch (error) {
        return null;
    }
};


export const getUserEmail = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const token = getTokenFromSession();
        if (!token) {
            return null;
        }

        const decoded = decodeJWT(token);

        if (decoded?.email) {
            return decoded?.email;
        }

        return null;
    } catch (error) {
        return null;
    }
};

export const getRoles = (): string[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const token = getTokenFromSession();
        if (!token) {
            return [];
        }

        const decoded = decodeJWT(token);


        if (decoded?.Roles) {
            return Array.isArray(decoded.Roles) ? decoded.Roles : [decoded.Roles];
        }

        return [];
    } catch (error) {
        return [];
    }
};


export const getUserInfo = (): {
    username: string | null;
    email: string | null;
    roles: string[] | []
} => {
    return {
        username: getUsername(),
        email: getUserEmail(),
        roles: getRoles()
    };
};

// ============================================
// Récupérer toutes les infos du token décodé
// ============================================
export const getDecodedToken = (): DecodedToken | null => {
    const token = getTokenFromSession();
    if (!token) return null;

    return decodeJWT(token);
};

const decodeJWT = (token: string): DecodedToken | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Token JWT invalide');
            return null;
        }

        const payload = parts[1];

        // Remplacer les caractères pour le décodage base64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

        // Décoder
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erreur lors du décodage du JWT:', error);
        return null;
    }
};

const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): string | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted || null;
    } catch (error) {
        console.error('Erreur de déchiffrement:', error);
        return null;
    }
};

const syncCookie = (key: string, value: string, expiresIn: number) => {
    if (typeof window !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + expiresIn * 1000);
        const isProd = window.location.protocol === 'https:';
        const sameSite = isProd ? 'None' : 'Lax';
        const secure = isProd ? ';Secure' : '';
        document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/;SameSite=${sameSite}${secure}`;
    }
};

const getCookie = (key: string): string | null => {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(`${key}=`));

    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
};
