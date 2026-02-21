import * as SecureStore from 'expo-secure-store';

export async function encryptData(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function decryptData(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}

export async function removeData(key: string) {
    await SecureStore.deleteItemAsync(key);
}
