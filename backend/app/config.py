"""
Configurações da aplicação TaskMonitor 3.0
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

class Settings:
    """Configurações principais da aplicação"""
    
    # Aplicação
    APP_NAME: str = os.getenv("APP_NAME", "TaskMonitor 3.0")
    APP_VERSION: str = os.getenv("APP_VERSION", "3.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./taskmonitor3.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "taskmonitor3_secret_key")
    
    # Backup
    BACKUP_INTERVAL: int = int(os.getenv("BACKUP_INTERVAL", "300"))
    BACKUP_PATH: Path = Path(__file__).parent / "backups"

    
    # Monitoring
    UPDATE_INTERVAL: int = int(os.getenv("UPDATE_INTERVAL", "2000"))
    ALERT_CPU_THRESHOLD: int = int(os.getenv("ALERT_CPU_THRESHOLD", "80"))
    ALERT_RAM_THRESHOLD: int = int(os.getenv("ALERT_RAM_THRESHOLD", "85"))
    ALERT_DISK_THRESHOLD: int = int(os.getenv("ALERT_DISK_THRESHOLD", "90"))
    
    # Donation addresses - COLOQUE SEUS ENDEREÇOS AQUI
    BITCOIN_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"  # Exemplo
    ETHEREUM_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"  # Exemplo
    BNB_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"  # Exemplo
    POLYGON_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"  # Exemplo
    SOLANA_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"  # Exemplo
    PIX_KEY = "seu-email@exemplo.com"  # Seu email/telefone/CPF do PIX
    PAYPAL_EMAIL = "seu-email@paypal.com"  # Seu PayPal

    
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent
    STATIC_DIR: Path = BASE_DIR / "static"
    TEMPLATES_DIR: Path = BASE_DIR / "templates"
    LOGS_DIR: Path = BASE_DIR.parent.parent / "logs"
    
    def __init__(self):
        """Criar diretórios necessários"""
        self.BACKUP_PATH.mkdir(parents=True, exist_ok=True)
        self.LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Instância global das configurações
settings = Settings()
