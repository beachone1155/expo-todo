import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const CAT_XP_KEY = 'cat_xp';
const CAT_STAGE_KEY = 'cat_stage';

const XP_THRESHOLDS = [0, 10, 25, 50, 100]; // ステージごとのXP閾値
const MAX_STAGE = 3; // 0〜3の4段階

export function useCat() {
  const [xp, setXp] = useState(0);
  const [stage, setStage] = useState(0);

  // 初期化: ストレージから読み込み
  useEffect(() => {
    (async () => {
      const savedXp = await AsyncStorage.getItem(CAT_XP_KEY);
      const savedStage = await AsyncStorage.getItem(CAT_STAGE_KEY);
      if (savedXp) setXp(Number(savedXp));
      if (savedStage) setStage(Number(savedStage));
    })();
  }, []);

  // XPまたはステージが変わったら保存＆ステージ再計算
  useEffect(() => {
    AsyncStorage.setItem(CAT_XP_KEY, xp.toString());
    // ステージ計算
    let newStage = 0;
    for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= XP_THRESHOLDS[i]) {
        newStage = i;
        break;
      }
    }
    setStage(newStage);
    AsyncStorage.setItem(CAT_STAGE_KEY, newStage.toString());
  }, [xp]);

  // XP加算関数
  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
  };

  // ステージの最大値
  const getMaxStage = () => MAX_STAGE;

  return { xp, stage, addXp, getMaxStage, XP_THRESHOLDS };
} 