import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: number;
  onChange?: (value: number) => void;
}

const RatingStars: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange?.(star)} disabled={!onChange}>
          <Text style={[styles.star, star <= value ? styles.active : styles.inactive]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  star: { fontSize: 26, marginRight: 6 },
  active: { color: '#f59e0b' },
  inactive: { color: '#d1d5db' },
});

export default RatingStars;
