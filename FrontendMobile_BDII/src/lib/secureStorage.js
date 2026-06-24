import * as SecureStore from "expo-secure-store";

export const TOKEN_KEY = "ucu_mundial_token";

export const secureStorage = {
    get: async (key) => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            return null;
        }
    },
    set: async (key, value) => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch {
            // silent fail
        }
    },
    remove: async (key) => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch {
            // silent fail
        }
    },
};
