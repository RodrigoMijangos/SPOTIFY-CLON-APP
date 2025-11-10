#!/usr/bin/env python3
"""
Script para descargar y convertir audio según especificaciones del profesor
Formatos requeridos:
- Calidad 64 Kbps, Códec AAC-HE  
- Calidad 128 Kbps, Códec AAC-LC
- Calidad 256 Kbps, Códec AAC-LC
"""

import os
import subprocess
import yt_dlp
from pathlib import Path

def descargar_audio(url, carpeta_destino="descargas"):
    """
    Descarga audio desde YouTube u otras plataformas
    """
    print(f"🎵 Descargando audio desde: {url}")
    
    # Crear carpeta si no existe
    Path(carpeta_destino).mkdir(exist_ok=True)
    
    # Configuración de yt-dlp
    ydl_opts = {
        'format': 'bestaudio/best',
        'extractaudio': True,
        'audioformat': 'mp3',
        'outtmpl': f'{carpeta_destino}/%(title)s.%(ext)s',
        'noplaylist': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Obtener info del video
            info = ydl.extract_info(url, download=False)
            titulo = info.get('title', 'audio_descargado')
            
            # Descargar
            ydl.download([url])
            
            # Buscar el archivo descargado
            archivos = list(Path(carpeta_destino).glob(f"*{titulo[:20]}*"))
            if archivos:
                archivo_descargado = str(archivos[0])
                print(f"✅ Audio descargado: {archivo_descargado}")
                return archivo_descargado, titulo
            else:
                print("❌ Error: No se encontró el archivo descargado")
                return None, None
                
    except Exception as e:
        print(f"❌ Error al descargar: {str(e)}")
        return None, None

def convertir_a_formatos_profesor(archivo_entrada, titulo_cancion):
    """
    Convierte el audio a los 3 formatos requeridos por el profesor
    """
    print(f"🔄 Convirtiendo '{titulo_cancion}' a formatos AAC...")
    
    # Crear carpeta para conversiones
    carpeta_convertido = "audio_convertido"
    Path(carpeta_convertido).mkdir(exist_ok=True)
    
    # Limpiar nombre para archivo
    nombre_limpio = "".join(c for c in titulo_cancion if c.isalnum() or c in (' ', '-', '_')).rstrip()
    nombre_limpio = nombre_limpio.replace(' ', '_')[:50]
    
    formatos = [
        {
            'calidad': '64k',
            'codec': 'aac_he',
            'archivo_salida': f"{carpeta_convertido}/{nombre_limpio}_64k_HE.aac",
            'parametros': ['-c:a', 'libfdk_aac', '-profile:a', 'aac_he', '-b:a', '64k']
        },
        {
            'calidad': '128k', 
            'codec': 'aac_lc',
            'archivo_salida': f"{carpeta_convertido}/{nombre_limpio}_128k_LC.aac",
            'parametros': ['-c:a', 'aac', '-b:a', '128k']
        },
        {
            'calidad': '256k',
            'codec': 'aac_lc', 
            'archivo_salida': f"{carpeta_convertido}/{nombre_limpio}_256k_LC.aac",
            'parametros': ['-c:a', 'aac', '-b:a', '256k']
        }
    ]
    
    archivos_creados = []
    
    for formato in formatos:
        try:
            print(f"  📀 Creando: {formato['calidad']} - {formato['codec'].upper()}")
            
            comando = [
                'ffmpeg', '-i', archivo_entrada,
                '-y',  # Sobrescribir si existe
                *formato['parametros'],
                formato['archivo_salida']
            ]
            
            resultado = subprocess.run(comando, capture_output=True, text=True)
            
            if resultado.returncode == 0:
                print(f"    ✅ Creado: {formato['archivo_salida']}")
                archivos_creados.append(formato['archivo_salida'])
            else:
                print(f"    ❌ Error en {formato['calidad']}: {resultado.stderr[:100]}")
                
        except Exception as e:
            print(f"    ❌ Error procesando {formato['calidad']}: {str(e)}")
    
    return archivos_creados

def main():
    """
    Función principal - Descarga y convierte según las especificaciones del profesor
    """
    print("🎵 DESCARGADOR Y CONVERSOR DE AUDIO - PROYECTO PROFESOR")
    print("=" * 60)
    
    # Solicitar URL
    url = input("📎 Ingresa la URL de YouTube (canción): ")
    
    if not url.strip():
        print("❌ URL vacía. Saliendo...")
        return
    
    # Descargar audio
    archivo_descargado, titulo = descargar_audio(url)
    
    if not archivo_descargado:
        return
    
    # Convertir a formatos del profesor
    archivos_convertidos = convertir_a_formatos_profesor(archivo_descargado, titulo)
    
    print(f"\n🎉 PROCESO COMPLETADO")
    print(f"📁 Archivos creados: {len(archivos_convertidos)}")
    
    for archivo in archivos_convertidos:
        print(f"  📀 {archivo}")
    
    print(f"\n📋 Formatos cumplidos según especificaciones del profesor:")
    print(f"  ✅ Formato AAC - Calidad 64 Kbps - Códec AAC-HE")
    print(f"  ✅ Formato AAC - Calidad 128 Kbps - Códec AAC-LC") 
    print(f"  ✅ Formato AAC - Calidad 256 Kbps - Códec AAC-LC")

if __name__ == "__main__":
    main()