export const gameContainer = document.getElementById('game-container')

export let player = null
export function setPlayer(newPlayer) {
    player = newPlayer
}

// actualizar bonus de poder en la pantalla
const bonusInfo = document.getElementById('bonus-power')
export function renderBonusPower() {
    bonusInfo.textContent = `+${player.getBonusPower()}`
    // Añadir la clase para la animación
    bonusInfo.classList.add('flash')
    // Remover la clase después de la animación
    setTimeout(() => {
        bonusInfo.classList.remove('flash')
    }, 1000)
}

/** actualizar puntuación en la pantalla */
const scoreElement = document.getElementById('score')
export let gameScore = 0
export function setGameScore(newScore) {
    gameScore = newScore
}
export function renderGameScore(addPoints) {
    scoreElement.textContent = `Puntos: ${gameScore+=addPoints}`
    scoreElement.classList.add('flash')
    setTimeout(() => {
        scoreElement.classList.remove('flash')
    }, 1000)
}

/** actualizar puntos de vida en la pantalla */
const hpInfo = document.getElementById('health-points')
export function renderHealthPoints() {
    hpInfo.textContent = player.getHp()
    hpInfo.classList.add('flash')
    setTimeout(() => {
        hpInfo.classList.remove('flash')
    }, 1000)
}