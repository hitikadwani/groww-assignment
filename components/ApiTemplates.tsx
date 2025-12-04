'use client'

import { useState } from 'react'
import { ApiConfig, ApiExample, ALL_API_CONFIGS, getApiKey, saveApiKey, replaceApiKey, getApiKeyInstructions } from '@/utils/financialApis'

interface ApiTemplatesProps {
  onSelectTemplate: (url: string, widgetType: 'finance-card' | 'table' | 'chart') => void
}

export default function ApiTemplates({ onSelectTemplate }: ApiTemplatesProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [showKeyInput, setShowKeyInput] = useState<Record<string, boolean>>({})
  const [showInstructions, setShowInstructions] = useState<Record<string, boolean>>({})

  const handleApiKeyChange = (provider: string, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }))
    saveApiKey(provider, key)
  }

  const handleUseExample = (example: ApiExample, config: ApiConfig) => {
    const apiKey = apiKeys[config.provider] || getApiKey(config.provider) || ''
    if (config.requiresApiKey && !apiKey) {
      setShowKeyInput((prev) => ({ ...prev, [config.provider]: true }))
      return
    }
    const finalUrl = config.requiresApiKey
      ? replaceApiKey(example.url, apiKey, config.provider)
      : example.url
    onSelectTemplate(finalUrl, example.widgetType)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
          Select an IndianAPI Template
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Choose a template below. Add your IndianAPI key once and reuse it across all widgets.
        </p>
      </div>

      {ALL_API_CONFIGS.map((config) => {
        const savedKey = getApiKey(config.provider)
        const currentKey = apiKeys[config.provider] || savedKey || ''
        const showInput = showKeyInput[config.provider] || false
        const showHelp = showInstructions[config.provider] || false

        return (
          <div
            key={config.provider}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{config.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {config.rateLimit || 'Rate limits vary'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowInstructions((prev) => ({ ...prev, [config.provider]: !showHelp }))}
                  className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  {showHelp ? 'Hide' : 'Help'}
                </button>
                {config.requiresApiKey && (
                  <button
                    onClick={() => setShowKeyInput((prev) => ({ ...prev, [config.provider]: !showInput }))}
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {showInput ? 'Hide Key' : savedKey ? 'Change Key' : 'Add Key'}
                  </button>
                )}
              </div>
            </div>

            {showHelp && (
              <div className="mb-3 rounded bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                <pre className="whitespace-pre-wrap font-mono">
                  {getApiKeyInstructions(config.provider)}
                </pre>
                <a
                  href={config.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-blue-600 underline dark:text-blue-400"
                >
                  View Documentation →
                </a>
              </div>
            )}

            {showInput && config.requiresApiKey && (
              <div className="mb-3">
                <input
                  type="text"
                  value={currentKey}
                  onChange={(e) => handleApiKeyChange(config.provider, e.target.value)}
                  placeholder={config.apiKeyPlaceholder}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                {savedKey && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">✓ API key saved</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {config.examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUseExample(example, config)}
                  disabled={config.requiresApiKey && !currentKey}
                  className="rounded-lg border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {example.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {example.description}
                  </div>
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    {example.widgetType === 'finance-card' && '📊 Card'}
                    {example.widgetType === 'table' && '📋 Table'}
                    {example.widgetType === 'chart' && '📈 Chart'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

