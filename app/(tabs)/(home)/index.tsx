
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { recipes } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { useSavedRecipes } from '@/hooks/useSavedRecipes';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const theme = useTheme();
  const { isRecipeSaved, toggleSaveRecipe } = useSavedRecipes();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const renderRecipe = ({ item }: { item: typeof recipes[0] }) => (
    <RecipeCard
      recipe={item}
      isSaved={isRecipeSaved(item.id)}
      onSavePress={() => toggleSaveRecipe(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Recipes</Text>
      <View style={[styles.searchContainer, { borderColor: colors.border }]}>
        <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search recipes..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="magnifyingglass" size={48} color={colors.textSecondary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No recipes found
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
            title: 'Recipes',
            headerShown: false,
          }}
        />
      )}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContainer,
          Platform.OS !== 'ios' && styles.listContainerWithTabBar,
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
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
