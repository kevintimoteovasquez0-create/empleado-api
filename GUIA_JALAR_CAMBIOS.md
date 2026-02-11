# Guía para Jalar Cambios del Backend

## Requisitos Previos

- Tener **Git** instalado
- Tener **pnpm** instalado
- Tener acceso al repositorio en GitHub

---

## Pasos para Jalar Cambios

### 1. Abrir la terminal en la carpeta del proyecto

```bash
cd "/home/encebolladouwu/Documentos/Empresa Proyectos/EMPRESOFTPERU-BACKEND"
```

### 2. Verificar en qué rama estás y si tienes cambios sin guardar

```bash
git status
```

- Si dice **"nothing to commit, working tree clean"** → Todo limpio, sigue al paso 3.
- Si dice que tienes **cambios sin commit** → Ve al paso 2.1 primero.

#### 2.1 Guardar cambios temporalmente (solo si tienes cambios locales)

```bash
git stash
```

> Esto guarda tus cambios locales en un "cajón temporal" para que no se pierdan.

### 3. Cambiarte a la rama main

```bash
git checkout main
```

### 4. Jalar los cambios nuevos del repositorio remoto

```bash
git pull origin main
```

> Esto descarga todos los cambios que tus compañeros hayan subido a la rama `main`.

### 5. Instalar dependencias nuevas

```bash
pnpm install
```

> Importante porque alguien pudo haber agregado paquetes nuevos al proyecto.

### 6. (Opcional) Aplicar migraciones de base de datos

Si te avisan que hubo cambios en la base de datos (tablas nuevas, columnas, etc.):

```bash
pnpm drizzle-kit migrate
```

### 7. (Opcional) Recuperar tus cambios guardados

Si hiciste `git stash` en el paso 2.1:

```bash
git stash pop
```

### 8. Volver a tu rama de trabajo (si tenías una)

```bash
git checkout nombre-de-tu-rama
```

Y para traer los cambios de main a tu rama:

```bash
git merge main
```

---

## Resumen Rápido (Copiar y Pegar)

Si no tienes cambios locales y solo quieres actualizar:

```bash
git checkout main
git pull origin main
pnpm install
```

---

## Levantar el Backend después de jalar cambios

```bash
pnpm run start:dev
```

## Crear el Tunnel con Cloudflare (para compartir el enlace)

```bash
cloudflared tunnel --url http://localhost:3002
```

> Esto genera un enlace público tipo `https://xxxxx.trycloudflare.com` que puedes compartir.

---

## Comandos Útiles Extras

| Comando                 | Qué hace                                     |
| ----------------------- | -------------------------------------------- |
| `git status`            | Ver estado actual (rama, cambios pendientes) |
| `git branch`            | Ver todas las ramas locales                  |
| `git branch -a`         | Ver todas las ramas (locales y remotas)      |
| `git log --oneline -10` | Ver los últimos 10 commits                   |
| `git stash list`        | Ver cambios guardados con stash              |
| `git diff`              | Ver qué archivos cambiaste                   |

---

## Solución de Problemas

### "error: Your local changes would be overwritten by checkout"

Significa que tienes cambios sin guardar. Haz `git stash` primero y luego intenta de nuevo.

### "CONFLICT (content): Merge conflict in archivo.ts"

Significa que tus cambios chocan con los del repositorio. Avísale a tu jefe para resolverlo juntos.

### "pnpm install" da errores

Intenta borrar la carpeta `node_modules` y el archivo `pnpm-lock.yaml`, y vuelve a instalar:

```bash
rm -rf node_modules
pnpm install
```
