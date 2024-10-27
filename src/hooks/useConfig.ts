import { useState, useEffect } from 'react';

interface Config {
    baseUrl: string;
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

export function useConfig() {
    const [config, setConfig] = useState<Config>(() => {
        // Try to load from localStorage on initial render
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('apiConfig');
            return saved ? JSON.parse(saved) : {
                baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
                apiKey: process.env.NEXT_PUBLIC_API_KEY,
                model: "gpt-3.5-turbo",
                temperature: 0.37,
                maxTokens: 160
            };
        }
        return null;
    });

    const saveConfig = (newConfig: Config) => {
        setConfig(newConfig);
        localStorage.setItem('apiConfig', JSON.stringify(newConfig));
    };

    return { config, saveConfig };
}