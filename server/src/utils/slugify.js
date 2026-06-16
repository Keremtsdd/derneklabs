/**
 * Verilen metni Türkçe karakterleri temizleyerek slug formatına çevirir.
 * @param {string} text - Dönüştürülecek metin
 * @returns {string} Slug metni
 */
function slugify(text) {
    if (!text) return '';
    let string = text.toString().toLowerCase().trim();

    const charMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
        'â': 'a', 'î': 'i', 'û': 'u', 'Â': 'a', 'Î': 'i', 'Û': 'u'
    };

    for (const [key, value] of Object.entries(charMap)) {
        string = string.replace(new RegExp(key, 'g'), value);
    }

    return string
        .replace(/[^a-z0-9 -]/g, '') // Alfasayısal karakterler, boşluk ve tire hariç temizle
        .replace(/\s+/g, '-')        // Boşlukları tireye çevir
        .replace(/-+/g, '-');        // Yan yana birden fazla tireyi tekilleştir
}

module.exports = slugify;
