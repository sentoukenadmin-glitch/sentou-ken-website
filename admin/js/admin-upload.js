/**
 * admin-upload.js — shared helper for uploading images to Supabase Storage.
 * Used by the gallery, announcements, and achievements admin pages.
 */

/**
 * Uploads a single file to the "academy-photos" bucket.
 * Returns the public URL on success, or throws on failure.
 */
async function uploadPhotoToStorage(file, folder) {
  var validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (validTypes.indexOf(file.type) === -1) {
    throw new Error(file.name + " isn't a supported image type (use JPG, PNG, or WEBP).");
  }
  var maxSizeMB = 8;
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(file.name + " is larger than " + maxSizeMB + "MB — please use a smaller image.");
  }

  var safeName = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  var path = (folder ? folder + "/" : "") + safeName;

  var { error } = await supabaseClient.storage.from("academy-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;

  var { data } = supabaseClient.storage.from("academy-photos").getPublicUrl(path);
  return { url: data.publicUrl, path: path };
}

async function deletePhotoFromStorage(path) {
  if (!path) return;
  await supabaseClient.storage.from("academy-photos").remove([path]);
}
