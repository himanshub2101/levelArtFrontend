import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const HomeScreen1 = () => {
    const navigation = useNavigation();

    const onArtistPressed = () => {
        navigation.navigate('Artist');
    };

    const onVisitorsPressed = () => {
        navigation.navigate('Visitors');
    };

    const onProductionPressed = () => {
        navigation.navigate('Production');
    };

    return (
        <View style={styles.container}>
            <Button
                title="Artist"
                onPress={onArtistPressed}
            />
            <Button
                title="Visitors"
                onPress={onVisitorsPressed}
            />
            <Button
                title="Production"
                onPress={onProductionPressed}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen1;
