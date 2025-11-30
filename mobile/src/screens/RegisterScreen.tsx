import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

const schema = z
  .object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    confirm: z.string(),
    displayName: z.string().min(3, { message: 'Mínimo 3 caracteres' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { email: '', password: '', confirm: '', displayName: '' },
    resolver: zodResolver(schema),
  });
  const { register } = useAuth();

  const onSubmit = async (values: FormData) => {
    await register({ email: values.email, password: values.password, displayName: values.displayName });
  };

  return (
    <AuthLayout>
      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>
        <FormField name="displayName" label="Nombre" placeholder="Tu nombre" control={control} />
        <FormField name="email" label="Email" placeholder="tucorreo@demo.com" control={control} />
        <FormField
          name="password"
          label="Contraseña"
          placeholder="••••••"
          control={control}
          secureTextEntry
        />
        <FormField
          name="confirm"
          label="Confirmar contraseña"
          placeholder="••••••"
          control={control}
          secureTextEntry
        />
        <Button title="Registrarme" onPress={handleSubmit(onSubmit)} />
        <Text style={styles.footer} onPress={() => navigation.navigate('Login' as never)}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  footer: {
    marginTop: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;
