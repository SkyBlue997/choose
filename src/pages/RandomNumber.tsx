import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useRandomNumberStore } from '../hooks/useRandomNumberStore';
import { formatTimestamp } from '../utils/storage';

export const RandomNumber: React.FC = () => {
  const { config, history, currentResults, updateConfig, generateNumbers, clearResults } =
    useRandomNumberStore();
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);

    try {
      // 模拟生成动画
      await new Promise((resolve) => setTimeout(resolve, 500));
      generateNumbers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout title="随机数">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 配置区域 */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">设置范围</h3>

          {/* 最小值和最大值 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最小值</label>
              <input
                type="number"
                value={config.min}
                onChange={(e) => updateConfig({ min: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最大值</label>
              <input
                type="number"
                value={config.max}
                onChange={(e) => updateConfig({ max: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* 生成数量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateConfig({ count: Math.max(1, config.count - 1) })}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <input
                type="number"
                min="1"
                value={config.count}
                onChange={(e) => updateConfig({ count: Math.max(1, parseInt(e.target.value) || 1) })}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-center text-lg font-semibold"
              />
              <button
                onClick={() => updateConfig({ count: Math.min(100, config.count + 1) })}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* 选项开关 */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">允许重复</span>
              <input
                type="checkbox"
                checked={config.allowDuplicate}
                onChange={(e) => updateConfig({ allowDuplicate: e.target.checked })}
                className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">按顺序展示</span>
              <input
                type="checkbox"
                checked={config.ordered}
                onChange={(e) => updateConfig({ ordered: e.target.checked })}
                className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-400"
              />
            </label>
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? '生成中...' : '生成随机数'}
        </button>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 结果显示 */}
        {currentResults.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">生成结果</h3>
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                清除
              </button>
            </div>

            {/* 单个结果大号显示 */}
            {currentResults.length === 1 ? (
              <div className="text-center">
                <div className="text-8xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent animate-bounce-in">
                  {currentResults[0]}
                </div>
              </div>
            ) : (
              /* 多个结果网格显示 */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {currentResults.map((num, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {num}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 历史记录 */}
        {history.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">历史记录</h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {showHistory ? '收起' : '展开'}
              </button>
            </div>

            {showHistory && (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        范围: {item.config.min} ~ {item.config.max}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.results.map((num, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-900"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
