const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface LoginResponse {
    token: string;
    user: { id: string; name: string; email: string; role: string };
}

interface DashboardStats {
    [key: string]: number;
}

function getToken(): string | null {
    return localStorage.getItem('admin_token');
}

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: { ...authHeaders(), ...options.headers },
    });

    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/giris';
        throw new Error('Oturum süresi doldu');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Bilinmeyen hata' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result.data;
}

/** Auth */
export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Giriş başarısız' }));
        throw new Error(err.message);
    }
    const result: ApiResponse<LoginResponse> = await response.json();
    return result.data;
}

/** Dashboard istatistikleri */
export async function fetchDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/admin/dashboard/stats');
}

/** Site ayarları — tümü veya gruplu (örn. group=general) */
export async function fetchSettings(group?: string): Promise<Record<string, unknown>> {
    const q = group ? `?group=${encodeURIComponent(group)}` : '';
    return request<Record<string, unknown>>(`/api/admin/settings${q}`);
}

/** Site ayarlarını toplu güncelle. Kaydedince cache backend'de temizlenir. */
export async function updateSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
    });
}

/** Tek dosya yükle (ayarlar logo/og_image vb.). Dönen url'yi ayarda saklayabilirsin. */
export async function uploadFile(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    const token = getToken();
    const response = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Yükleme hatası' }));
        throw new Error(err.message || 'Yükleme başarısız');
    }
    const result: ApiResponse<{ url: string }> = await response.json();
    return result.data;
}

/** Generic CRUD */
export async function fetchAdminCollection<T>(collection: string): Promise<T[]> {
    return request<T[]>(`/api/admin/${collection}`);
}

export async function fetchAdminItem<T>(collection: string, id: string): Promise<T> {
    return request<T>(`/api/admin/${collection}/${id}`);
}

export async function createAdminItem<T>(collection: string, data: FormData | Record<string, unknown>): Promise<T> {
    if (data instanceof FormData) {
        const token = getToken();
        const response = await fetch(`${API_BASE}/api/admin/${collection}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: data,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Oluşturma hatası' }));
            throw new Error(err.message);
        }
        const result: ApiResponse<T> = await response.json();
        return result.data;
    }
    return request<T>(`/api/admin/${collection}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateAdminItem<T>(collection: string, id: string, data: FormData | Record<string, unknown>): Promise<T> {
    if (data instanceof FormData) {
        const token = getToken();
        const response = await fetch(`${API_BASE}/api/admin/${collection}/${id}`, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: data,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Güncelleme hatası' }));
            throw new Error(err.message);
        }
        const result: ApiResponse<T> = await response.json();
        return result.data;
    }
    return request<T>(`/api/admin/${collection}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteAdminItem(collection: string, id: string): Promise<void> {
    await request<unknown>(`/api/admin/${collection}/${id}`, { method: 'DELETE' });
}
