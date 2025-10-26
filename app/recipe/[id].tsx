
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Share,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { recipes } from '@/data/recipes';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { IconSymbol } from '@/components/IconSymbol';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();

  const recipe = useMemo(() => {
    return recipes.find(r => r.id === id);
  }, [id]);

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Recipe not found</Text>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.title}\n\n${recipe.description}`,
        title: recipe.title,
      });
    } catch (error) {
      console.log('Error sharing recipe:', error);
    }
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: recipe.title,
            headerShown: false,
          }}
        />
      )}
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBar}>
          <Pressable
            style={[styles.backButton, { backgroundColor: colors.secondary }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.card} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable
              style={[
                styles.iconButton,
                isRecipeSaved(recipe.id) && styles.iconButtonActive,
              ]}
              onPress={() => toggleSaveRecipe(recipe.id)}
            >
              <IconSymbol
                name={isRecipeSaved(recipe.id) ? 'heart.fill' : 'heart'}
                size={24}
                color={isRecipeSaved(recipe.id) ? colors.highlight : colors.primary}
              />
            </Pressable>
            <Pressable
              style={[styles.iconButton, { backgroundColor: colors.primary }]}
              onPress={handleShare}
            >
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.card} />
            </Pressable>
          </View>
        </View>

        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
        />

        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.text }]}>{recipe.title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {recipe.description}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol name="clock" size={24} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Total Time</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{totalTime} min</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol name="person.2" size={24} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Servings</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{recipe.servings}</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol name="chart.bar" size={24} color={colors.primary} />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Difficulty</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          <View style={[styles.ingredientsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recipe.ingredients.map((ingredient, index) => (
              <View
                key={index}
                style={[
                  styles.ingredientItem,
                  index !== recipe.ingredients.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
              >
                <View style={[styles.ingredientDot, { backgroundColor: colors.primary }]} />
                <View style={styles.ingredientContent}>
                  <Text style={[styles.ingredientName, { color: colors.text }]}>
                    {ingredient.name}
                  </Text>
                  <Text style={[styles.ingredientAmount, { color: colors.textSecondary }]}>
                    {ingredient.amount} {ingredient.unit}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cooking Steps</Text>
          <View style={[styles.stepsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recipe.steps.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepItem,
                  index !== recipe.steps.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
              >
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.text }]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {recipe.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tags</Text>
            <View style={styles.tagsList}>
              {recipe.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.accent }]}
                >
                  <Text style={[styles.tagText, { color: colors.card }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButtonActive: {
    backgroundColor: 'rgba(233, 150, 122, 0.1)',
    borderColor: colors.highlight,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  ingredientsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 12,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  ingredientAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
  stepsList: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: colors.card,
    fontWeight: '700',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});
