"""
Rotas de monitoramento - API e WebSocket
✅ VERSÃO CORRIGIDA - VELOCIDADE DE REDE FUNCIONANDO
✅ BACKUP SEM LIMITE DE 10
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import asyncio
from datetime import datetime
import sys
from pathlib import Path
import time
import logging

# Configura logger
logger = logging.getLogger('taskmonitor')


# Adicionar o diretório raiz ao path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))


from backend.app.utils.system_monitor import SystemMonitor
from backend.app.utils.backup_manager import BackupManager
from backend.app.config import settings


router = APIRouter()
monitor = SystemMonitor()
backup_manager = BackupManager()


# Gerenciador de conexões WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []


    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)


    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)


    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass


manager = ConnectionManager()


# ============ CACHE GLOBAL PARA VELOCIDADE DE REDE ============
# ✅ CORREÇÃO: Inicializar com valores válidos na primeira chamada
_network_cache = {
    'last_bytes_sent': None,
    'last_bytes_recv': None,
    'last_time': None,
    'initialized': False  # Flag para evitar cálculo errado na primeira vez
}


@router.get("/")
async def root():
    """Endpoint raiz"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@router.get("/status")
async def get_status():
    """
    Endpoint de status do sistema
    Retorna informações básicas de saúde da aplicação
    """
    try:
        return JSONResponse(content={
            "status": "online",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "timestamp": datetime.now().isoformat(),
            "uptime": monitor.get_system_info().get("boot_time", "unknown")
        })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )


@router.get("/metrics")
async def get_metrics():
    """Obter todas as métricas do sistema COM VELOCIDADE DE REDE"""
    try:
        import psutil
        
        # Obter todas as métricas básicas
        metrics = monitor.get_all_metrics()
        
        # ✅ CALCULAR VELOCIDADE DE REDE
        network_stats = psutil.net_io_counters()
        current_time = time.time()
        current_bytes_sent = network_stats.bytes_sent / (1024 * 1024)  # MB
        current_bytes_recv = network_stats.bytes_recv / (1024 * 1024)  # MB


        speed_sent = 0.0
        speed_recv = 0.0


        # ✅ CORREÇÃO: Só calcular velocidade após inicialização
        if _network_cache['initialized'] and _network_cache['last_time'] is not None:
            time_diff = current_time - _network_cache['last_time']
            if time_diff > 0:
                # Calcular diferença em MB
                bytes_sent_diff = current_bytes_sent - _network_cache['last_bytes_sent']
                bytes_recv_diff = current_bytes_recv - _network_cache['last_bytes_recv']
                
                # Converter para Mbps (Megabits por segundo)
                speed_sent = (bytes_sent_diff * 8) / time_diff  # MB/s * 8 = Mbps
                speed_recv = (bytes_recv_diff * 8) / time_diff
                
                # ✅ GARANTIR QUE NÃO SEJA NEGATIVO
                speed_sent = max(0, speed_sent)
                speed_recv = max(0, speed_recv)


        # Atualizar cache
        _network_cache['last_bytes_sent'] = current_bytes_sent
        _network_cache['last_bytes_recv'] = current_bytes_recv
        _network_cache['last_time'] = current_time
        _network_cache['initialized'] = True


        # ✅ ADICIONAR VELOCIDADE AO OBJETO NETWORK
        if 'network' in metrics:
            metrics['network']['speed_sent'] = round(speed_sent, 2)
            metrics['network']['speed_recv'] = round(speed_recv, 2)
        
        return JSONResponse(content=metrics)
    except Exception as e:
        print(f"❌ Erro em get_metrics: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/cpu")
async def get_cpu_metrics():
    """Obter apenas métricas de CPU"""
    try:
        cpu_info = monitor.get_cpu_info()
        return JSONResponse(content=cpu_info)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/memory")
async def get_memory_metrics():
    """Obter apenas métricas de memória"""
    try:
        memory_info = monitor.get_memory_info()
        return JSONResponse(content=memory_info)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/disk")
async def get_disk_metrics():
    """Obter apenas métricas de disco"""
    try:
        disk_info = monitor.get_disk_info()
        return JSONResponse(content=disk_info)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/network")
async def get_network_metrics():
    """Obter métricas de rede COM VELOCIDADE CALCULADA CORRETAMENTE"""
    try:
        import psutil
        # Obter dados atuais
        network_stats = psutil.net_io_counters()
        current_time = time.time()
        current_bytes_sent = network_stats.bytes_sent / (1024 * 1024)  # MB
        current_bytes_recv = network_stats.bytes_recv / (1024 * 1024)  # MB


        speed_sent = 0.0
        speed_recv = 0.0


        # ✅ CORREÇÃO: Só calcular após inicialização
        if _network_cache['initialized'] and _network_cache['last_time'] is not None:
            time_diff = current_time - _network_cache['last_time']
            if time_diff > 0:
                # Calcular diferença em MB
                bytes_sent_diff = current_bytes_sent - _network_cache['last_bytes_sent']
                bytes_recv_diff = current_bytes_recv - _network_cache['last_bytes_recv']
                
                # Converter para Mbps
                speed_sent = (bytes_sent_diff * 8) / time_diff
                speed_recv = (bytes_recv_diff * 8) / time_diff
                
                # ✅ GARANTIR QUE NÃO SEJA NEGATIVO
                speed_sent = max(0, speed_sent)
                speed_recv = max(0, speed_recv)


        # Atualizar cache
        _network_cache['last_bytes_sent'] = current_bytes_sent
        _network_cache['last_bytes_recv'] = current_bytes_recv
        _network_cache['last_time'] = current_time
        _network_cache['initialized'] = True


        # Retornar dados
        network_info = {
            "bytes_sent": round(current_bytes_sent, 2),
            "bytes_recv": round(current_bytes_recv, 2),
            "packets_sent": network_stats.packets_sent,
            "packets_recv": network_stats.packets_recv,
            "speed_sent": round(speed_sent, 2),
            "speed_recv": round(speed_recv, 2)
        }
        return JSONResponse(content=network_info)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/processes")
async def get_processes():
    """Obter lista de processos"""
    try:
        processes = monitor.get_processes(limit=30)
        return JSONResponse(content={"processes": processes})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/battery")
async def get_battery_metrics():
    """Obter informações de bateria"""
    try:
        battery_info = monitor.get_battery_info()
        return JSONResponse(content=battery_info if battery_info else {"available": False})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/metrics/system")
async def get_system_info():
    """Obter informações do sistema"""
    try:
        system_info = monitor.get_system_info()
        return JSONResponse(content=system_info)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.post("/backup")
async def create_backup():
    logger.info('📦 Criando backup...') 
    """Criar backup das métricas atuais - SEM LIMITE DE BACKUPS"""
    try:
        metrics = monitor.get_all_metrics()
        filepath = backup_manager.create_backup(metrics)
        # ✅ CORREÇÃO: Removido delete_old_backups para permitir crescimento ilimitado
        # backup_manager.delete_old_backups(keep_last=10)  # ❌ LINHA COMENTADA
        return JSONResponse(content={
            "success": True,
            "message": "Backup criado com sucesso",
            "filepath": filepath,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f'❌ Erro ao criar backup: {str(e)}')
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )


@router.get("/backups")
async def list_backups():
    """Listar todos os backups"""
    try:
        backups = backup_manager.list_backups()
        return JSONResponse(content={
            "backups": backups,
            "count": len(backups)
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/backup/{filename}")
async def get_backup_content(filename: str):
    """Endpoint para visualizar conteúdo dos backups TXT"""
    try:
        base_dir = Path(__file__).resolve().parent.parent
        backup_path = base_dir / "backups" / filename
        
        print(f"\n{'='*60}")
        print(f"🔍 PROCURANDO BACKUP:")
        print(f"📂 Diretório base: {base_dir}")
        print(f"📁 Pasta backups: {base_dir / 'backups'}")
        print(f"📄 Arquivo: {filename}")
        print(f"🎯 Caminho completo: {backup_path}")
        print(f"✅ Arquivo existe? {backup_path.exists()}")


        if not backup_path.exists():
            return JSONResponse(
                status_code=404,
                content={"error": f"Arquivo não encontrado: {filename}"}
            )
        
        with open(backup_path, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        
        print("✅ Backup carregado com sucesso!")
        return JSONResponse(content={"raw_text": conteudo})


    except Exception as e:
        print(f"❌ Erro geral: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get("/donations")
async def get_donation_info():
    """Obter informações de doação"""
    return JSONResponse(content={
        "bitcoin": settings.BITCOIN_ADDRESS,
        "ethereum": settings.ETHEREUM_ADDRESS,
        "litecoin": settings.LITECOIN_ADDRESS,
        "solana": settings.SOLANA_ADDRESS,
        "pix": settings.PIX_KEY
    })


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket para streaming de métricas em tempo real
    ✅ CORRIGIDO: Agora envia velocidade de rede
    """
    await manager.connect(websocket)


    try:
        while True:
            import psutil
            
            # Obter métricas básicas
            metrics = monitor.get_all_metrics()
            
            # ✅ CALCULAR VELOCIDADE DE REDE (igual ao endpoint /metrics)
            network_stats = psutil.net_io_counters()
            current_time = time.time()
            current_bytes_sent = network_stats.bytes_sent / (1024 * 1024)
            current_bytes_recv = network_stats.bytes_recv / (1024 * 1024)


            speed_sent = 0.0
            speed_recv = 0.0


            if _network_cache['initialized'] and _network_cache['last_time'] is not None:
                time_diff = current_time - _network_cache['last_time']
                if time_diff > 0:
                    bytes_sent_diff = current_bytes_sent - _network_cache['last_bytes_sent']
                    bytes_recv_diff = current_bytes_recv - _network_cache['last_bytes_recv']
                    
                    speed_sent = max(0, (bytes_sent_diff * 8) / time_diff)
                    speed_recv = max(0, (bytes_recv_diff * 8) / time_diff)


            _network_cache['last_bytes_sent'] = current_bytes_sent
            _network_cache['last_bytes_recv'] = current_bytes_recv
            _network_cache['last_time'] = current_time
            _network_cache['initialized'] = True


            # ✅ ADICIONAR VELOCIDADE
            if 'network' in metrics:
                metrics['network']['speed_sent'] = round(speed_sent, 2)
                metrics['network']['speed_recv'] = round(speed_recv, 2)
            
            # Enviar métricas a cada 5 segundos
            await websocket.send_json(metrics)
            await asyncio.sleep(5)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
