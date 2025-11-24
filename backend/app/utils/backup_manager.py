"""
Gerenciador de backups em TXT
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
from backend.app.config import settings

class BackupManager:
    """Classe para gerenciar backups do sistema"""
    
    def __init__(self):
        self.backup_path = settings.BACKUP_PATH
        self.backup_path.mkdir(parents=True, exist_ok=True)
    
    def create_backup(self, metrics: Dict[str, Any]) -> str:
        """Criar backup das métricas em formato TXT"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"backup_{timestamp}.txt"
        filepath = self.backup_path / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write(f"TaskMonitor 3.0 - Backup de Monitoramento\n")
            f.write(f"Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write("=" * 80 + "\n\n")
            
            # Sistema
            f.write("[ INFORMAÇÕES DO SISTEMA ]\n")
            f.write("-" * 80 + "\n")
            sys_info = metrics.get('system', {})
            f.write(f"Sistema Operacional: {sys_info.get('platform', 'N/A')} {sys_info.get('platform_release', '')}\n")
            f.write(f"Hostname: {sys_info.get('hostname', 'N/A')}\n")
            f.write(f"Arquitetura: {sys_info.get('architecture', 'N/A')}\n")
            f.write(f"Processador: {sys_info.get('processor', 'N/A')}\n")
            f.write(f"Tempo Ligado: {sys_info.get('uptime_formatted', 'N/A')}\n")
            f.write(f"Python: {sys_info.get('python_version', 'N/A')}\n")
            f.write("\n")
            
            # CPU
            f.write("[ CPU ]\n")
            f.write("-" * 80 + "\n")
            cpu = metrics.get('cpu', {})
            f.write(f"Uso Total: {cpu.get('percent', 0)}%\n")
            f.write(f"Frequência: {cpu.get('frequency', 0)} MHz\n")
            f.write(f"Núcleos Físicos: {cpu.get('cores_physical', 0)}\n")
            f.write(f"Núcleos Lógicos: {cpu.get('cores_logical', 0)}\n")
            per_core = cpu.get('per_core', [])
            if per_core:
                f.write(f"Uso por Núcleo:\n")
                for i, usage in enumerate(per_core):
                    f.write(f"  Core {i}: {usage}%\n")
            f.write("\n")
            
            # Memória
            f.write("[ MEMÓRIA RAM ]\n")
            f.write("-" * 80 + "\n")
            mem = metrics.get('memory', {})
            f.write(f"Total: {mem.get('total', 0)} GB\n")
            f.write(f"Usada: {mem.get('used', 0)} GB\n")
            f.write(f"Disponível: {mem.get('available', 0)} GB\n")
            f.write(f"Uso: {mem.get('percent', 0)}%\n")
            f.write(f"SWAP Total: {mem.get('swap_total', 0)} GB\n")
            f.write(f"SWAP Usado: {mem.get('swap_used', 0)} GB\n")
            f.write(f"SWAP: {mem.get('swap_percent', 0)}%\n")
            f.write("\n")
            
            # Disco
            f.write("[ DISCO ]\n")
            f.write("-" * 80 + "\n")
            disk = metrics.get('disk', {})
            f.write(f"Total: {disk.get('total', 0)} GB\n")
            f.write(f"Usado: {disk.get('used', 0)} GB\n")
            f.write(f"Livre: {disk.get('free', 0)} GB\n")
            f.write(f"Uso: {disk.get('percent', 0)}%\n")
            
            partitions = disk.get('partitions', [])
            if partitions:
                f.write(f"\nPartições:\n")
                for part in partitions:
                    f.write(f"  {part['device']} ({part['mountpoint']}) - {part['fstype']}\n")
                    f.write(f"    Total: {part['total']} GB | Usado: {part['used']} GB | Livre: {part['free']} GB | Uso: {part['percent']}%\n")
            f.write("\n")
            
            # Rede
            f.write("[ REDE ]\n")
            f.write("-" * 80 + "\n")
            net = metrics.get('network', {})
            f.write(f"Enviados (Total): {net.get('bytes_sent', 0)} MB\n")
            f.write(f"Recebidos (Total): {net.get('bytes_recv', 0)} MB\n")
            f.write(f"Enviados (Sessão): {net.get('bytes_sent_delta', 0)} MB\n")
            f.write(f"Recebidos (Sessão): {net.get('bytes_recv_delta', 0)} MB\n")
            f.write(f"Pacotes Enviados: {net.get('packets_sent', 0)}\n")
            f.write(f"Pacotes Recebidos: {net.get('packets_recv', 0)}\n")
            f.write(f"Erros Entrada: {net.get('errin', 0)}\n")
            f.write(f"Erros Saída: {net.get('errout', 0)}\n")
            f.write("\n")
            
            # Processos
            f.write("[ TOP 20 PROCESSOS ]\n")
            f.write("-" * 80 + "\n")
            processes = metrics.get('processes', [])
            f.write(f"{'PID':<10} {'Nome':<30} {'CPU%':<10} {'RAM%':<10} {'Status':<15}\n")
            f.write("-" * 80 + "\n")
            for proc in processes[:20]:
                f.write(f"{proc['pid']:<10} {proc['name'][:29]:<30} {proc['cpu_percent']:<10} {proc['memory_percent']:<10.2f} {proc['status']:<15}\n")
            f.write("\n")
            
            # Conexões
            f.write("[ CONEXÕES DE REDE ATIVAS ]\n")
            f.write("-" * 80 + "\n")
            connections = metrics.get('connections', [])
            if connections:
                f.write(f"Total de Conexões Estabelecidas: {len(connections)}\n\n")
                f.write(f"{'Endereço Local':<30} {'Endereço Remoto':<30} {'Status':<15}\n")
                f.write("-" * 80 + "\n")
                for conn in connections[:20]:
                    f.write(f"{conn['local_address']:<30} {conn['remote_address']:<30} {conn['status']:<15}\n")
            else:
                f.write("Nenhuma conexão estabelecida no momento.\n")
            
            f.write("\n")
            f.write("=" * 80 + "\n")
            f.write("Fim do backup\n")
            f.write("=" * 80 + "\n")
        
        return str(filepath)
    
    def list_backups(self) -> list:
        """Listar todos os backups disponíveis"""
        backups = []
        for file in self.backup_path.glob("backup_*.txt"):
            stat = file.stat()
            backups.append({
                "filename": file.name,
                "path": str(file),
                "size": round(stat.st_size / 1024, 2),  # KB
                "created": datetime.fromtimestamp(stat.st_ctime).strftime("%d/%m/%Y %H:%M:%S")
            })
        
        # Ordenar por data de criação (mais recente primeiro)
        backups.sort(key=lambda x: x['created'], reverse=True)
        return backups
    
    def delete_old_backups(self, keep_last: int = 10):
        """Deletar backups antigos, mantendo apenas os últimos N"""
        backups = self.list_backups()
        
        if len(backups) > keep_last:
            for backup in backups[keep_last:]:
                try:
                    os.remove(backup['path'])
                except Exception as e:
                    print(f"Erro ao deletar backup {backup['filename']}: {e}")
