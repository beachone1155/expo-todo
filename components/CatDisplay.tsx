import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const catImages = [
  require('../assets/cats/cat_stage1.png'),
  require('../assets/cats/cat_stage2.png'),
  require('../assets/cats/cat_stage3.png'),
  require('../assets/cats/cat_stage4.png'),
];

interface CatDisplayProps {
  stage: number;
  xp: number;
  nextXp: number;
}

export const CatDisplay: React.FC<CatDisplayProps> = ({ stage, xp, nextXp }) => {
  return (
    <View style={styles.container}>
      <Image source={catImages[stage]} style={styles.catImage} resizeMode="contain" />
      <Text style={styles.xpText}>経験値: {xp} / {nextXp}</Text>
      <Text style={styles.stageText}>ステージ: {stage + 1}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  catImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  xpText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  stageText: {
    fontSize: 14,
    color: '#888',
  },
}); 