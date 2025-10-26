
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_RECIPES_KEY = 'saved_recipes';

export const useSavedRecipes = () => {
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const saved = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
      if (saved) {
        setSavedRecipeIds(JSON.parse(saved));
      }
      setIsLoading(false);
    } catch (error) {
      console.log('Error loading saved recipes:', error);
      setIsLoading(false);
    }
  };

  const toggleSaveRecipe = async (recipeId: string) => {
    try {
      const updated = savedRecipeIds.includes(recipeId)
        ? savedRecipeIds.filter(id => id !== recipeId)
        : [...savedRecipeIds, recipeId];
      
      setSavedRecipeIds(updated);
      await AsyncStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.log('Error toggling saved recipe:', error);
    }
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipeIds.includes(recipeId);
  };

  return {
    savedRecipeIds,
    isLoading,
    toggleSaveRecipe,
    isRecipeSaved,
  };
};
