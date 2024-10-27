'use client'

import { useState, useCallback, useEffect } from 'react'
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

const API_ENDPOINTS = [
  "https://api.groq.com/openai/v1",
  "https://api.deepbricks.ai/v1",
  "https://open.bigmodel.cn/api/paas/v4",
]

const DEFAULT_MODELS = ["gpt-3.5-turbo", "gpt-4", "text-davinci-003"]

export default function ConfigPage() {
  const { config, saveConfig } = useConfig()
  const [models, setModels] = useState(DEFAULT_MODELS)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveConfig = useCallback((newConfig: Partial<typeof config>) => {
    saveConfig(newConfig)
    toast.success('Configuration saved.')
  }, [saveConfig])

  const handleRefreshModels = useCallback(async () => {
    if (!config.baseUrl || !config.apiKey) {
      toast.error('Base URL and API Key are required to refresh models')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${config.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch models')
      }
      
      const data = await response.json()
      setModels(data.data.map((model: any) => model.id))
    } catch (error) {
      console.error('Failed to refresh models:', error)
      toast.error('Failed to refresh models')
    } finally {
      setIsLoading(false)
    }
  }, [config.baseUrl, config.apiKey])

  if (!mounted) {
    return null // or a loading skeleton
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="knowledgeBase">Knowledge Base</Label>
              <Select 
                value={config.knowledgeBase}
                onValueChange={(value) => handleSaveConfig({ knowledgeBase: value })}
              >
                <SelectTrigger id="knowledgeBase">
                  <SelectValue placeholder="Select knowledge base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LLM">LLM</SelectItem>
                  <SelectItem value="大学">大学</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <h1 className="text-3xl font-bold mb-8">API Keys</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>LLM API Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={config.apiKey}
                onChange={(e) => handleSaveConfig({ apiKey: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={config.baseUrl}
                onValueChange={(value) => handleSaveConfig({ baseUrl: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select API endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {API_ENDPOINTS.map((endpoint) => (
                    <SelectItem key={endpoint} value={endpoint}>
                      {endpoint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRefreshModels}
                disabled={!config.baseUrl || !config.apiKey || isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Select 
                value={config.model} 
                onValueChange={(value) => handleSaveConfig({ model: value })}
              >
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
              <Label htmlFor="temperature">Temperature: {config.temperature.toFixed(1)}</Label>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[config.temperature]}
                onValueChange={([value]) => handleSaveConfig({ temperature: value })}
                className="py-4"
              />
            </div>
            <div>
              <Label htmlFor="maxTokens">Max Tokens: {config.maxTokens}</Label>
              <Slider
                id="maxTokens"
                min={50}
                max={4000}
                step={50}
                value={[config.maxTokens]}
                onValueChange={([value]) => handleSaveConfig({ maxTokens: value })}
                className="py-4"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
