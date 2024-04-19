import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/usersAtom';
import authScreenAtom from '../atoms/authAtom';
import useLogout from '../hooks/useLogout';

const Header = () => {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const logout = useLogout();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }}>
      {user ? (
        <TouchableOpacity onPress={() => {}}>
          <Text>Home</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setAuthScreen('login')}>
          <Text>Login</Text>
        </TouchableOpacity>
      )}

      <Image
        source={{ uri: user ? '/light-logo.svg' : '/dark-logo.svg' }}
        style={{ width: 24, height: 24, resizeMode: 'contain' }}
      />

      {user && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => {}}>
            <Text>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {!user && (
        <TouchableOpacity onPress={() => setAuthScreen('signup')}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
