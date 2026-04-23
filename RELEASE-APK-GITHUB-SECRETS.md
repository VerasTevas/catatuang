# CatatUang Android Release APK

File ini menjelaskan secret GitHub yang harus diisi agar workflow `Android Release APK` bisa build APK release signed.

## Secrets yang harus dibuat
Masuk ke:
`GitHub repo > Settings > Secrets and variables > Actions > New repository secret`

Buat 4 secret berikut:

### 1) `ANDROID_KEYSTORE_BASE64`
Isi dengan isi file:
`/root/CatatUang-release-secrets/ANDROID_KEYSTORE_BASE64.txt`

### 2) `ANDROID_KEYSTORE_PASSWORD`
Isi dengan nilai `ANDROID_KEYSTORE_PASSWORD` dari file:
`/root/CatatUang-release-secrets/ANDROID_RELEASE_SECRETS.txt`

### 3) `ANDROID_KEY_ALIAS`
Isi dengan nilai `ANDROID_KEY_ALIAS` dari file:
`/root/CatatUang-release-secrets/ANDROID_RELEASE_SECRETS.txt`

### 4) `ANDROID_KEY_PASSWORD`
Isi dengan nilai `ANDROID_KEY_PASSWORD` dari file:
`/root/CatatUang-release-secrets/ANDROID_RELEASE_SECRETS.txt`

## Setelah secrets diisi
1. Buka tab `Actions`
2. Klik workflow `Android Release APK`
3. Klik `Run workflow`
4. Tunggu sampai sukses
5. Buka run terbaru
6. Scroll ke `Artifacts`
7. Download artifact `catatuang-release-apk`
8. Extract zip
9. Ambil file `app-release.apk`

## File penting lokal — jangan hilangkan
Simpan aman file-file ini di luar repo:
- `/root/CatatUang-release-secrets/catatuang-release.jks`
- `/root/CatatUang-release-secrets/ANDROID_RELEASE_SECRETS.txt`
- `/root/CatatUang-release-secrets/ANDROID_KEYSTORE_BASE64.txt`

Kalau file keystore hilang, update app release berikutnya bisa bermasalah.
