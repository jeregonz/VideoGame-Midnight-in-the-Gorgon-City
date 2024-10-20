import { Gorgon } from "./Gorgon.js"
import { HealthBonus } from "./HealthBonus.js"
import { MagicSpell } from "./MagicSpell.js"
import { Obstacle } from "./Obstacle.js"
import { Player } from "./Player.js"
import { PowerBonus } from "./PowerBonus.js"
import { player, setPlayer, renderBonusPower, renderGameScore, gameScore, setGameScore, renderHealthPoints } from "./Context.js"

export let enemies = []
let obstacles = []
let gameObjects = [] //objetos como bonus y hechizos
let gameOver = false

document.addEventListener('keydown', keyDownHandler)

let magicSpellCooldown = 200 // retraso de ataque en ms

let spellPool = [] // Pool para proyectiles
let poolSize = 30  // Cantidad de proyectiles en el pool
// Crear el pool con proyectiles inactivos
for (let i = 0; i < poolSize; i++) {
    spellPool.push(new MagicSpell()) // Crear inactivos
}

const levelInfo = document.getElementById('level-info')
const timeElement = document.getElementById('time')
let startTime = 0 // El contador empieza desde 0 segundos

// Variables de generación
let enemySpawnCooldown
let obstacleSpawnCooldown
let bonusSpawnCooldown

// Timeouts o intervals
let enemyTimeoutId, obstacleTimeoutId, bonusTimeoutId, levelTimeoutId, gameTimeId

let level
let levelUpInterval = 15000 // Cada 15 segundos sube de nivel
let speedMultiplier = 1 // Multiplicador de velocidad enemigos y obstaculos
let spawnRateMultiplier = 1 // Multiplicador de aparicion de enemigos y obstaculos

function renderLevel() {
    levelInfo.textContent = 'Nivel: ' + level
    levelInfo.classList.add('flash')
    setTimeout(() => {
        levelInfo.classList.remove('flash')
    }, 1000)
}
/** contador de tiempo */
function renderTime() {
    timeElement.textContent = formatTime(startTime)
    startTime++
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}` // Formato MM:SS
}

function getMagicSpellFromPool() {
    // Encontrar el primer proyectil inactivo en el pool
    for (let i = 0; i < spellPool.length; i++) {
        if (!spellPool[i].active) {  // Suponemos que 'active' es una propiedad
            return spellPool[i]
        }
    }
    return null // Si no hay proyectiles disponibles, retorna null
}

function playerAttack() {
    if (!player.canAttack() || player.isJumping()) return // Verificar si el jugador puede atacar

    player.attack() // Ejecutar la función de ataque del jugador

    // Recuperar un hechizo del pool y activarlo
    let spell = getMagicSpellFromPool()
    if (spell) {
        spell.activate(player.getBonusPower())  // Activar el hechizo
        gameObjects.push(spell)
    }

    // Poner en cooldown el ataque
    player.setCanAttack(false) // Cambiar la bandera a false
    setTimeout(() => {
        player.setCanAttack(true) // Permitir atacar de nuevo después del cooldown
    }, magicSpellCooldown)
}

/** controles del juego */
function keyDownHandler(event) {
    const { key } = event
    switch (key) {
        case 'ArrowUp':
        case ' ':
            player.jump()
            break

        case 'x':
        case 'X':
            playerAttack()
            break
    }
}

function gameLoop() {
    gameObjects = gameObjects.filter(object => object.active) // Eliminar objetos inactivos
    gameObjects.forEach(object => object.update())

    enemies = enemies.filter(enemy => enemy.active) // Eliminar enemigos inactivos
    enemies.forEach(enemy => enemy.update())

    obstacles = obstacles.filter(obstacle => obstacle.active) // Eliminar obstaculos inactivos
    obstacles.forEach(obstacle => obstacle.update())

    if(player.isDead())
        endGame()
    else
        requestAnimationFrame(gameLoop)
}

function endGame() {
    gameOver = true

    stopBg()

    player.destroy()

    enemies.forEach(enemy => enemy.destroy())

    gameObjects.forEach(object => object.destroy())

    obstacles.forEach(obstacle => obstacle.destroy())
    
    clearTimeout(enemyTimeoutId)
    clearTimeout(obstacleTimeoutId)
    clearTimeout(bonusTimeoutId)
    clearTimeout(levelTimeoutId)
    clearInterval(gameTimeId)
    
    cancelAnimationFrame(gameLoop)  // Detiene el ciclo del juego

    // Pantalla Game Over
    document.getElementById('game-over-modal').classList.remove('hide-modal')
    document.getElementById('round-score').textContent = 'Tu puntuación: '+ gameScore
    document.getElementById('max-score').textContent = 'Record actual: '+ saveLocalStorage(gameScore)
    document.getElementById('restart-game').addEventListener('click', restartGame)
}

// Guardar mejor puntiación en localStorage
function saveLocalStorage(storageRecord) {
    if (localStorage.getItem('maxRecord')===null) {
        localStorage.setItem('maxRecord', storageRecord)
    } else {
        storageRecord = Math.max(localStorage.getItem('maxRecord'), storageRecord)
        localStorage.setItem('maxRecord', storageRecord)
    }
    return storageRecord
}

function restartGame() {
    // Reiniciar variables del juego
    enemies = []
    gameObjects = []
    obstacles = []
    setGameScore(0)
    
    startTime = 0
    speedMultiplier = 1
    spawnRateMultiplier = 1
    
    gameOver = false

    // Ocultar pantalla de "Game Over"
    document.getElementById('game-over-modal').classList.add('hide-modal')

    // Reiniciar el ciclo de juego
    startGame()
}

// Generadores automáticos
function generateEnemy() {
    if (gameOver) return

    let newEnemy = new Gorgon(speedMultiplier)
    enemies.push(newEnemy)
    enemyTimeoutId = setTimeout(generateEnemy, enemySpawnCooldown + Math.random() * 2000)
}

function generateObstacle() {
    if (gameOver) return

    let newObstacle = new Obstacle(speedMultiplier)
    obstacles.push(newObstacle)
    obstacleTimeoutId = setTimeout(generateObstacle, obstacleSpawnCooldown + Math.random() * 2000)
}

function generateBonus() {
    if (gameOver) return

    let newBonus = null
    Math.random() < 0.5 ? newBonus = new HealthBonus() : newBonus = new PowerBonus()
    gameObjects.push(newBonus)
    bonusTimeoutId = setTimeout(generateBonus, bonusSpawnCooldown + Math.random() * 3000)
}

function startGame() {
    const newPlayer = new Player()  // Crea el jugador
    setPlayer(newPlayer)  // Asigna el nuevo jugador al contexto

    moveBg()

    level = 0
    enemySpawnCooldown = 11000
    obstacleSpawnCooldown = 8500
    bonusSpawnCooldown = 35000

    renderLevel()
    renderGameScore(0)

    renderHealthPoints()
    renderBonusPower()

    // Iniciar la generación de objetos
    generateObstacle()
    setTimeout(generateEnemy, 3000)      // Retraso de 3 segundos para el primer enemigo
    setTimeout(generateBonus, 7000)     // Retraso de 7 segundos para el primer bonus

    // Iniciar el loop del juego
    gameTimeId = setInterval(renderTime, 1000)
    increaseGameLevel()
    gameLoop()

}

// Botón para iniciar juego
document.getElementById('skip-modal').addEventListener('click', ()=> {
    document.getElementById('modal').classList.add('hide-modal')
    startGame()
})

function increaseGameLevel() {
    level++
    speedMultiplier += 0.2 // Aumenta un 20% la velocidad enemigos y obstaculos
    spawnRateMultiplier -= 0.1 // Aumenta la frecuencia de aparicion de enemigos y obstaculos

    // Ajustar la frecuencia de generación de enemigos y obstaculos
    enemySpawnCooldown *= spawnRateMultiplier
    obstacleSpawnCooldown *= spawnRateMultiplier

    renderLevel()
    // Llamar nuevamente en el próximo intervalo de tiempo
    levelTimeoutId = setTimeout(increaseGameLevel, levelUpInterval)
}

function moveBg() {
    document.getElementById('middle-decor').classList.add('middle-decor-moving')
    document.getElementById('foreground').classList.add('foreground-moving')
    document.getElementById('ground').classList.add('ground-moving')
}

function stopBg() {
    document.getElementById('middle-decor').classList.remove('middle-decor-moving')
    document.getElementById('foreground').classList.remove('foreground-moving')
    document.getElementById('ground').classList.remove('ground-moving')
}
