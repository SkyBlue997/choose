// ========== 转盘相关类型 ==========

export interface WheelOption {
  id: string;
  label: string;
  weight: number;
  color: string;
}

export interface WheelSettings {
  allowDuplicateResults: boolean;  // 允许结果重复
  hideWeights: boolean;             // 隐藏权重（扇区面积相同）
  repeatOptionsToFill: boolean;     // 重复选项填满转盘
}

export interface WheelTheme {
  id: string;
  name: string;
  colors: string[];  // 预设颜色数组
}

export interface Wheel {
  id: string;
  title: string;
  emoji?: string;
  options: WheelOption[];
  theme: WheelTheme;
  settings: WheelSettings;
  createdAt: number;
  updatedAt: number;
}

export interface WheelHistoryItem {
  id: string;
  wheelId: string;
  result: string;
  timestamp: number;
}

// ========== 手指轮盘相关类型 ==========

export interface FingerPlayer {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
}

export interface FingerRouletteConfig {
  winnerCount: number;  // 获胜人数
}

export interface FingerRouletteHistoryItem {
  id: string;
  players: FingerPlayer[];
  winners: FingerPlayer[];
  timestamp: number;
}

// ========== 随机数相关类型 ==========

export interface RandomNumberConfig {
  min: number;
  max: number;
  count: number;
  allowDuplicate: boolean;
  ordered: boolean;  // 是否按顺序展示
}

export interface RandomNumberHistoryItem {
  id: string;
  config: RandomNumberConfig;
  results: number[];
  timestamp: number;
}

// ========== 抛硬币相关类型 ==========

export type CoinSide = 'heads' | 'tails';

export interface CoinStyle {
  id: string;
  name: string;
  headsEmoji: string;
  tailsEmoji: string;
}

export interface CoinFlipStats {
  headsCount: number;
  tailsCount: number;
}

export interface CoinFlipHistoryItem {
  id: string;
  result: CoinSide;
  timestamp: number;
}

// ========== 预设主题和样式 ==========

export const DEFAULT_WHEEL_THEMES: WheelTheme[] = [
  {
    id: 'pastel',
    name: '柔和彩虹',
    colors: ['#FFB6C1', '#FFD700', '#98D8C8', '#B19CD9', '#FFA07A', '#87CEEB'],
  },
  {
    id: 'vibrant',
    name: '活力四射',
    colors: ['#FF6B9D', '#FFA500', '#00D4AA', '#9B59B6', '#FF69B4', '#4FC3F7'],
  },
  {
    id: 'ocean',
    name: '海洋蓝调',
    colors: ['#4DD0E1', '#26C6DA', '#00ACC1', '#0097A7', '#00838F', '#006064'],
  },
  {
    id: 'sunset',
    name: '日落余晖',
    colors: ['#FF7043', '#FF8A65', '#FFAB91', '#FFCCBC', '#FBE9E7', '#FF6F00'],
  },
];

export const DEFAULT_COIN_STYLES: CoinStyle[] = [
  { id: 'panda', name: '熊猫', headsEmoji: '🐼', tailsEmoji: '🎋' },
  { id: 'number', name: '数字', headsEmoji: '1️⃣', tailsEmoji: '0️⃣' },
  { id: 'moon', name: '日月', headsEmoji: '☀️', tailsEmoji: '🌙' },
  { id: 'classic', name: '经典', headsEmoji: '👑', tailsEmoji: '🔰' },
];

export const DEFAULT_PLAYER_COLORS = [
  '#FF6B9D', '#4FC3F7', '#66BB6A', '#FFA726',
  '#AB47BC', '#26C6DA', '#FFCA28', '#EC407A',
  '#5C6BC0', '#26A69A', '#FF7043', '#8D6E63'
];
