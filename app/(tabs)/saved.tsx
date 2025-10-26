
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, SafeAreaView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { recipes } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { IconSymbol } from '@/components/IconSymbol';

export default function SavedScreen() {
  const { savedRecipeIds, isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();

  const savedRecipes = useMemo(() => {
    return recipes.filter(recipe => isRecipeSaved(recipe.id));
  }, [savedRecipeIds]);

  const renderRecipe = ({ item }: { item: typeof recipes[0] }) => (
    <RecipeCard
      recipe={item}
      isSaved={isRecipeSaved(item.id)}
      onSavePress={() => toggleSaveRecipe(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="heart" size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Saved Recipes
      </Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start saving your favorite recipes to see them here
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Saved Recipes',
            headerShown: false,
          }}
        />
      )}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Recipes</Text>
        {savedRecipes.length > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{savedRecipes.length}</Text>
          </View>
        )}
      </View>
      <FlatList
        data={savedRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar,
          savedRecipes.length === 0 && styles.emptyListContainer,
        ]}
        scrollIndicatorInsets={{ right: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
  },
  badge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  badgeText: {
    color: colors.card,
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
  },
});
