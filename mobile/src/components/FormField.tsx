import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
}

const FormField: React.FC<Props> = ({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  multiline,
  keyboardType = 'default',
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.multiline, error && styles.errorInput]}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            keyboardType={keyboardType}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 4,
  },
  errorInput: {
    borderColor: '#dc2626',
  },
});

export default FormField;
