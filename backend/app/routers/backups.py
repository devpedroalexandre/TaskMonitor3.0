# ============================================
# BACKUP ROUTES - TaskMonitor 3.0
# ============================================


from fastapi import APIRouter
from pathlib import Path
from datetime import datetime
import logging
import sys


# Adicionar o diretório raiz ao path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))


logger = logging.getLogger(__name__)
router = APIRouter()


# ✅ CORREÇÃO: Importar e criar instância do SystemMonitor
from backend.app.utils.system_monitor import SystemMonitor
monitor = SystemMonitor()


@router.get('/backups')
async def list_backups():
    """Listar TODOS os backups - SEM LIMITE!"""
    try:
        backup_dir = Path('backend/app/backups')
        if not backup_dir.exists():
            return {'count': 0, 'backups': []}
        
        backups = []
        for file in sorted(backup_dir.glob('backup_*.txt'), reverse=True):
            try:
                stat = file.stat()
                size_kb = stat.st_size / 1024
                created = datetime.fromtimestamp(stat.st_mtime).strftime('%d/%m/%Y %H:%M:%S')
                backups.append({
                    'filename': file.name,
                    'created': created,
                    'size': round(size_kb, 2)
                })
            except Exception as e:
                logger.error(f"Erro ao processar backup {file.name}: {e}")
        
        # ✅ RETORNA TODOS OS BACKUPS (sem limite)
        return {
            'count': len(backups),
            'backups': backups
        }
    
    except Exception as e:
        logger.error(f"Erro ao listar backups: {e}")
        return {'error': str(e), 'count': 0, 'backups': []}



@router.post('/backup')
async def create_backup():
    """Criar novo backup com TODOS os dados incluindo REDE"""
    try:
        # ✅ CORREÇÃO: Usar funções corretas do monitor
        metrics = monitor.get_all_metrics()
        sys_info = monitor.get_system_info()
        
        # Calcular valores adicionais
        memory_available = round(metrics['memory']['total'] - metrics['memory']['used'], 2)
        disk_free = round(metrics['disk']['total'] - metrics['disk']['used'], 2)
        
        # ✅ GARANTIR QUE DADOS DE REDE EXISTEM
        network_bytes_sent = metrics['network'].get('bytes_sent', 0)
        network_bytes_recv = metrics['network'].get('bytes_recv', 0)
        network_speed_sent = metrics['network'].get('speed_sent', 0)
        network_speed_recv = metrics['network'].get('speed_recv', 0)
        network_packets_sent = metrics['network'].get('packets_sent', 0)
        network_packets_recv = metrics['network'].get('packets_recv', 0)
        
        # ✅ BACKUP COM TODOS OS DADOS DE REDE!
        backup_text = f"""==============================================
Backup de Monitoramento - TaskMonitor 3.0
Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}
==============================================


[ SISTEMA OPERACIONAL ]
SO: {sys_info['platform']}
Host: {sys_info['hostname']}
Arquitetura: {sys_info['architecture']}
Processador: {sys_info['processor']}
Python: {sys_info['python_version']}
Ligado: {sys_info.get('uptime_formatted', 'N/A')}


[ CPU ]
Uso: {metrics['cpu']['percent']}%
Frequência: {metrics['cpu']['frequency']} MHz
Núcleos: {metrics['cpu']['cores_physical']} físicos / {metrics['cpu']['cores_logical']} lógicos


[ MEMÓRIA RAM ]
Total: {metrics['memory']['total']} GB
Usada: {metrics['memory']['used']} GB ({metrics['memory']['percent']}%)
Disponível: {memory_available} GB


[ DISCO ]
Total: {metrics['disk']['total']} GB
Usado: {metrics['disk']['used']} GB ({metrics['disk']['percent']}%)
Livre: {disk_free} GB


[ REDE ]
Bytes Enviados Total: {network_bytes_sent} MB
Bytes Recebidos Total: {network_bytes_recv} MB
Pacotes Enviados: {network_packets_sent}
Pacotes Recebidos: {network_packets_recv}
Velocidade Upload: {network_speed_sent} Mbps
Velocidade Download: {network_speed_recv} Mbps


==============================================
Fim do Backup
=============================================="""
        
        # Criar diretório se não existir
        backup_dir = Path('backend/app/backups')
        backup_dir.mkdir(parents=True, exist_ok=True)
        
        # Salvar arquivo
        filename = f"backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        filepath = backup_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(backup_text)
        
        logger.info(f"✅ Backup criado: {filename}")
        
        # ✅ CORREÇÃO: NÃO deletar backups antigos - manter TODOS
        # (removido: backup_manager.delete_old_backups(keep_last=10))
        
        return {
            'success': True,
            'filepath': str(filepath),
            'filename': filename
        }
    
    except Exception as e:
        logger.error(f"❌ Erro ao criar backup: {e}")
        import traceback
        traceback.print_exc()
        return {'success': False, 'error': str(e)}



@router.get('/backup/{filename}')
async def get_backup(filename: str):
    """Obter conteúdo de um backup específico"""
    try:
        # Segurança: evitar path traversal
        if '..' in filename or '/' in filename or '\\' in filename:
            return {'error': 'Caminho inválido'}
        
        backup_path = Path('backend/app/backups') / filename
        
        if not backup_path.exists():
            return {'error': 'Arquivo não encontrado'}
        
        with open(backup_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return {
            'filename': filename,
            'raw_text': content
        }
    
    except Exception as e:
        logger.error(f"Erro ao ler backup: {e}")
        import traceback
        traceback.print_exc()
        return {'error': str(e)}
