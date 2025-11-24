"""
Monitor de sistema - Coleta todas as métricas
OTIMIZADO: Menos uso de CPU, suporte a bateria
"""
import psutil
import platform
from datetime import datetime
from typing import Dict, List, Any, Optional

class SystemMonitor:
    """Classe principal de monitoramento do sistema"""
    
    def __init__(self):
        self.boot_time = psutil.boot_time()
        self.net_io_start = psutil.net_io_counters()
    
    def get_cpu_info(self) -> Dict[str, Any]:
        """Informações da CPU - OTIMIZADO"""
        # Interval reduzido para não travar
        cpu_percent = psutil.cpu_percent(interval=0.1, percpu=False)
        cpu_freq = psutil.cpu_freq()
        
        return {
            "percent": round(cpu_percent, 2),
            "frequency": round(cpu_freq.current, 2) if cpu_freq else 0,
            "cores_physical": psutil.cpu_count(logical=False),
            "cores_logical": psutil.cpu_count(logical=True),
            "per_core": [round(x, 2) for x in psutil.cpu_percent(interval=0.1, percpu=True)]
        }
    
    def get_memory_info(self) -> Dict[str, Any]:
        """Informações de memória RAM"""
        mem = psutil.virtual_memory()
        swap = psutil.swap_memory()
        
        return {
            "total": round(mem.total / (1024**3), 2),  # GB
            "available": round(mem.available / (1024**3), 2),
            "used": round(mem.used / (1024**3), 2),
            "percent": round(mem.percent, 2),
            "swap_total": round(swap.total / (1024**3), 2),
            "swap_used": round(swap.used / (1024**3), 2),
            "swap_percent": round(swap.percent, 2)
        }
    
    def get_disk_info(self) -> Dict[str, Any]:
        """Informações de disco"""
        disk = psutil.disk_usage('/')
        
        partitions = []
        for partition in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(partition.mountpoint)
                partitions.append({
                    "device": partition.device,
                    "mountpoint": partition.mountpoint,
                    "fstype": partition.fstype,
                    "total": round(usage.total / (1024**3), 2),
                    "used": round(usage.used / (1024**3), 2),
                    "free": round(usage.free / (1024**3), 2),
                    "percent": round(usage.percent, 2)
                })
            except PermissionError:
                continue
        
        return {
            "total": round(disk.total / (1024**3), 2),
            "used": round(disk.used / (1024**3), 2),
            "free": round(disk.free / (1024**3), 2),
            "percent": round(disk.percent, 2),
            "partitions": partitions
        }
    
    def get_network_info(self) -> Dict[str, Any]:
        """Informações de rede"""
        net_io = psutil.net_io_counters()
        
        # Calcular velocidade desde o início
        bytes_sent_delta = net_io.bytes_sent - self.net_io_start.bytes_sent
        bytes_recv_delta = net_io.bytes_recv - self.net_io_start.bytes_recv
        
        return {
            "bytes_sent": round(net_io.bytes_sent / (1024**2), 2),  # MB
            "bytes_recv": round(net_io.bytes_recv / (1024**2), 2),
            "bytes_sent_delta": round(bytes_sent_delta / (1024**2), 2),
            "bytes_recv_delta": round(bytes_recv_delta / (1024**2), 2),
            "packets_sent": net_io.packets_sent,
            "packets_recv": net_io.packets_recv,
            "errin": net_io.errin,
            "errout": net_io.errout,
            "dropin": net_io.dropin,
            "dropout": net_io.dropout
        }
    
    def get_network_connections(self) -> List[Dict[str, Any]]:
        """Conexões de rede ativas - LIMITADO para performance"""
        connections = []
        try:
            for conn in psutil.net_connections(kind='inet'):
                if conn.status == 'ESTABLISHED':
                    connections.append({
                        "local_address": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "N/A",
                        "remote_address": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "N/A",
                        "status": conn.status,
                        "pid": conn.pid
                    })
                    # Limitar a 30 para não sobrecarregar
                    if len(connections) >= 30:
                        break
        except:
            pass
        
        return connections
    
    def get_processes(self, limit: int = 15) -> List[Dict[str, Any]]:
        """Top processos por CPU e memória - REDUZIDO"""
        processes = []
        
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status', 'username']):
            try:
                pinfo = proc.info
                processes.append({
                    "pid": pinfo['pid'],
                    "name": pinfo['name'],
                    "cpu_percent": round(pinfo['cpu_percent'] or 0, 2),
                    "memory_percent": round(pinfo['memory_percent'] or 0, 2),
                    "status": pinfo['status'],
                    "username": pinfo['username'] if pinfo['username'] else "N/A"
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        
        # Ordenar por CPU
        processes.sort(key=lambda x: x['cpu_percent'], reverse=True)
        return processes[:limit]
    
    def get_battery_info(self) -> Optional[Dict[str, Any]]:
        """Informações de bateria (notebooks) - NOVO"""
        try:
            battery = psutil.sensors_battery()
            if not battery:
                return None
            
            # Calcular tempo restante
            if battery.secsleft == psutil.POWER_TIME_UNLIMITED:
                time_left = "Carregando"
            elif battery.secsleft == psutil.POWER_TIME_UNKNOWN:
                time_left = "Desconhecido"
            else:
                hours = battery.secsleft // 3600
                minutes = (battery.secsleft % 3600) // 60
                time_left = f"{int(hours)}h {int(minutes)}m"
            
            return {
                "percent": round(battery.percent, 1),
                "plugged": battery.power_plugged,
                "time_left": time_left,
                "secsleft": battery.secsleft
            }
        except:
            return None
    
    def get_system_info(self) -> Dict[str, Any]:
        """Informações gerais do sistema"""
        uptime_seconds = datetime.now().timestamp() - self.boot_time
        
        return {
            "platform": platform.system(),
            "platform_release": platform.release(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "hostname": platform.node(),
            "processor": platform.processor(),
            "python_version": platform.python_version(),
            "boot_time": datetime.fromtimestamp(self.boot_time).strftime("%Y-%m-%d %H:%M:%S"),
            "uptime_seconds": round(uptime_seconds, 0),
            "uptime_formatted": self._format_uptime(uptime_seconds)
        }
    
    def _format_uptime(self, seconds: float) -> str:
        """Formatar uptime em formato legível"""
        days = int(seconds // 86400)
        hours = int((seconds % 86400) // 3600)
        minutes = int((seconds % 3600) // 60)
        
        if days > 0:
            return f"{days}d {hours}h {minutes}m"
        elif hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Retorna todas as métricas de uma vez - OTIMIZADO"""
        return {
            "timestamp": datetime.now().isoformat(),
            "cpu": self.get_cpu_info(),
            "memory": self.get_memory_info(),
            "disk": self.get_disk_info(),
            "network": self.get_network_info(),
            "battery": self.get_battery_info(),  # NOVO
            "system": self.get_system_info(),
            "processes": self.get_processes(limit=15),  # Reduzido de 20 para 15
            "connections": self.get_network_connections()
        }
