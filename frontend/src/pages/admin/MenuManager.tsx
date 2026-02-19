import { useState, useMemo, useEffect } from 'react';
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
import { flatten, buildTree, removeItem, setProperty, getProjection } from '../../components/admin/menu/utils';
import { SortableTreeItem } from '../../components/admin/menu/SortableTreeItem';
import type { MenuItem, FlatMenuItem } from '../../components/admin/menu/types';

const STORAGE_KEY = 'navbar_menu_data_v2';
const INDENTATION_WIDTH = 50;

const DEFAULT_MENU_ITEMS: MenuItem[] = [
    {
        id: 'kurumsal',
        title: 'KURUMSAL',
        url: '#',
        children: [
            {
                id: 'orhanpasa-bel',
                title: 'Orhanpaşa Belediyesi',
                url: '#',
                children: [
                    { id: 'baskan', title: 'Belediye Başkanı', url: '/baskan', children: [] },
                    { id: 'yonetim', title: 'Yönetim Şeması', url: '/sayfa/yonetim', children: [] },
                    { id: 'mudurlukler', title: 'Müdürlükler', url: '/sayfa/mudurlukler', children: [] },
                ],
            },
        ],
    },
    { id: 'projeler', title: 'PROJELER', url: '/projeler', children: [] },
    { id: 'etkinlikler', title: 'ETKİNLİK', url: '/etkinlikler', children: [] },
    {
        id: 'hizli-islemler',
        title: 'HIZLI İŞLEMLER',
        url: '#',
        children: [
            { id: 'borc-sorgulama', title: 'Borç Sorgulama', url: '/borc-sorgulama', children: [] },
            { id: 'nobetci-eczane', title: 'Nöbetçi Eczaneler', url: '/nobetci-eczaneler', children: [] },
            { id: 'imar-durumu', title: 'İmar Durumu', url: '/imar-durumu', children: [] },
        ],
    },
    {
        id: 'basvuru-islemleri',
        title: 'BAŞVURU İŞLEMLERİ',
        url: '#',
        children: [
            { id: 'beyaz-masa', title: 'Beyaz Masa Başvurusu', url: '/beyaz-masa', children: [] },
            { id: 'is-basvurusu', title: 'İş Başvurusu', url: '/is-basvurusu', children: [] },
            { id: 'evrak-takip', title: 'Evrak Takip', url: '/evrak-takip', children: [] },
        ],
    },
    { id: 'e-belediye', title: 'E-BELEDİYE', url: '/e-belediye', children: [] },
    { id: 'yayinlar', title: 'YAYINLAR', url: '/yayinlar', children: [] },
];

export default function MenuManager() {
    const [items, setItems] = useState<MenuItem[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS;
    });
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState(0);

    // New Item State
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Flatten tree for SortableContext
    const flattenedItems = useMemo(() => {
        const flattened = flatten(items);
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

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // Actions
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;

        const newItem: MenuItem = {
            id: crypto.randomUUID(),
            title: newTitle,
            url: newUrl,
            children: [],
            collapsed: false,
        };

        setItems((prev) => [...prev, newItem]);
        setNewTitle('');
        setNewUrl('');
    };

    const handleRemove = (id: string) => {
        if (confirm('Bu menü öğesini silmek istediğinize emin misiniz?')) {
            setItems((items) => removeItem(items, id));
        }
    };

    const handleUpdate = (id: string, updates: { title?: string; url?: string }) => {
        setItems((items) =>
            setProperty(items, id, 'title', () => updates.title ?? '')
        );
        if (updates.url !== undefined) {
            setItems((items) =>
                setProperty(items, id, 'url', () => updates.url ?? '')
            );
        }
    };

    const handleCollapse = (id: string) => {
        setItems((items) =>
            setProperty(items, id, 'collapsed', (value) => !value)
        );
    };

    // Drag Handlers
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
            const newItems = buildTree(sortedItems);

            setItems(newItems);
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

    // Visual Helper for indentation
    const dropAnimationConfig: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            {/* Sidebar: Add Item */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Özel Bağlantı Ekle</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Menü Başlığı</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Örn: Hakkımızda"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                                type="text"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                placeholder="Örn: /hakkimizda veya https://..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newTitle || !newUrl}
                            className="w-full py-3 bg-[#0d2137] text-white rounded-lg font-medium hover:bg-[#1a3a5c] transition-colors disabled:opacity-50"
                        >
                            Menüye Ekle
                        </button>
                    </form>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <p className="font-semibold mb-1">💡 İpucu:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Öğeleri sürükleyerek sıralayabilirsiniz.</li>
                            <li>Bir öğeyi sağa sürükleyerek alt menü yapabilirsiniz.</li>
                            <li>Değişiklikler otomatik kaydedilir.</li>
                        </ul>
                    </div>
                    {/* Reset Button */}
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                if (confirm('Tüm menü değişikliklerini sıfırlayıp varsayılan ayarlara dönmek istediğinize emin misiniz?')) {
                                    localStorage.removeItem(STORAGE_KEY);
                                    setItems(DEFAULT_MENU_ITEMS);
                                    // Force reload to sync Header if needed
                                    window.dispatchEvent(new Event('storage'));
                                }
                            }}
                            className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            ⚠️ Varsayılanlara Sıfırla
                        </button>
                    </div>
                </div>
            </div>

            {/* Main: Drag Area */}
            <div className="w-full lg:w-2/3">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 min-h-[500px]">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Menü Yapısı</h2>

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
                            {flattenedItems.map((item) => (
                                <SortableTreeItem
                                    key={item.id}
                                    item={item}
                                    depth={item.id === activeId && projected ? projected.depth : item.depth}
                                    indentationWidth={INDENTATION_WIDTH}
                                    onRemove={handleRemove}
                                    onUpdate={handleUpdate}
                                    onCollapse={handleCollapse}
                                />
                            ))}
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

                    {items.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                            Henüz menü öğesi eklenmemiş via LocalStorage.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
