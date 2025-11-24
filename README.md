# TaskMonitor 3.0

Sistema de Monitoramento Avançado com Estética Web3.0/Cyberpunk, desenvolvido em FastAPI + Python.

## Recursos

- **Monitoramento de Sistema**: CPU, RAM, Disco, Rede (com velocidade) e Bateria
- **Processos em Tempo Real**: Listagem e detalhamento de processos ativos
- **WebSockets** para streaming de métricas (dashboard em tempo real)
- **Backups** ilimitados das métricas coletadas
- **Logs Rotativos** integrados (acesso live e histórico via endpoint `/api/logs`)
- **Frontend Estilizado Web3/Cyberpunk** (personalize à vontade)
- **API extensível** (FastAPI, pronto para documentação automática)

## Pré-requisitos

- Python 3.9+
- Node.js (se usar build de frontend separado)
- Git

## Para rodar localmente

1. **Clone o repositório**

git clone https://github.com/devpedroalexandre/TaskMonitor3.0.git
cd TaskMonitor3.0


2. **Crie e ative um virtualenv**

python -m venv venv

Linux/macOS:
source venv/bin/activate

Windows:
venv\Scripts\activate


3. **Instale as dependências**

pip install -r requirements.txt


5. **Inicie o sistema**

python backend/app/main.py

O sistema estará em [http://localhost:8000/](http://localhost:8000/)

6. **Acesse a API REST**
- `/api/metrics`, `/api/status`, `/api/processes`, `/api/backups` etc.
- `/api/logs`: ver dados de logs filtrados

## Estrutura de Pastas

TaskMonitor3.0/
├── backend/
│ └── app/
│ ├── main.py
│ ├── routers/
│ │ ├── monitoring.py
│ │ ├── backups.py
│ │ └── logs.py
│ ├── logs/
│ │ └── taskmonitor.log
│ ├── utils/
│ ├── config.py
│ ├── database/
│ └── ...
├── .gitignore
├── README.md
├── requirements.txt
└── ...


## Como contribuir

- Faça um fork, crie um branch a partir de `main`, faça sua feature ou correção e submeta um Pull Request.
- Sugestões ou erros: use o campo *Issues* do GitHub.

---

Desenvolvido por [Seu Nome].  
Sinta-se à vontade para customizar o visual, expandir endpoints ou integrar com outros sistemas!

---

Dúvidas ou ajuste extra, é só pedir!
