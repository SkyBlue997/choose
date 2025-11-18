import { useState, useEffect } from 'react';
import type { FingerPlayer, FingerRouletteConfig, FingerRouletteHistoryItem } from '../types';
import { DEFAULT_PLAYER_COLORS } from '../types';
import { storage, generateId } from '../utils/storage';

const STORAGE_KEY_CONFIG = 'tiny-decisions-finger-roulette-config';
const STORAGE_KEY_HISTORY = 'tiny-decisions-finger-roulette-history';

const DEFAULT_CONFIG: FingerRouletteConfig = {
  winnerCount: 1,
};

export const useFingerRouletteStore = () => {
  const [config, setConfig] = useState<FingerRouletteConfig>(() =>
    storage.get(STORAGE_KEY_CONFIG, DEFAULT_CONFIG)
  );
  const [history, setHistory] = useState<FingerRouletteHistoryItem[]>(() =>
    storage.get(STORAGE_KEY_HISTORY, [])
  );
  const [players, setPlayers] = useState<FingerPlayer[]>([]);
  const [winners, setWinners] = useState<FingerPlayer[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // 同步到 localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY_CONFIG, config);
  }, [config]);

  useEffect(() => {
    storage.set(STORAGE_KEY_HISTORY, history);
  }, [history]);

  // 更新配置
  const updateConfig = (updates: Partial<FingerRouletteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // 添加玩家
  const addPlayer = (position: { x: number; y: number }, name?: string) => {
    const playerNumber = players.length + 1;
    const colorIndex = (players.length) % DEFAULT_PLAYER_COLORS.length;

    const newPlayer: FingerPlayer = {
      id: generateId(),
      name: name || `P${playerNumber}`,
      color: DEFAULT_PLAYER_COLORS[colorIndex],
      position,
    };

    setPlayers(prev => [...prev, newPlayer]);
    return newPlayer;
  };

  // 移除玩家
  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // 更新玩家名称
  const updatePlayerName = (playerId: string, name: string) => {
    setPlayers(prev =>
      prev.map(p => (p.id === playerId ? { ...p, name } : p))
    );
  };

  // 清空所有玩家
  const clearPlayers = () => {
    setPlayers([]);
    setWinners([]);
  };

  // 开始抽选
  const selectWinners = async (): Promise<FingerPlayer[]> => {
    if (players.length === 0 || isSelecting) {
      return [];
    }

    setIsSelecting(true);

    // 确保获胜人数不超过玩家总数
    const actualWinnerCount = Math.min(config.winnerCount, players.length);

    // 随机打乱玩家顺序
    const shuffled = [...players].sort(() => Math.random() - 0.5);

    // 选择获胜者
    const selectedWinners = shuffled.slice(0, actualWinnerCount);

    // 模拟抽选动画延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    setWinners(selectedWinners);

    // 添加到历史
    const historyItem: FingerRouletteHistoryItem = {
      id: generateId(),
      players: [...players],
      winners: selectedWinners,
      timestamp: Date.now(),
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 50)); // 最多保留 50 条

    setIsSelecting(false);

    return selectedWinners;
  };

  // 重新开始
  const reset = () => {
    setPlayers([]);
    setWinners([]);
    setIsSelecting(false);
  };

  // 清除历史
  const clearHistory = () => {
    setHistory([]);
  };

  return {
    config,
    history,
    players,
    winners,
    isSelecting,
    updateConfig,
    addPlayer,
    removePlayer,
    updatePlayerName,
    clearPlayers,
    selectWinners,
    reset,
    clearHistory,
  };
};
