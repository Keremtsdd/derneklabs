import type { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { MenuItem, FlatMenuItem } from './types';

export function flatten(
    items: MenuItem[],
    parentId: string | null = null,
    depth = 0
): FlatMenuItem[] {
    const safeItems = Array.isArray(items) ? items : [];
    return safeItems.reduce<FlatMenuItem[]>((acc, item, index) => {
        const children = Array.isArray(item.children) ? item.children : [];
        return [
            ...acc,
            { ...item, parentId, depth, index },
            ...flatten(children, item.id, depth + 1),
        ];
    }, []);
}

export function buildTree(flattenedItems: FlatMenuItem[]): MenuItem[] {
    const root: MenuItem = { id: 'root', title: '', url: '', children: [] };
    const nodes: Record<string, MenuItem> = { [root.id]: root };
    const items = flattenedItems.map((item) => ({ ...item, children: [] }));

    for (const item of items) {
        const { id } = item;
        const parentId = item.parentId ?? root.id;
        const parent = nodes[parentId] ?? items.find((i) => i.id === parentId);

        nodes[id] = { ...item };
        if (parent) {
            parent.children.push(item);
        }
    }

    return root.children;
}

export function findItemDeep(
    items: MenuItem[],
    itemId: string
): MenuItem | undefined {
    for (const item of items) {
        const { id, children } = item;

        if (id === itemId) {
            return item;
        }

        if (children.length) {
            const child = findItemDeep(children, itemId);

            if (child) {
                return child;
            }
        }
    }

    return undefined;
}

export function removeItem(items: MenuItem[], id: string): MenuItem[] {
    return items
        .filter((item) => item.id !== id)
        .map((item) => {
            if (item.children && item.children.length > 0) {
                return {
                    ...item,
                    children: removeItem(item.children, id),
                };
            }
            return item;
        });
}

export function setProperty<T extends keyof MenuItem>(
    items: MenuItem[],
    id: string,
    property: T,
    setter: (value: MenuItem[T]) => MenuItem[T]
): MenuItem[] {
    return items.map((item) => {
        if (item.id === id) {
            return {
                ...item,
                [property]: setter(item[property]),
            };
        }

        if (item.children && item.children.length > 0) {
            return {
                ...item,
                children: setProperty(item.children, id, property, setter),
            };
        }

        return item;
    });
}

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

export function getProjection(
    items: FlatMenuItem[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    dragOffset: number,
    indentationWidth: number
) {
    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem.depth + dragDepth;
    const maxDepth = previousItem ? previousItem.depth + 1 : 0;
    const minDepth = nextItem ? nextItem.depth : 0;
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
        depth = maxDepth;
    } else if (projectedDepth < minDepth) {
        depth = minDepth;
    }

    return { depth, maxDepth, minDepth, parentId: getParentId() };

    function getParentId() {
        if (depth === 0 || !previousItem) {
            return null;
        }

        if (depth === previousItem.depth) {
            return previousItem.parentId;
        }

        if (depth > previousItem.depth) {
            return previousItem.id;
        }

        const newParent = newItems
            .slice(0, overItemIndex)
            .reverse()
            .find((item) => item.depth === depth)?.parentId;

        return newParent ?? null;
    }
}
