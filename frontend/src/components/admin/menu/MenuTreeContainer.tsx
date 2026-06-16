import { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragMoveEvent,
    DragEndEvent,
    DragOverEvent,
    DropAnimation,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { flatten, buildTree, getProjection } from './utils';
import { SortableTreeItem } from './SortableTreeItem';
import type { MenuItem, FlatMenuItem } from './types';

const INDENTATION_WIDTH = 40;

interface MenuTreeContainerProps {
    items: MenuItem[];
    setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: { title?: string; url?: string }) => void;
    onCollapse: (id: string) => void;
}

export default function MenuTreeContainer({
    items,
    setItems,
    onRemove,
    onUpdate,
    onCollapse,
}: MenuTreeContainerProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState(0);

    // Initialize sensors (distance: 5 for responsive drag)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Flatten tree and filter out items whose ancestors are collapsed
    const flattenedItems = useMemo(() => {
        const safeItems = Array.isArray(items) ? items : [];
        const flattened = flatten(safeItems);
        const collapsedItems = flattened.reduce<string[]>(
            (acc, { children, collapsed, id }) =>
                collapsed && children.length ? [...acc, id] : acc,
            []
        );

        return flattened.filter(
            ({ parentId }, _index, array) =>
                parentId === null ||
                !array.some((item) => item.id === parentId && collapsedItems.includes(item.id))
        );
    }, [items]);

    const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
    const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

    // Helper: Sanitize depths to maintain tree integrity
    const sanitizeFlatDepths = (flatList: FlatMenuItem[]): FlatMenuItem[] => {
        const sanitized = flatList.map(item => ({ ...item }));
        if (sanitized.length === 0) return sanitized;

        sanitized[0].depth = 0;
        sanitized[0].parentId = null;

        for (let i = 1; i < sanitized.length; i++) {
            const prev = sanitized[i - 1];
            if (sanitized[i].depth > prev.depth + 1) {
                sanitized[i].depth = prev.depth + 1;
            }

            const depth = sanitized[i].depth;
            if (depth === 0) {
                sanitized[i].parentId = null;
            } else if (depth === prev.depth) {
                sanitized[i].parentId = prev.parentId;
            } else if (depth > prev.depth) {
                sanitized[i].parentId = prev.id;
            } else {
                let foundParent = null;
                for (let j = i - 1; j >= 0; j--) {
                    if (sanitized[j].depth === depth - 1) {
                        foundParent = sanitized[j].id;
                        break;
                    }
                }
                sanitized[i].parentId = foundParent;
            }
        }

        return sanitized;
    };

    // Manual control actions (Buttons)
    const handleMoveUp = (id: string) => {
        const flat = flatten(items);
        const index = flat.findIndex(item => item.id === id);
        if (index <= 0) return;

        const newFlat = [...flat];
        const temp = newFlat[index];
        newFlat[index] = newFlat[index - 1];
        newFlat[index - 1] = temp;

        setItems(buildTree(sanitizeFlatDepths(newFlat)));
    };

    const handleMoveDown = (id: string) => {
        const flat = flatten(items);
        const index = flat.findIndex(item => item.id === id);
        if (index < 0 || index >= flat.length - 1) return;

        const newFlat = [...flat];
        const temp = newFlat[index];
        newFlat[index] = newFlat[index + 1];
        newFlat[index + 1] = temp;

        setItems(buildTree(sanitizeFlatDepths(newFlat)));
    };

    const handleIndent = (id: string) => {
        const flat = flatten(items);
        const index = flat.findIndex(item => item.id === id);
        if (index <= 0) return;

        const previousItem = flat[index - 1];
        const item = flat[index];

        const maxDepth = previousItem.depth + 1;
        const newDepth = Math.min(item.depth + 1, maxDepth);

        flat[index] = {
            ...item,
            parentId: previousItem.id,
            depth: newDepth
        };

        setItems(buildTree(sanitizeFlatDepths(flat)));
    };

    const handleOutdent = (id: string) => {
        const flat = flatten(items);
        const index = flat.findIndex(item => item.id === id);
        if (index < 0) return;

        const item = flat[index];
        if (item.depth <= 0) return;

        const newDepth = item.depth - 1;
        let parentId: string | null = null;
        if (newDepth > 0) {
            for (let i = index - 1; i >= 0; i--) {
                if (flat[i].depth === newDepth - 1) {
                    parentId = flat[i].id;
                    break;
                }
            }
        }

        flat[index] = {
            ...item,
            parentId,
            depth: newDepth
        };

        setItems(buildTree(sanitizeFlatDepths(flat)));
    };

    // Drag and Drop Event Handlers
    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id as string);
        setOverId(active.id as string);
    };

    const handleDragMove = ({ delta }: DragMoveEvent) => {
        setDragOffset(delta.x);
    };

    const handleDragOver = ({ over }: DragOverEvent) => {
        setOverId(over?.id as string ?? null);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        resetState();

        if (projected && over) {
            const { depth, parentId } = projected;
            const clonedItems: FlatMenuItem[] = JSON.parse(JSON.stringify(flatten(items)));
            const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
            const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
            const activeTreeItem = clonedItems[activeIndex];

            clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };
            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

            setItems(buildTree(sanitizeFlatDepths(sortedItems)));
        }
    };

    const handleDragCancel = () => {
        resetState();
    };

    const resetState = () => {
        setOverId(null);
        setActiveId(null);
        setDragOffset(0);
    };

    const projected =
        activeId && overId
            ? getProjection(
                flattenedItems,
                activeId,
                overId,
                dragOffset,
                INDENTATION_WIDTH
            )
            : null;

    const dropAnimationConfig: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.4' },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                    {flattenedItems.map((item, index) => {
                        // Determine button enable/disable states
                        const canOutdent = item.depth > 0;
                        const hasPrevItem = index > 0;
                        const prevItem = hasPrevItem ? flattenedItems[index - 1] : null;
                        const canIndent = hasPrevItem && prevItem ? item.depth <= prevItem.depth : false;

                        return (
                            <SortableTreeItem
                                key={item.id}
                                item={item}
                                depth={item.id === activeId && projected ? projected.depth : item.depth}
                                indentationWidth={INDENTATION_WIDTH}
                                onRemove={onRemove}
                                onUpdate={onUpdate}
                                onCollapse={onCollapse}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                                onIndent={handleIndent}
                                onOutdent={handleOutdent}
                                canIndent={canIndent}
                                canOutdent={canOutdent}
                            />
                        );
                    })}
                </div>
            </SortableContext>

            <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeId && activeItem ? (
                    <SortableTreeItem
                        item={activeItem}
                        depth={0}
                        indentationWidth={INDENTATION_WIDTH}
                        onRemove={() => { }}
                        onUpdate={() => { }}
                        onCollapse={() => { }}
                        isOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
