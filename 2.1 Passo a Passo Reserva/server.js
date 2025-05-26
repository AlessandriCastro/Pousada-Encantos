import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'

const app = express()

const port = 3000

// Middleware para processar JSON
app.use(express.json())

// Obter o diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Caminho para o arquivo de dados
const dbPath = join(__dirname, 'data', 'db.json')

// Função para ler dados do arquivo
async function readData() {
    try {
        const data = await fs.readFile(dbPath, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        return { reservas: [], contatos: [], usuarios: [] }
    }
}

// Função para escrever dados no arquivo
async function writeData(data) {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2))
}

// Servir arquivos estáticos da pasta atual
app.use(express.static(__dirname))

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

// Rotas da API

// Reservas
app.post('/api/reservas', async (req, res) => {
    try {
        const data = await readData()
        const novaReserva = {
            id: Date.now().toString(),
            ...req.body,
            dataCriacao: new Date().toISOString()
        }
        data.reservas.push(novaReserva)
        await writeData(data)
        res.status(201).json(novaReserva)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar reserva' })
    }
})

app.get('/api/reservas', async (req, res) => {
    try {
        const data = await readData()
        res.json(data.reservas)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar reservas' })
    }
})

// Contatos
app.post('/api/contatos', async (req, res) => {
    try {
        const data = await readData()
        const novoContato = {
            id: Date.now().toString(),
            ...req.body,
            dataCriacao: new Date().toISOString()
        }
        data.contatos.push(novoContato)
        await writeData(data)
        res.status(201).json(novoContato)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar contato' })
    }
})

app.get('/api/contatos', async (req, res) => {
    try {
        const data = await readData()
        res.json(data.contatos)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar contatos' })
    }
})

// Usuários
app.post('/api/usuarios', async (req, res) => {
    try {
        const data = await readData()
        const novoUsuario = {
            id: Date.now().toString(),
            ...req.body,
            dataCriacao: new Date().toISOString()
        }
        data.usuarios.push(novoUsuario)
        await writeData(data)
        res.status(201).json(novoUsuario)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' })
    }
})

app.get('/api/usuarios', async (req, res) => {
    try {
        const data = await readData()
        res.json(data.usuarios)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
})

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
}) 