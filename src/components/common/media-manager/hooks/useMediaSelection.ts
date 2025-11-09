import { useState, useCallback } from 'react';
import { MediaManagerItem } from '../media';

export const useMediaSelection = () => {
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    const toggleSelection = useCallback((itemId: number) => {
        setSelectedItems(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(itemId)) {
                newSelected.delete(itemId);
            } else {
                newSelected.add(itemId);
            }
            return newSelected;
        });
    }, []);

    const selectItem = useCallback((itemId: number) => {
        setSelectedItems(prevSelected => {
            const newSelected = new Set(prevSelected);
            newSelected.add(itemId);
            return newSelected;
        });
    }, []);

    const unselectItem = useCallback((itemId: number) => {
        setSelectedItems(prevSelected => {
            const newSelected = new Set(prevSelected);
            newSelected.delete(itemId);
            return newSelected;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItems(new Set());
    }, []);

    const selectAll = useCallback((items: MediaManagerItem[]) => {
        setSelectedItems(new Set(items.map(item => item.id)));
    }, []);

    const isSelected = useCallback((itemId: number) => {
        return selectedItems.has(itemId);
    }, [selectedItems]);

    return {
        selectedItems,
        toggleSelection,
        selectItem,
        unselectItem,
        clearSelection,
        selectAll,
        isSelected,
        selectedCount: selectedItems.size
    };
};