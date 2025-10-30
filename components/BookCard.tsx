import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type BookCardProps = {
    book: {
        id: string;
        title: string;
        author: string;
        isbn: string;
        cover: string;
    };
    onDelete: () => void;
};

export default function BookCard({ book, onDelete }: BookCardProps)
{
    return (
        <View style={styles.card}>
            <Image source={{ uri: book.cover }} style={styles.cover} />
            <View style={styles.details}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>{book.author}</Text>
                <Text style={styles.isbn}>{book.isbn}</Text>

                <TouchableOpacity onPress={onDelete}>
                    <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:
    {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 6,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cover:
    {
        width: 60,
        height: 90,
        borderRadius: 4,
        marginRight: 12,
    },
    details:
    {
        flex: 1,
    },
    title:
    {
        fontWeight: 'bold',
        fontSize: 16,
    },
    author:
    {
        color: '#555',
        marginTop: 2,
    },
    isbn:
    {
        color: '#777',
        fontSize: 12,
        marginTop: 4,
    },
    delete:
    {
        color: 'red',
        marginTop: 8,
        fontWeight: 'bold',
    },
});
