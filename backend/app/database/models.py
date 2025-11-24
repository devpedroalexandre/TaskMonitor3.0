"""
Models do banco de dados
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from backend.app.database.database import Base

class SystemMetrics(Base):
    """Métricas do sistema"""
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # CPU
    cpu_percent = Column(Float)
    cpu_freq = Column(Float)
    cpu_count = Column(Integer)
    
    # Memória
    memory_percent = Column(Float)
    memory_used = Column(Float)
    memory_total = Column(Float)
    
    # Disco
    disk_percent = Column(Float)
    disk_used = Column(Float)
    disk_total = Column(Float)
    
    # Rede
    bytes_sent = Column(Float)
    bytes_recv = Column(Float)
    
    # Sistema
    uptime = Column(Float)

class ProcessInfo(Base):
    """Informações de processos"""
    __tablename__ = "process_info"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    pid = Column(Integer)
    name = Column(String)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    status = Column(String)

class Alert(Base):
    """Alertas do sistema"""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    alert_type = Column(String)  # CPU, RAM, DISK
    severity = Column(String)  # INFO, WARNING, CRITICAL
    message = Column(String)
    value = Column(Float)
    resolved = Column(Boolean, default=False)
