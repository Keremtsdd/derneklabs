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

/** Helper function to map data objects to v1 DTO schema */
function mapToDto(data: any): any {
    if (!data) return {};
    const dto: any = {};
    if (data.title !== undefined) dto.title = data.title;
    if (data.slug !== undefined) dto.slug = data.slug;
    if (data.summary !== undefined) dto.shortDescription = data.summary;
    if (data.body !== undefined) dto.content = data.body;
    if (data.content !== undefined) dto.content = data.content;
    if (data.image !== undefined) dto.image = data.image;
    if (data.link !== undefined) dto.link = data.link;
    if (data.published !== undefined) dto.isActive = data.published;
    if (data.status !== undefined) dto.status = data.status;
    if (data.sort_order !== undefined) dto.sortOrder = Number(data.sort_order || 0);
    if (data.sortOrder !== undefined) dto.sortOrder = Number(data.sortOrder || 0);

    const dynamicProperties: any = {};
    if (data.date) dynamicProperties.date = data.date;
    if (data.eventDate) dynamicProperties.eventDate = data.eventDate;
    if (data.location) dynamicProperties.location = data.location;
    if (data.fileSize) dynamicProperties.fileSize = data.fileSize;
    if (data.fileType) dynamicProperties.fileType = data.fileType;
    if (Object.keys(dynamicProperties).length > 0) {
        dto.dynamicProperties = dynamicProperties;
    }

    return dto;
}

/** Helper function to map FormData objects to v1 DTO schema */
function mapFormDataToDto(formData: FormData): FormData {
    const newForm = new FormData();
    formData.forEach((value, key) => {
        if (key === 'summary') {
            newForm.append('shortDescription', value);
        } else if (key === 'published') {
            newForm.append('isActive', value === 'true' || value === '1' ? 'true' : 'false');
        } else if (key === 'body' || key === 'content') {
            newForm.append('content', value);
        } else if (key === 'sort_order' || key === 'sortOrder') {
            newForm.append('sortOrder', value);
        } else if (key === 'status') {
            newForm.append('status', value);
        } else if (['date', 'eventDate', 'location', 'fileSize', 'fileType'].includes(key)) {
            // Skiped: handled in dynamicProperties
        } else {
            newForm.append(key, value);
        }
    });

    const dynamicProperties: any = {};
    if (formData.has('date')) dynamicProperties.date = formData.get('date');
    if (formData.has('eventDate')) dynamicProperties.eventDate = formData.get('eventDate');
    if (formData.has('location')) dynamicProperties.location = formData.get('location');
    if (formData.has('fileSize')) dynamicProperties.fileSize = formData.get('fileSize');
    if (formData.has('fileType')) dynamicProperties.fileType = formData.get('fileType');
    if (Object.keys(dynamicProperties).length > 0) {
        newForm.append('dynamicProperties', JSON.stringify(dynamicProperties));
    }

    return newForm;
}

/** Dashboard istatistikleri */
export async function fetchDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/v1/dashboard/stats');
}

/** Site ayarları — tümü veya gruplu (örn. group=general) */
export async function fetchSettings(group?: string): Promise<Record<string, unknown>> {
    const q = group ? `?group=${encodeURIComponent(group)}` : '';
    return request<Record<string, unknown>>(`/api/v1/settings${q}`);
}

/** Site ayarlarını toplu güncelle. Kaydedince cache backend'de temizlenir. */
export async function updateSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return request<Record<string, unknown>>('/api/v1/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
    });
}

/** Tek dosya yükle (ayarlar logo/og_image vb.). Dönen url'yi ayarda saklayabilirsin. */
export async function uploadFile(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    const token = getToken();
    const response = await fetch(`${API_BASE}/api/v1/upload`, {
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
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    const data = await request<any[]>(`/api/v1/${apiCollection}`);
    return (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        summary: item.shortDescription || '',
        content: item.content || '',
        date: item.dynamicProperties?.date || item.dynamicProperties?.eventDate || '',
        image: item.image || '',
        link: item.link || '',
        published: item.isActive,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        ...item
    })) as unknown as T[];
}

export async function fetchAdminItem<T>(collection: string, id: string): Promise<T> {
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    const item = await request<any>(`/api/v1/${apiCollection}/${id}`);
    return {
        id: item.id,
        title: item.title,
        summary: item.shortDescription || '',
        content: item.content || '',
        date: item.dynamicProperties?.date || item.dynamicProperties?.eventDate || '',
        image: item.image || '',
        link: item.link || '',
        published: item.isActive,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
        ...item
    } as unknown as T;
}

export async function createAdminItem<T>(collection: string, data: FormData | Record<string, unknown>): Promise<T> {
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    if (data instanceof FormData) {
        const token = getToken();
        const mappedForm = mapFormDataToDto(data);
        const response = await fetch(`${API_BASE}/api/v1/${apiCollection}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: mappedForm,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Oluşturma hatası' }));
            throw new Error(err.message);
        }
        const result: ApiResponse<T> = await response.json();
        return result.data;
    }
    const mappedJson = mapToDto(data);
    return request<T>(`/api/v1/${apiCollection}`, {
        method: 'POST',
        body: JSON.stringify(mappedJson),
    });
}

export async function updateAdminItem<T>(collection: string, id: string, data: FormData | Record<string, unknown>): Promise<T> {
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    if (data instanceof FormData) {
        const token = getToken();
        const mappedForm = mapFormDataToDto(data);
        const response = await fetch(`${API_BASE}/api/v1/${apiCollection}/${id}`, {
            method: 'PUT',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: mappedForm,
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({ message: 'Güncelleme hatası' }));
            throw new Error(err.message);
        }
        const result: ApiResponse<T> = await response.json();
        return result.data;
    }
    const mappedJson = mapToDto(data);
    return request<T>(`/api/v1/${apiCollection}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(mappedJson),
    });
}

export async function deleteAdminItem(collection: string, id: string): Promise<void> {
    const apiCollection = collection === 'fast_links' ? 'quick-links' : collection;
    await request<unknown>(`/api/v1/${apiCollection}/${id}`, { method: 'DELETE' });
}
