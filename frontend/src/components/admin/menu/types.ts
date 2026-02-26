export interface MenuItem {
    id: string;
    title: string;
    url: string;
    children: MenuItem[];
    collapsed?: boolean;
}

export interface FlatMenuItem {
    id: string;
    title: string;
    url: string;
    parentId: string | null;
    depth: number;
    index: number;
    collapsed?: boolean;
    children: MenuItem[]; // Original children structure references (for tree building)
}
