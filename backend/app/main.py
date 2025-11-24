"""
TaskMonitor 3.0 - Aplicação Principal
Sistema de Monitoramento Avançado com Estética Web3.0/Cyberpunk
"""

import sys
from pathlib import Path

# ✅ PASSO 1: Adicionar diretório raiz ao path PRIMEIRO
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

# ✅ PASSO 2: Agora importar tudo (DEPOIS de configurar o path)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import settings
from backend.app.database.database import init_db
from backend.app.routers import monitoring
from backend.app.routers import backups
from backend.app.routers import logs   # <-- Adicionado

# Inicializar banco de dados
init_db()

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Sistema de Monitoramento Avançado com Estética Web3.0/Cyberpunk"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar arquivos estáticos
app.mount("/static", StaticFiles(directory=str(settings.STATIC_DIR)), name="static")

# ✅ Incluir routers de API
app.include_router(monitoring.router, prefix="/api", tags=["monitoring"])
app.include_router(backups.router, prefix='/api', tags=["backups"])
app.include_router(logs.router, prefix='/api', tags=["logs"])  # <-- Adicionado

# ============================================
# ROTA CUSTOMIZADA PARA SERVIR JS SEM CACHE
# ============================================
@app.get("/static/js/{file_name}")
async def serve_js_no_cache(file_name: str):
    """Servir arquivos JS com headers no-cache"""
    file_path = settings.STATIC_DIR / "js" / file_name
    
    if not file_path.exists():
        return {"error": "File not found"}, 404
    
    response = FileResponse(
        path=str(file_path),
        media_type="application/javascript",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )
    return response

# ============================================
# ✅ ROTA PARA SERVIR FAVICON
# ============================================
@app.get("/favicon.ico")
async def favicon():
    """Servir favicon"""
    favicon_path = settings.STATIC_DIR / "favicon.ico"
    
    if favicon_path.exists():
        return FileResponse(
            path=str(favicon_path),
            media_type="image/x-icon"
        )
    else:
        # Retorna 204 No Content se não existir
        return HTMLResponse(content="", status_code=204)

@app.get("/")
async def root():
    """Página inicial"""
    index_path = settings.TEMPLATES_DIR / "index.html"
    with open(index_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 TaskMonitor 3.0 - Iniciando servidor...")
    print("📍 URL: http://localhost:8000")
    print("🔧 No-Cache habilitado para arquivos JS")
    print("🎨 Favicon configurado")
    print("📦 Backups habilitado")
    print("="*60 + "\n")
    
    uvicorn.run(
        "backend.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
