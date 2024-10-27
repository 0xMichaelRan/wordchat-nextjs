import { useState, useCallback } from 'react';

interface Config {
    knowledgeBase: string;
    baseUrl: string;
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

const defaultConfig: Config = {
    knowledgeBase: "LLM",
    baseUrl: "https://api.deepbricks.ai/v1",
    apiKey: "",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
};

export function useConfig() {
    const [config, setConfig] = useState<Config>(() => {
        // Try to load from localStorage on initial render
        if (typeof window !== 'undefined') {
            const storedConfig = localStorage.getItem('config');
            return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
        }
        return defaultConfig;
    });

    const saveConfig = useCallback((newConfig: Partial<Config>) => {
        setConfig(prevConfig => {
            const updatedConfig = { ...prevConfig, ...newConfig };
            if (typeof window !== 'undefined') {
                localStorage.setItem('config', JSON.stringify(updatedConfig));
            }
            return updatedConfig;
        });
    }, []);

    return { config, saveConfig };
}
