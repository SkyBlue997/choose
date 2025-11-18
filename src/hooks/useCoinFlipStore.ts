import { useState, useEffect } from 'react';
import type { CoinSide, CoinStyle, CoinFlipStats, CoinFlipHistoryItem } from '../types';
import { DEFAULT_COIN_STYLES } from '../types';
import { storage, generateId } from '../utils/storage';

const STORAGE_KEY_STATS = 'tiny-decisions-coin-flip-stats';
const STORAGE_KEY_HISTORY = 'tiny-decisions-coin-flip-history';
const STORAGE_KEY_STYLE = 'tiny-decisions-coin-flip-style';

export const useCoinFlipStore = () => {
  const [stats, setStats] = useState<CoinFlipStats>(() =>
    storage.get(STORAGE_KEY_STATS, { headsCount: 0, tailsCount: 0 })
  );
  const [history, setHistory] = useState<CoinFlipHistoryItem[]>(() =>
    storage.get(STORAGE_KEY_HISTORY, [])
  );
  const [selectedStyle, setSelectedStyle] = useState<CoinStyle>(() =>
    storage.get(STORAGE_KEY_STYLE, DEFAULT_COIN_STYLES[0])
  );
  const [currentResult, setCurrentResult] = useState<CoinSide | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // 同步到 localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY_STATS, stats);
  }, [stats]);

  useEffect(() => {
    storage.set(STORAGE_KEY_HISTORY, history);
  }, [history]);

  useEffect(() => {
    storage.set(STORAGE_KEY_STYLE, selectedStyle);
  }, [selectedStyle]);

  // 抛硬币
  const flipCoin = async (): Promise<CoinSide> => {
    if (isFlipping) return currentResult || 'heads';

    setIsFlipping(true);

    // 生成随机结果
    const result: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';

    // 模拟翻转动画延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 更新统计
    setStats(prev => ({
      headsCount: prev.headsCount + (result === 'heads' ? 1 : 0),
      tailsCount: prev.tailsCount + (result === 'tails' ? 1 : 0),
    }));

    // 添加到历史
    const historyItem: CoinFlipHistoryItem = {
      id: generateId(),
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 50)); // 最多保留 50 条

    setCurrentResult(result);
    setIsFlipping(false);

    return result;
  };

  // 重置统计
  const resetStats = () => {
    setStats({ headsCount: 0, tailsCount: 0 });
    setCurrentResult(null);
  };

  // 清除历史
  const clearHistory = () => {
    setHistory([]);
  };

  // 切换硬币样式
  const changeStyle = (style: CoinStyle) => {
    setSelectedStyle(style);
  };

  return {
    stats,
    history,
    selectedStyle,
    currentResult,
    isFlipping,
    availableStyles: DEFAULT_COIN_STYLES,
    flipCoin,
    resetStats,
    clearHistory,
    changeStyle,
  };
};
