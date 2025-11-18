import { useState, useEffect } from 'react';
import type { RandomNumberConfig, RandomNumberHistoryItem } from '../types';
import { storage, generateId } from '../utils/storage';

const STORAGE_KEY_CONFIG = 'tiny-decisions-random-number-config';
const STORAGE_KEY_HISTORY = 'tiny-decisions-random-number-history';

const DEFAULT_CONFIG: RandomNumberConfig = {
  min: 1,
  max: 100,
  count: 1,
  allowDuplicate: true,
  ordered: false,
};

export const useRandomNumberStore = () => {
  const [config, setConfig] = useState<RandomNumberConfig>(() =>
    storage.get(STORAGE_KEY_CONFIG, DEFAULT_CONFIG)
  );
  const [history, setHistory] = useState<RandomNumberHistoryItem[]>(() =>
    storage.get(STORAGE_KEY_HISTORY, [])
  );
  const [currentResults, setCurrentResults] = useState<number[]>([]);

  // 同步到 localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY_CONFIG, config);
  }, [config]);

  useEffect(() => {
    storage.set(STORAGE_KEY_HISTORY, history);
  }, [history]);

  // 更新配置
  const updateConfig = (updates: Partial<RandomNumberConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // 生成随机数
  const generateNumbers = (): number[] => {
    const { min, max, count, allowDuplicate, ordered } = config;

    // 参数验证
    if (min > max) {
      throw new Error('最小值不能大于最大值');
    }

    const range = max - min + 1;

    // 如果不允许重复，检查范围是否足够
    if (!allowDuplicate && count > range) {
      throw new Error('在不允许重复的情况下，数量不能超过范围');
    }

    const results: number[] = [];
    const used = new Set<number>();

    for (let i = 0; i < count; i++) {
      let num: number;

      if (allowDuplicate) {
        // 允许重复，直接生成
        num = Math.floor(Math.random() * range) + min;
      } else {
        // 不允许重复，需要检查
        do {
          num = Math.floor(Math.random() * range) + min;
        } while (used.has(num));
        used.add(num);
      }

      results.push(num);
    }

    // 如果需要排序
    const finalResults = ordered ? results.sort((a, b) => a - b) : results;

    // 保存结果
    setCurrentResults(finalResults);

    // 添加到历史
    const historyItem: RandomNumberHistoryItem = {
      id: generateId(),
      config: { ...config },
      results: finalResults,
      timestamp: Date.now(),
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 50)); // 最多保留 50 条

    return finalResults;
  };

  // 清除当前结果
  const clearResults = () => {
    setCurrentResults([]);
  };

  // 清除历史
  const clearHistory = () => {
    setHistory([]);
  };

  return {
    config,
    history,
    currentResults,
    updateConfig,
    generateNumbers,
    clearResults,
    clearHistory,
  };
};
