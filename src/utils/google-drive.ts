/**
 * Utility Integrasi Google Drive untuk Galeri Taman Baca Rete Mali.
 *
 * Mendukung:
 * 1. Konversi otomatis tautan berbagi Google Drive (file/d/ID/view, open?id=ID, uc?id=ID)
 *    menjadi Direct Image URL (https://drive.google.com/thumbnail?id=ID&sz=w1600)
 *    agar gambar langsung tampil di <img /> Landing Page tanpa broken image.
 * 2. Ekstraksi & sinkronisasi otomatis daftar foto dari tautan Folder Google Drive publik
 *    (https://drive.google.com/drive/folders/FOLDER_ID) sehingga Admin cukup menaruh
 *    foto hasil kegiatan di Google Drive dan otomatis muncul di Galeri Landing Page.
 */

export interface GoogleDriveFileEntry {
  fileId: string;
  title: string;
  imageUrl: string;
  lh3ImageUrl: string;
  driveViewUrl: string;
}

/**
 * Mengecek apakah string adalah tautan Folder Google Drive dan mengekstrak Folder ID-nya.
 */
export function extractGoogleDriveFolderId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern 1: https://drive.google.com/drive/folders/{FOLDER_ID} atau /drive/u/0/folders/{FOLDER_ID}
  const folderMatch = /drive\.google\.com\/(?:drive\/(?:u\/\d+\/)?)?folders\/([a-zA-Z0-9_-]{15,})/.exec(
    trimmed,
  );
  if (folderMatch?.[1]) {
    return folderMatch[1];
  }

  // Pattern 2: https://drive.google.com/embeddedfolderview?id={FOLDER_ID}
  const embeddedMatch = /drive\.google\.com\/embeddedfolderview\?[^#]*id=([a-zA-Z0-9_-]{15,})/.exec(
    trimmed,
  );
  if (embeddedMatch?.[1]) {
    return embeddedMatch[1];
  }

  return null;
}

/**
 * Mengekstrak Google Drive File ID dari berbagai format URL Google Drive.
 */
export function extractGoogleDriveFileId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Jangan salah mendeteksi URL folder sebagai file
  if (extractGoogleDriveFolderId(trimmed)) {
    return null;
  }

  // Pattern 1: https://drive.google.com/file/d/{FILE_ID}/view...
  const fileDMatch = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{15,})/.exec(
    trimmed,
  );
  if (fileDMatch?.[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: https://lh3.googleusercontent.com/d/{FILE_ID}...
  const lh3Match = /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{15,})/.exec(
    trimmed,
  );
  if (lh3Match?.[1]) {
    return lh3Match[1];
  }

  // Pattern 3: https://drive.google.com/open?id={FILE_ID} atau /uc?id={FILE_ID} atau /thumbnail?id={FILE_ID}
  const queryIdMatch = /drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*[?&]?id=([a-zA-Z0-9_-]{15,})/.exec(
    trimmed,
  );
  if (queryIdMatch?.[1]) {
    return queryIdMatch[1];
  }

  // Pattern 4: Generic ?id={FILE_ID} pada domain google.com
  if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
    const genericId = /[?&]id=([a-zA-Z0-9_-]{15,})/.exec(trimmed);
    if (genericId?.[1]) {
      return genericId[1];
    }
  }

  // Pattern 5: Raw Google Drive File ID (misal "1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P")
  if (
    !trimmed.includes("/") &&
    !trimmed.includes(".") &&
    /^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)
  ) {
    return trimmed;
  }

  return null;
}

/**
 * Mengubah Google Drive File ID menjadi Direct Image URL yang langsung bisa dirender di <img src="..." />.
 */
export function buildGoogleDriveDirectImageUrl(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

/**
 * Mengubah Google Drive File ID menjadi URL CDN lh3.googleusercontent.com.
 */
export function buildGoogleDriveLh3Url(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w1600`;
}

/**
 * Mengubah Google Drive File ID menjadi URL preview halaman Google Drive.
 */
export function buildGoogleDriveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

/**
 * Menormalisasi URL gambar apapun: jika berasal dari Google Drive,
 * otomatis dikonversi ke Direct Image URL agar langsung tampil di Landing Page.
 */
export function normalizeGalleryImageUrl(inputUrl: string): string {
  const fileId = extractGoogleDriveFileId(inputUrl);
  if (fileId) {
    return buildGoogleDriveDirectImageUrl(fileId);
  }
  return inputUrl.trim();
}

/**
 * Menambahkan metadata Google Drive pada objek foto galeri saat dikirim ke Frontend.
 */
export function enrichGalleryPhotoWithDriveMeta<
  T extends { imageUrl: string },
>(photo: T) {
  const fileId = extractGoogleDriveFileId(photo.imageUrl);
  const normalizedUrl = fileId
    ? buildGoogleDriveDirectImageUrl(fileId)
    : photo.imageUrl;

  return {
    ...photo,
    imageUrl: normalizedUrl,
    sourceType: fileId ? ("GOOGLE_DRIVE" as const) : ("LOCAL_OR_EXTERNAL" as const),
    driveFileId: fileId,
    directImageUrl: normalizedUrl,
    lh3ImageUrl: fileId ? buildGoogleDriveLh3Url(fileId) : null,
    driveViewUrl: fileId ? buildGoogleDriveViewUrl(fileId) : null,
  };
}

/**
 * Mengambil seluruh daftar gambar dari Folder Google Drive yang dibagikan secara publik
 * ("Anyone with the link can view") tanpa memerlukan OAuth login.
 */
export async function fetchGoogleDriveFolderImages(
  folderUrlOrId: string,
): Promise<{ folderId: string; files: GoogleDriveFileEntry[] }> {
  const folderId =
    extractGoogleDriveFolderId(folderUrlOrId) ??
    (/^[a-zA-Z0-9_-]{15,50}$/.test(folderUrlOrId.trim())
      ? folderUrlOrId.trim()
      : null);

  if (!folderId) {
    throw new Error(
      "Tautan atau ID Folder Google Drive tidak valid. Gunakan format: https://drive.google.com/drive/folders/FOLDER_ID",
    );
  }

  const filesMap = new Map<string, GoogleDriveFileEntry>();

  // 1. Jika ada GOOGLE_DRIVE_API_KEY / GOOGLE_API_KEY di environment, gunakan Google Drive API v3
  const apiKey =
    process.env.GOOGLE_DRIVE_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(
        folderId,
      )}'+in+parents+and+trashed=false&fields=files(id,name,mimeType)&pageSize=100&key=${encodeURIComponent(
        apiKey,
      )}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const json = (await res.json()) as {
          files?: Array<{ id: string; name: string; mimeType?: string }>;
        };
        for (const f of json.files ?? []) {
          if (!f.mimeType || f.mimeType.startsWith("image/")) {
            const cleanTitle = f.name.replace(/\.[a-zA-Z0-9]{2,5}$/, "");
            filesMap.set(f.id, {
              fileId: f.id,
              title: cleanTitle || `Dokumentasi Kegiatan (${f.id.slice(0, 6)})`,
              imageUrl: buildGoogleDriveDirectImageUrl(f.id),
              lh3ImageUrl: buildGoogleDriveLh3Url(f.id),
              driveViewUrl: buildGoogleDriveViewUrl(f.id),
            });
          }
        }
      }
    } catch {
      // Lanjut ke fallback embeddedfolderview publik
    }
  }

  // 2. Fallback utama tanpa API Key: parse halaman publik embeddedfolderview Google Drive
  if (filesMap.size === 0) {
    try {
      const embedUrl = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(
        folderId,
      )}#grid`;
      const res = await fetch(embedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
      });

      if (res.ok) {
        const html = await res.text();

        // Pola 1: id="entry-{FILE_ID}" diikuti flip-entry-title
        const entryRegex =
          /id="entry-([a-zA-Z0-9_-]{15,})"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
        let match: RegExpExecArray | null;
        while ((match = entryRegex.exec(html)) !== null) {
          const fId = match[1];
          const rawName = match[2].trim();
          const cleanTitle = rawName.replace(/\.[a-zA-Z0-9]{2,5}$/, "");
          filesMap.set(fId, {
            fileId: fId,
            title: cleanTitle || `Dokumentasi Kegiatan (${fId.slice(0, 6)})`,
            imageUrl: buildGoogleDriveDirectImageUrl(fId),
            lh3ImageUrl: buildGoogleDriveLh3Url(fId),
            driveViewUrl: buildGoogleDriveViewUrl(fId),
          });
        }

        // Pola 2: href="https://drive.google.com/file/d/{FILE_ID}/view..."
        if (filesMap.size === 0) {
          const linkRegex =
            /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{15,})/g;
          let lMatch: RegExpExecArray | null;
          let idx = 1;
          while ((lMatch = linkRegex.exec(html)) !== null) {
            const fId = lMatch[1];
            if (!filesMap.has(fId) && fId !== folderId) {
              filesMap.set(fId, {
                fileId: fId,
                title: `Dokumentasi Kegiatan Rete Mali #${idx++}`,
                imageUrl: buildGoogleDriveDirectImageUrl(fId),
                lh3ImageUrl: buildGoogleDriveLh3Url(fId),
                driveViewUrl: buildGoogleDriveViewUrl(fId),
              });
            }
          }
        }
      }
    } catch {
      // Abaikan error jaringan jika sedang berada di lingkungan sandbox offline
    }
  }

  return {
    folderId,
    files: Array.from(filesMap.values()),
  };
}
