'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useConfig } from '@/hooks/useConfig'
import { toast } from 'sonner'

// Add this constant for the API endpoints
const API_ENDPOINTS = [
  "https://api.groq.com/openai/v1",
  "https://api.deepbricks.ai/v1",
  "https://open.bigmodel.cn/api/paas/v4",
]

export default function ConfigPage() {
  const { config, saveConfig } = useConfig();
  const [baseUrl, setBaseUrl] = useState(config.baseUrl)
  const [apiKey, setApiKey] = useState(config.apiKey)
  const [model, setModel] = useState(config.model)
  const [temperature, setTemperature] = useState([config.temperature])
  const [maxTokens, setMaxTokens] = useState(String(config.maxTokens))
  const [models, setModels] = useState(["gpt-3.5-turbo", "gpt-4", "text-davinci-003"])
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig = {
      baseUrl,
      apiKey,
      model,
      temperature: temperature[0],
      maxTokens: Number(maxTokens)
    };
    
    saveConfig(newConfig);
    // Optional: Show success message
    toast.success('Configuration saved.', {
      description: "",
      action: {
        label: "Refresh",
        onClick: () => window.location.reload()
      }
    });
  }

  const handleRefreshModels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      console.log("data", data);
      
      setModels(data.data.map((model: any) => model.id));
    } catch (error) {
      console.error('Failed to refresh models:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">API Keys</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>LLM API Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={baseUrl}
                  onValueChange={(value) => setBaseUrl(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select API endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    {API_ENDPOINTS.map((endpoint) => (
                      <SelectItem 
                        key={endpoint} 
                        value={endpoint}
                      >
                        {endpoint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefreshModels}
                  disabled={!baseUrl || isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onValueChange={setTemperature}
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens: {maxTokens}</Label>
                <Slider
                  id="maxTokens"
                  min={50}
                  max={180}
                  step={5}
                  value={[Number(maxTokens)]}
                  onValueChange={(value) => setMaxTokens(String(value[0]))}
                />
              </div>
              <Button type="submit">Save API Settings</Button>
            </form>
          </CardContent>
        </Card>
      </main>
  )
}
