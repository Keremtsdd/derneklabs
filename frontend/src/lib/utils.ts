const STORAGE_PREFIX = 'cukurca_';

/** Uyarı/pop-up kapandığında flag kaydet */
export function dismissAlert(key: string): void {
    try {
        const dismissed = getDismissedAlerts();
        if (!dismissed.includes(key)) {
            dismissed.push(key);
            localStorage.setItem(`${STORAGE_PREFIX}dismissed_alerts`, JSON.stringify(dismissed));
        }
    } catch (error) {
        console.warn('LocalStorage dismiss failed:', error);
    }
}

/** Uyarı daha önce kapatılmış mı kontrol et */
export function isDismissed(key: string): boolean {
    try {
        return getDismissedAlerts().includes(key);
    } catch {
        return false;
    }
}

function getDismissedAlerts(): string[] {
    try {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}dismissed_alerts`);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/** Tarih formatı: "2026-01-15" → "15/01/2026" */
export function formatDate(isoDate: string): string {
    if (!isoDate) return '';
    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return isoDate;
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    } catch {
        return isoDate;
    }
}
