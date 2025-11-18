import { useState, useEffect } from 'react';
import type { Wheel, WheelOption, WheelHistoryItem, WheelSettings } from '../types';
import { DEFAULT_WHEEL_THEMES } from '../types';
import { storage, generateId } from '../utils/storage';

const STORAGE_KEY_WHEELS = 'tiny-decisions-wheels';
const STORAGE_KEY_WHEEL_HISTORY = 'tiny-decisions-wheel-history';

export const useWheelsStore = () => {
  const [wheels, setWheels] = useState<Wheel[]>(() =>
    storage.get(STORAGE_KEY_WHEELS, [])
  );
  const [history, setHistory] = useState<WheelHistoryItem[]>(() =>
    storage.get(STORAGE_KEY_WHEEL_HISTORY, [])
  );

  // 同步到 localStorage
  useEffect(() => {
    storage.set(STORAGE_KEY_WHEELS, wheels);
  }, [wheels]);

  useEffect(() => {
    storage.set(STORAGE_KEY_WHEEL_HISTORY, history);
  }, [history]);

  // 创建新转盘
  const createWheel = (title: string): Wheel => {
    const newWheel: Wheel = {
      id: generateId(),
      title,
      emoji: '🎯',
      options: [
        { id: generateId(), label: '选项1', weight: 1, color: DEFAULT_WHEEL_THEMES[0].colors[0] },
        { id: generateId(), label: '选项2', weight: 1, color: DEFAULT_WHEEL_THEMES[0].colors[1] },
      ],
      theme: DEFAULT_WHEEL_THEMES[0],
      settings: {
        allowDuplicateResults: true,
        hideWeights: false,
        repeatOptionsToFill: false,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setWheels(prev => [newWheel, ...prev]);
    return newWheel;
  };

  // 更新转盘
  const updateWheel = (id: string, updates: Partial<Wheel>) => {
    setWheels(prev =>
      prev.map(wheel =>
        wheel.id === id
          ? { ...wheel, ...updates, updatedAt: Date.now() }
          : wheel
      )
    );
  };

  // 删除转盘
  const deleteWheel = (id: string) => {
    setWheels(prev => prev.filter(wheel => wheel.id !== id));
    // 同时删除相关历史记录
    setHistory(prev => prev.filter(item => item.wheelId !== id));
  };

  // 添加选项
  const addOption = (wheelId: string, label: string = '新选项') => {
    setWheels(prev =>
      prev.map(wheel => {
        if (wheel.id !== wheelId) return wheel;

        const colorIndex = wheel.options.length % wheel.theme.colors.length;
        const newOption: WheelOption = {
          id: generateId(),
          label,
          weight: 1,
          color: wheel.theme.colors[colorIndex],
        };

        return {
          ...wheel,
          options: [...wheel.options, newOption],
          updatedAt: Date.now(),
        };
      })
    );
  };

  // 更新选项
  const updateOption = (wheelId: string, optionId: string, updates: Partial<WheelOption>) => {
    setWheels(prev =>
      prev.map(wheel => {
        if (wheel.id !== wheelId) return wheel;

        return {
          ...wheel,
          options: wheel.options.map(option =>
            option.id === optionId ? { ...option, ...updates } : option
          ),
          updatedAt: Date.now(),
        };
      })
    );
  };

  // 删除选项
  const deleteOption = (wheelId: string, optionId: string) => {
    setWheels(prev =>
      prev.map(wheel => {
        if (wheel.id !== wheelId) return wheel;

        return {
          ...wheel,
          options: wheel.options.filter(option => option.id !== optionId),
          updatedAt: Date.now(),
        };
      })
    );
  };

  // 批量添加选项
  const batchAddOptions = (wheelId: string, labels: string[]) => {
    setWheels(prev =>
      prev.map(wheel => {
        if (wheel.id !== wheelId) return wheel;

        const newOptions: WheelOption[] = labels.map((label, index) => {
          const colorIndex = (wheel.options.length + index) % wheel.theme.colors.length;
          return {
            id: generateId(),
            label: label.trim(),
            weight: 1,
            color: wheel.theme.colors[colorIndex],
          };
        });

        return {
          ...wheel,
          options: [...wheel.options, ...newOptions],
          updatedAt: Date.now(),
        };
      })
    );
  };

  // 更新转盘设置
  const updateSettings = (wheelId: string, settings: Partial<WheelSettings>) => {
    setWheels(prev =>
      prev.map(wheel =>
        wheel.id === wheelId
          ? { ...wheel, settings: { ...wheel.settings, ...settings }, updatedAt: Date.now() }
          : wheel
      )
    );
  };

  // 添加历史记录
  const addHistory = (wheelId: string, result: string) => {
    const newHistoryItem: WheelHistoryItem = {
      id: generateId(),
      wheelId,
      result,
      timestamp: Date.now(),
    };

    setHistory(prev => [newHistoryItem, ...prev].slice(0, 100)); // 最多保留 100 条
  };

  // 获取某个转盘的历史记录
  const getWheelHistory = (wheelId: string, limit: number = 10): WheelHistoryItem[] => {
    return history.filter(item => item.wheelId === wheelId).slice(0, limit);
  };

  // 根据权重抽取结果
  const spinWheel = (wheel: Wheel): string => {
    const { options } = wheel;

    if (options.length === 0) {
      return '没有可选项';
    }

    // 计算总权重
    const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);

    // 生成随机数
    let random = Math.random() * totalWeight;

    // 找到对应的选项
    for (const option of options) {
      random -= option.weight;
      if (random <= 0) {
        return option.label;
      }
    }

    // 兜底返回最后一个选项
    return options[options.length - 1].label;
  };

  return {
    wheels,
    history,
    createWheel,
    updateWheel,
    deleteWheel,
    addOption,
    updateOption,
    deleteOption,
    batchAddOptions,
    updateSettings,
    addHistory,
    getWheelHistory,
    spinWheel,
  };
};
