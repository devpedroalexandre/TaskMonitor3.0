from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os
import logging

router = APIRouter()
logger = logging.getLogger('taskmonitor')

@router.get("/logs")
async def get_logs():
    """Retorna os logs do sistema"""
    try:
        # Caminho correto: backend/app/logs/taskmonitor.log
        base_dir = os.path.dirname(os.path.dirname(__file__))
        logs_dir = os.path.join(base_dir, 'logs')
        log_file_path = os.path.join(logs_dir, 'taskmonitor.log')
        
        # Se arquivo não existe, retorna lista vazia
        if not os.path.exists(log_file_path):
            logger.warning(f'Arquivo de log não encontrado: {log_file_path}')
            return JSONResponse(content={
                'success': True,
                'logs': []
            })
        
        # Lê as últimas 100 linhas do arquivo
        with open(log_file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()[-100:]
        
        logs = []
        for line in lines:
            # Formato esperado: 2025-11-24 11:42:19,123 - INFO - Mensagem
            parts = line.strip().split(' - ', 2)
            if len(parts) >= 3:
                timestamp_raw = parts[0]
                level = parts[1].lower()
                message = parts[2]
                
                timestamp = timestamp_raw.split(',')[0] if ',' in timestamp_raw else timestamp_raw
                
                logs.append({
                    'timestamp': timestamp,
                    'type': level,
                    'message': message
                })
        
        return JSONResponse(content={
            'success': True,
            'logs': logs
        })

    except Exception as e:
        logger.error(f"Erro ao carregar logs: {str(e)}")
        return JSONResponse(content={
            'success': False,
            'error': str(e),
            'logs': []
        })
