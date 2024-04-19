import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper'; // Import IconButton from Material-UI
import { useSetRecoilState } from 'recoil'; // Assuming you are using Recoil for state management
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/usersAtom'; // Import userAtom from usersAtom

export default function LoginCard({ setAuthScreen }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({ username: '', password: '' });
    const showToast = useShowToast();
    const setUserState = useSetRecoilState(userAtom); // Use userAtom instead of setUser

    // Define setUser function
    const setUser = (newValue) => {
        setUserState(newValue);
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            // Replace with your API endpoint for login
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast('Error', data.error);
                return;
            }
            // Assuming data contains user information after successful login
            setUser(data);
        } catch (error) {
            showToast('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
            <TextInput
                style={{ height: 40, width: '80%', borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
                placeholder="Username"
                value={inputs.username}
                onChangeText={(text) => setInputs({ ...inputs, username: text })}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%', marginBottom: 20 }}>
                <TextInput
                    style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1, padding: 10 }}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={inputs.password}
                    onChangeText={(text) => setInputs({ ...inputs, password: text })}
                />
                <IconButton
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                />
            </View>
            <Button
                title="Login"
                onPress={handleLogin}
                disabled={loading}
            />
            <TouchableOpacity onPress={() => setAuthScreen('signup')}>
                <Text style={{ marginTop: 20 }}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}
