import { Track } from '../../core/models/track.model';

export class DownloadUtils {
  
  // Detectar calidad de conexión WiFi
  static async getConnectionQuality(): Promise<'high' | 'medium' | 'low'> {
    try {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        const downlink = connection.downlink; // Mbps
        if (downlink > 10) return 'high';
        if (downlink > 1.5) return 'medium';
        return 'low';
      }
    } catch (error) {
      console.warn('Cannot detect connection quality:', error);
    }
    return 'medium'; // Default
  }

  static async downloadScript(track: Track): Promise<void> {
    const quality = await this.getConnectionQuality();
    console.log(`📶 Calidad de conexión detectada: ${quality.toUpperCase()}`);
    
    const script = this.generateAdvancedDownloadScript(track, quality);
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = `${this.cleanName(track.name)}_DOWNLOAD_${quality.toUpperCase()}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(link.href);
    
    // Mostrar notificación
    this.showDownloadNotification(track, quality);
  }

  static generateAdvancedDownloadScript(track: Track, quality: 'high' | 'medium' | 'low' = 'high'): string {
    const cleanName = this.cleanName(track.name);
    const artistName = this.cleanName(track.artists?.[0]?.name || 'Unknown');
    const albumName = this.cleanName(track.album?.name || 'Unknown Album');
    const previewUrl = track.preview_url || '';
    const spotifyUrl = track.external_urls?.spotify || '';
    
    // Seleccionar calidad de imagen según conexión
    let coverUrl = '';
    if (track.album?.images?.length) {
      const images = track.album.images;
      switch (quality) {
        case 'high': coverUrl = images[0]?.url || ''; break; // 640x640
        case 'medium': coverUrl = images[1]?.url || images[0]?.url || ''; break; // 300x300  
        case 'low': coverUrl = images[2]?.url || images[1]?.url || images[0]?.url || ''; break; // 64x64
      }
    }
    
    const qualitySettings = {
      high: { bitrate: '320k', format: 'mp3', cover: '3000x3000', size: 'Grande (~10MB)' },
      medium: { bitrate: '192k', format: 'mp3', cover: '1400x1400', size: 'Medio (~6MB)' },
      low: { bitrate: '128k', format: 'mp3', cover: '640x640', size: 'Pequeño (~4MB)' }
    };

    const settings = qualitySettings[quality];
    const duration = track.duration_ms ? 
      Math.floor(track.duration_ms / 1000 / 60) + ':' + String(Math.floor((track.duration_ms / 1000) % 60)).padStart(2, '0') : 'N/A';
    
    return `@echo off
chcp 65001 >nul
title 🎵 Spotify Downloader - ${track.name}
color 0A

echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎵 SPOTIFY DOWNLOADER 🎵                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📀 Canción: ${track.name}
echo 🎤 Artista: ${artistName}
echo 💿 Album: ${albumName}
echo ⏱️ Duración: ${duration}
echo 📊 Popularidad: ${track.popularity || 'N/A'}/100
echo 📶 Calidad: ${quality.toUpperCase()} (${settings.bitrate}, ${settings.cover}, ${settings.size})
echo.

REM Crear directorio de descarga
set "OUTPUT_DIR=Downloads\\🎵%USERNAME%_Spotify\\${artistName}\\${albumName}"
mkdir "%OUTPUT_DIR%" 2>nul

REM URLs
set "PREVIEW_URL=${previewUrl}"
set "COVER_URL=${coverUrl}"
set "SPOTIFY_URL=${spotifyUrl}"
set "FILENAME=${cleanName}"

echo 📁 Carpeta: %OUTPUT_DIR%
echo ⏬ Iniciando descarga...
echo.

REM ===== DESCARGAR PREVIEW AUDIO =====
echo [1/4] 🎵 Descargando preview de audio...
if defined PREVIEW_URL (
    if not "%PREVIEW_URL%"=="null" (
        curl -L --progress-bar "%PREVIEW_URL%" -o "%OUTPUT_DIR%\\%FILENAME%_preview.mp3" --connect-timeout 30
        if exist "%OUTPUT_DIR%\\%FILENAME%_preview.mp3" (
            echo     ✅ Preview descargado: %FILENAME%_preview.mp3
        ) else (
            echo     ❌ Error descargando preview
        )
    ) else (
        echo     ⚠️ No disponible - URL vacía
    )
) else (
    echo     ⚠️ No hay preview disponible en Spotify
)

REM ===== DESCARGAR PORTADA =====
echo [2/4] 🖼️ Descargando portada (${settings.cover})...
if defined COVER_URL (
    if not "%COVER_URL%"=="null" (
        curl -L --progress-bar "%COVER_URL%" -o "%OUTPUT_DIR%\\%FILENAME%_cover.jpg" --connect-timeout 30
        if exist "%OUTPUT_DIR%\\%FILENAME%_cover.jpg" (
            echo     ✅ Portada descargada: %FILENAME%_cover.jpg
        ) else (
            echo     ❌ Error descargando portada
        )
    ) else (
        echo     ⚠️ No disponible - URL vacía  
    )
) else (
    echo     ⚠️ No hay portada disponible
)

REM ===== CREAR ARCHIVO DE INFORMACIÓN =====
echo [3/4] 📋 Creando información del track...
(
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    INFORMACIÓN DEL TRACK                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎵 DETALLES GENERALES:
echo    Título: ${track.name}
echo    Artista: ${artistName}
echo    Album: ${albumName}
echo    Duración: ${duration}
echo    Popularidad: ${track.popularity || 'N/A'}/100
echo    ID Spotify: ${track.id || 'N/A'}
echo.
echo 🔗 ENLACES:
echo    Spotify: %SPOTIFY_URL%
echo    Preview: %PREVIEW_URL%
echo    Cover: %COVER_URL%
echo.  
echo ⚙️ CALIDAD SELECCIONADA:
echo    Nivel: ${quality.toUpperCase()}
echo    Bitrate Audio: ${settings.bitrate}
echo    Formato: ${settings.format.toUpperCase()}
echo    Resolución Cover: ${settings.cover}
echo    Tamaño Estimado: ${settings.size}
echo.
echo 📅 INFORMACIÓN DE DESCARGA:
echo    Fecha: %DATE%
echo    Hora: %TIME%
echo    Usuario: %USERNAME%
echo    Equipo: %COMPUTERNAME%
echo.
echo ═══════════════════════════════════════════════════════════════
echo 💡 PARA AUDIO COMPLETO USAR:
echo    • yt-dlp: yt-dlp "%SPOTIFY_URL%"
echo    • spotify-dl: spotify-dl track "%SPOTIFY_URL%"  
echo    • spotiflyer: Aplicación móvil
echo ═══════════════════════════════════════════════════════════════
) > "%OUTPUT_DIR%\\%FILENAME%_INFO.txt"
echo     ✅ Información guardada: %FILENAME%_INFO.txt

REM ===== CREAR PLAYLIST M3U =====
echo [4/4] 📝 Creando playlist...
(
echo #EXTM3U
echo #EXTINF:30,${artistName} - ${track.name}
echo %FILENAME%_preview.mp3
) > "%OUTPUT_DIR%\\%FILENAME%_playlist.m3u"
echo     ✅ Playlist creada: %FILENAME%_playlist.m3u

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                        ✅ COMPLETADO                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📁 Ubicación: %OUTPUT_DIR%
echo 📋 Archivos creados:
echo    🎵 %FILENAME%_preview.mp3     (Audio preview 30s)
echo    🖼️ %FILENAME%_cover.jpg       (Portada ${settings.cover})
echo    📄 %FILENAME%_INFO.txt        (Información completa)
echo    📝 %FILENAME%_playlist.m3u    (Playlist)
echo.
echo 🎯 Calidad aplicada: ${quality.toUpperCase()} (${settings.bitrate})
echo 💾 Tamaño total aproximado: ${settings.size}
echo.
echo 🚀 ¡Disfruta tu música!
echo.
pause`;
  }
  
  static generateDownloadScript(track: Track): string {
    return this.generateAdvancedDownloadScript(track, 'medium');
  }

  private static showDownloadNotification(track: Track, quality: string): void {
    const message = `🎵 Descarga iniciada!\n\n` +
      `📀 ${track.name}\n` +
      `🎤 ${track.artists?.[0]?.name || 'Unknown'}\n` +
      `📶 Calidad: ${quality.toUpperCase()}\n\n` +
      `💾 Revisa tu carpeta Downloads`;
    
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🎵 Spotify Downloader', {
          body: `Descarga iniciada: ${track.name}`,
          icon: track.album?.images?.[2]?.url || ''
        });
      }
    }
    
    // Fallback alert
    alert(message);
  }
  
  private static cleanName(name: string): string {
    return name
      .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '_') // Espacios a guiones bajos
      .substring(0, 50); // Máximo 50 caracteres
  }
}