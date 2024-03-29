import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenOrientation } from 'expo-screen-orientation';
import { Haptics } from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';


const MemoryMatchGame = () => {
    // Lock screen orientation to landscape mode for now.....
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }, []);

    const [cards, setCards] = useState(Array(12).fill().map((_, index) => ({ id: index, value: index % 6, flipped: false })));
    const [flippedCards, setFlippedCards] = useState([]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            if (firstCard.value === secondCard.value) {
                // If the cards matched, it keeps the cards flipped
                setCards(prevCards => prevCards.map(card => {
                    if (card.id === firstCard.id || card.id === secondCard.id) {
                        return { ...card, flipped: true };
                    } else {
                        return card;
                    }
                }));
            } else {
                // If the cards dont match, the cards will flip back after a 1 second delay
                setTimeout(() => {
                    setCards(prevCards => prevCards.map(card => {
                        if (card.id === firstCard.id || card.id === secondCard.id) {
                            return { ...card, flipped: false };
                        } else {
                            return card;
                        }
                    }));
                }, 1000);
            }
            setFlippedCards([]);
        }
    }, [flippedCards]);

    const handleCardPress = (card) => {
        if (!card.flipped) {
            setCards(prevCards => prevCards.map(c => {
                if (c.id === card.id) {
                    return { ...c, flipped: true };
                } else {
                    return c;
                }
            }));
            setFlippedCards(prevFlippedCards => [...prevFlippedCards, card]);

            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);  // This should give some haptic feedback when a card is flipped
        }
    };

    //courtesy of Chatgpt
    //This should allow the user to select images from their device's gallery.
    const handleImagePick = async (cardId) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!result.cancelled) {
                setCards(prevCards => prevCards.map(card => {
                    if (card.id === cardId) {
                        return { ...card, image: result.uri };
                    } else {
                        return card;
                    }
                }));
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.gridContainer}>
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.id}
                        style={[styles.card, card.flipped && styles.flippedCard]}
                        onPress={() => handleCardPress(card)}
                        disabled={flippedCards.length === 2 || card.flipped}
                    >
                        {card.flipped && card.image && <Image source={{ uri: card.image }} style={styles.cardImage} />}
                        {card.flipped && !card.image && <Text>{card.value}</Text>}
                        {!card.flipped && <Text>Select Image</Text>}
                        <TouchableOpacity onPress={() => handleImagePick(card.id)} style={styles.pickImageButton}>
                            <Text>Choose</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: 100,
        height: 100,
        backgroundColor: '#cce',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flippedCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    pickImageButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 5,
    },
});

export default MemoryMatchGame;
