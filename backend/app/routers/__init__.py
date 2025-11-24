"""
====================================================
TaskMonitor 3.0 - Routers Module
====================================================
Exporta todos os routers da aplicação
"""

from .monitoring import router as monitoring_router
from .backups import router as backups_router
from .logs import router as logs_router

__all__ = [
    'monitoring_router',
    'backups_router',
    'logs_router',
]

# ============================================
# 📊 SISTEMA DE LOGGING GLOBAL
# ============================================
import logging
import os
from logging.handlers import RotatingFileHandler

# Cria pasta de logs
logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(logs_dir, exist_ok=True)

# Configura arquivo de log
log_file = os.path.join(logs_dir, 'taskmonitor.log')

# Handler para arquivo (rotativo, máximo 10MB, 5 backups)
file_handler = RotatingFileHandler(
    log_file, 
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5,
    encoding='utf-8'
)
file_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
)

# Handler para console
console_handler = logging.StreamHandler()
console_handler.setFormatter(
    logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
)

# Configura logger principal
logger = logging.getLogger('taskmonitor')
logger.setLevel(logging.INFO)
if not logger.hasHandlers():
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

# Log de inicialização (apenas uma vez)
if not hasattr(logger, '_init_logged'):
    logger.info('===========================================')
    logger.info('Sistema inicializado - DOAÇÃO COM CARTÃO')
    logger.info('===========================================')
    logger._init_logged = True
