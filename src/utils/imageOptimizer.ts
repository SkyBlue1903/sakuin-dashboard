/**
 * Utility Image Compression & Optimization
 * Memastikan semua gambar yang diinput ke database atau ditampilkan di layar
 * dikompresi ringan (resolusi disesuaikan, format efisien) agar tidak memberatkan aplikasi.
 */

/**
 * Kompresi ringan URL gambar (Wikimedia, CDN, Cloudinary, Unsplash, Google, generic).
 * Mengonversi gambar beresolusi raksasa (mis. 1200px, 3840px) ke resolusi thumbnail ringan (default 200px).
 */
export function compressImageUrl(url?: string | null, targetWidth: number = 200): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  try {
    // 1. Wikimedia & Wikipedia Thumbnail Optimizer
    // Mengonversi URL thumbnail raksasa (.../1200px-..., .../3840px-...) menjadi ukuran ringan (.../200px-...)
    if (trimmed.includes("wikimedia.org") || trimmed.includes("wikipedia.org")) {
      if (/\/\d+px-/i.test(trimmed)) {
        return trimmed.replace(/\/\d+px-/gi, `/${targetWidth}px-`);
      }
      return trimmed;
    }

    // 2. Unsplash Image Optimizer (set w=200, q=80, auto=format)
    if (trimmed.includes("images.unsplash.com")) {
      const u = new URL(trimmed);
      u.searchParams.set("w", String(targetWidth));
      u.searchParams.set("q", "80");
      u.searchParams.set("auto", "format");
      return u.toString();
    }

    // 3. Cloudinary Image Optimizer
    if (trimmed.includes("res.cloudinary.com") && trimmed.includes("/upload/")) {
      return trimmed.replace(
        /\/upload\/(?:[a-zA-Z0-9_,]+\/)?/,
        `/upload/c_limit,w_${targetWidth},q_auto,f_auto/`
      );
    }

    // 4. Google User Content / Avatars
    if (trimmed.includes("googleusercontent.com")) {
      return trimmed.replace(/=s\d+.*$|=w\d+.*$/, `=s${targetWidth}-c`);
    }
    if (trimmed.includes("avatars.githubusercontent.com")) {
      const u = new URL(trimmed);
      u.searchParams.set("s", String(targetWidth));
      return u.toString();
    }

    // 5. ImageKit / Imgix
    if (trimmed.includes("ik.imagekit.io")) {
      const u = new URL(trimmed);
      u.searchParams.set("tr", `w-${targetWidth},q-80`);
      return u.toString();
    }
    if (trimmed.includes("imgix.net")) {
      const u = new URL(trimmed);
      u.searchParams.set("w", String(targetWidth));
      u.searchParams.set("auto", "format");
      return u.toString();
    }
  } catch (_) {
    // URL parsing fallback
    return trimmed;
  }

  return trimmed;
}

/**
 * Kompresi gambar client-side (File atau Base64) via HTML5 Canvas
 * Me-resize gambar menjadi max 200x200 pixel dan meng-export ke format WebP/JPEG ringan (~10KB-25KB).
 */
export function compressImageFileOrBase64(
  input: File | string,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(typeof input === "string" ? input : "");
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve(typeof input === "string" ? input : "");
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Coba export ke format WebP (ringan), fallback ke JPEG
      try {
        const webpData = canvas.toDataURL("image/webp", quality);
        if (webpData.startsWith("data:image/webp")) {
          return resolve(webpData);
        }
      } catch (_) {}

      try {
        const jpegData = canvas.toDataURL("image/jpeg", quality);
        resolve(jpegData);
      } catch (_) {
        resolve(typeof input === "string" ? input : "");
      }
    };

    img.onerror = () => {
      resolve(typeof input === "string" ? input : "");
    };

    if (typeof input === "string") {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || "";
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Helper untuk komponen tampilan:
 * Memastikan URL yang di-render di MerchantLogo & TransactionAvatar selalu ringan.
 */
export function getOptimizedImageUrl(url?: string | null, targetWidth: number = 160): string {
  return compressImageUrl(url, targetWidth);
}
