import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      contentContainerStyle={styles.container}
    >
      <View style={styles.inner}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
});

export default AuthLayout;
