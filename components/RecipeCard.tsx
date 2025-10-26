
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Recipe } from '@/types/recipe';
import { IconSymbol } from './IconSymbol';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSavePress?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSaved, onSavePress }) => {
  return (
    <Link href={`/recipe/${recipe.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.card}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.image}
          />
          <View style={styles.overlay} />
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{recipe.description}</Text>
            
            <View style={styles.footer}>
              <View style={styles.infoRow}>
                <IconSymbol name="clock" size={14} color={colors.card} />
                <Text style={styles.infoText}>{recipe.prepTime + recipe.cookTime} min</Text>
              </View>
              <View style={styles.infoRow}>
                <IconSymbol name="person.2" size={14} color={colors.card} />
                <Text style={styles.infoText}>{recipe.servings}</Text>
              </View>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
              </View>
            </View>
          </View>

          {onSavePress && (
            <Pressable
              style={[styles.saveButton, isSaved && styles.saveButtonActive]}
              onPress={(e) => {
                e.preventDefault();
                onSavePress();
              }}
            >
              <IconSymbol
                name={isSaved ? 'heart.fill' : 'heart'}
                size={20}
                color={isSaved ? colors.highlight : colors.card}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 200,
  },
  content: {
    padding: 16,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 12,
    color: colors.card,
    fontWeight: '600',
  },
  difficultyBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    color: colors.card,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: 'rgba(233, 150, 122, 0.8)',
  },
});
