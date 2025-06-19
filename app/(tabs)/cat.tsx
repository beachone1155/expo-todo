import { CatDisplay } from '@/components/CatDisplay';
import { useCatContext } from '@/hooks/CatContext';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CatTabScreen() {
  const cat = useCatContext();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>猫を育てる</Text>
      <CatDisplay
        stage={cat.stage}
        xp={cat.xp}
        nextXp={cat.XP_THRESHOLDS[Math.min(cat.stage + 1, cat.getMaxStage())]}
      />
      <View style={styles.infoArea}>
        <Text style={styles.infoText}>タスクを完了して経験値を貯めよう！</Text>
        <Text style={styles.infoText}>経験値が貯まると猫が成長します。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoArea: {
    marginTop: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
}); 