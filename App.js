import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MemoryMatchGame = () => {
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
                        {card.flipped && <Text>{card.value}</Text>}
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
        width: 50,
        height: 50,
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
});

export default MemoryMatchGame;
